package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const (
	dtdcURL        = "https://www.dtdc.com/wp-json/custom/v1/domestic/track"
	logFileName    = "dtdc_log.jsonl"
	requestTimeout = 15 * time.Second
)

// trackReq payload sent to DTDC
type trackReq struct {
	TrackType   string `json:"trackType"`
	TrackNumber string `json:"trackNumber"`
}

// logEntry structure written as one JSON-per-line
type logEntry struct {
	Timestamp   string          `json:"timestamp"`
	TrackNumber string          `json:"track_number"`
	Request     json.RawMessage `json:"request"`
	Response    json.RawMessage `json:"response"`
	StatusCode  int             `json:"status_code"`
	Error       string          `json:"error,omitempty"`
}

// DTDCResponse is the structure returned by DTDC API
type DTDCResponse struct {
	StatusCode        int    `json:"statusCode"`
	StatusDescription string `json:"statusDescription"`
	ErrorMessage      string `json:"errorMessage"`
	ShipmentNo        string `json:"shipmentNo"`
	Header            struct {
		ReferenceNo              string `json:"referenceNo"`
		OriginCity               string `json:"originCity"`
		OriginPincode            string `json:"originPincode"`
		DestinationCity          string `json:"destinationCity"`
		DestinationPincode       string `json:"destinationPincode"`
		BookingDate              string `json:"bookingDate"`
		BookingTime              string `json:"bookingTime"`
		CurrentStatusCode        string `json:"currentStatusCode"`
		CurrentStatusDescription string `json:"currentStatusDescription"`
		CurrentStatusDate        string `json:"currentStatusDate"`
		CurrentStatusTime        string `json:"currentStatusTime"`
		ShipmentType             string `json:"shipmentType"`
		ReceiverName             string `json:"receiverName"`
		DeliveredBy              string `json:"deliveredBy"`
		OpsEdd                   string `json:"opsEdd"`
		OpsRedd                  string `json:"opsRedd"`
		NoOfPieces               int    `json:"noOfPieces"`
		CurrentLocationCityName  string `json:"currentLocationCityName"`
		NextLocationCityName     string `json:"nextLocationCityName"`
	} `json:"header"`
	Milestones []struct {
		MileName           string `json:"mileName"`
		MileLocationName   string `json:"mileLocationName"`
		MileStatusDateTime string `json:"mileStatusDateTime"`
		MileStatus         string `json:"mileStatus"`
		BranchName         string `json:"branchName"`
	} `json:"milestones"`
	Statuses []struct {
		ActBranchName     string `json:"actBranchName"`
		ActCityName       string `json:"actCityName"`
		StatusDescription string `json:"statusDescription"`
		Remarks           string `json:"remarks"`
		StatusTimestamp   string `json:"statusTimestamp"`
	} `json:"statuses"`
}

// TrackingInfo is a simplified view for display
type TrackingInfo struct {
	TrackingNumber    string          `json:"trackingNumber"`
	ReferenceNo       string          `json:"referenceNo"`
	Status            string          `json:"status"`
	StatusDate        string          `json:"statusDate"`
	Origin            string          `json:"origin"`
	Destination       string          `json:"destination"`
	BookingDate       string          `json:"bookingDate"`
	EstimatedDelivery string          `json:"estimatedDelivery"`
	CurrentLocation   string          `json:"currentLocation"`
	NextLocation      string          `json:"nextLocation"`
	Milestones        []Milestone     `json:"milestones"`
	Timeline          []TimelineEvent `json:"timeline"`
	IsDelivered       bool            `json:"isDelivered"`
	Error             string          `json:"error,omitempty"`
}

type Milestone struct {
	Name      string `json:"name"`
	Location  string `json:"location"`
	DateTime  string `json:"dateTime"`
	Completed bool   `json:"completed"`
}

type TimelineEvent struct {
	DateTime string `json:"dateTime"`
	Location string `json:"location"`
	Status   string `json:"status"`
	Details  string `json:"details"`
}

// queryDTDC sends the POST request to DTDC API
func queryDTDC(trackNumber string) ([]byte, int, error) {
	reqObj := trackReq{
		TrackType:   "cnno",
		TrackNumber: trackNumber,
	}
	reqJSON, _ := json.Marshal(reqObj)

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, dtdcURL, bytes.NewReader(reqJSON))
	if err != nil {
		return nil, 0, fmt.Errorf("creating request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Origin", "https://www.dtdc.com")
	req.Header.Set("Referer", "https://www.dtdc.com/track-your-shipment/")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36")
	req.Header.Set("Sec-Ch-Ua-Platform", `"macOS"`)

	client := &http.Client{
		Timeout: requestTimeout,
	}

	res, err := client.Do(req)
	if err != nil {
		appendLog(trackNumber, reqJSON, 0, err)
		return nil, 0, fmt.Errorf("request failed: %w", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		appendLog(trackNumber, reqJSON, res.StatusCode, err)
		return nil, res.StatusCode, fmt.Errorf("reading response: %w", err)
	}

	appendLog(trackNumber, reqJSON, res.StatusCode, bytesToError(body, res.StatusCode))
	return body, res.StatusCode, nil
}

func bytesToError(body []byte, status int) error {
	if status >= 200 && status < 300 {
		return nil
	}
	return fmt.Errorf("status %d: %s", status, string(body))
}

func appendLog(trackNumber string, reqJSON []byte, statusCode int, errObj error) error {
	entry := logEntry{
		Timestamp:   time.Now().UTC().Format(time.RFC3339),
		TrackNumber: trackNumber,
		Request:     json.RawMessage(reqJSON),
		StatusCode:  statusCode,
	}
	if errObj != nil {
		entry.Error = errObj.Error()
	}

	logPath := filepath.Clean(logFileName)
	f, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o644)
	if err != nil {
		return fmt.Errorf("open log file: %w", err)
	}
	defer f.Close()

	line, err := json.Marshal(entry)
	if err != nil {
		return fmt.Errorf("marshal log entry: %w", err)
	}
	_, err = f.Write(append(line, '\n'))
	if err != nil {
		return fmt.Errorf("write log file: %w", err)
	}
	return nil
}

// parseTrackingResponse converts raw DTDC API response to TrackingInfo
func parseTrackingResponse(body []byte, trackingNum string) (*TrackingInfo, error) {
	var resp DTDCResponse
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, fmt.Errorf("unmarshal response: %w", err)
	}

	info := &TrackingInfo{
		TrackingNumber:    trackingNum,
		ReferenceNo:       resp.Header.ReferenceNo,
		Status:            resp.Header.CurrentStatusDescription,
		StatusDate:        formatDateTime(resp.Header.CurrentStatusDate, resp.Header.CurrentStatusTime),
		Origin:            fmt.Sprintf("%s (%s)", resp.Header.OriginCity, resp.Header.OriginPincode),
		Destination:       fmt.Sprintf("%s (%s)", resp.Header.DestinationCity, resp.Header.DestinationPincode),
		BookingDate:       formatDateTime(resp.Header.BookingDate, resp.Header.BookingTime),
		EstimatedDelivery: formatDate(resp.Header.OpsEdd),
		CurrentLocation:   resp.Header.CurrentLocationCityName,
		NextLocation:      resp.Header.NextLocationCityName,
	}

	// Parse milestones
	for _, m := range resp.Milestones {
		if m.MileName == "" {
			continue
		}
		milestone := Milestone{
			Name:      m.MileName,
			Location:  m.MileLocationName,
			DateTime:  formatDate(m.MileStatusDateTime),
			Completed: m.MileStatus == "A",
		}
		info.Milestones = append(info.Milestones, milestone)

		if m.MileName == "Delivered" && m.MileStatus == "A" {
			info.IsDelivered = true
		}
	}

	// Parse timeline/statuses
	for _, s := range resp.Statuses {
		event := TimelineEvent{
			DateTime: formatDate(s.StatusTimestamp),
			Location: fmt.Sprintf("%s, %s", s.ActBranchName, s.ActCityName),
			Status:   s.StatusDescription,
			Details:  cleanHTML(s.Remarks),
		}
		info.Timeline = append(info.Timeline, event)
	}

	return info, nil
}

func formatDateTime(date, timeStr string) string {
	if date == "" {
		return "N/A"
	}
	combined := strings.TrimSpace(date + " " + timeStr)
	t, err := parseFlexibleTime(combined)
	if err == nil {
		return t.Format("02 Jan 2006, 03:04 PM")
	}
	return combined
}

func formatDate(dateTime string) string {
	if dateTime == "" || dateTime == "null" {
		return "N/A"
	}
	t, err := parseFlexibleTime(dateTime)
	if err == nil {
		return t.Format("02 Jan 2006, 03:04 PM")
	}
	return dateTime
}

func parseFlexibleTime(s string) (time.Time, error) {
	s = strings.TrimSpace(s)
	formats := []string{
		"2006-01-02 15:04:05.0",
		"2006-01-02 15:04:05",
		"2006-01-02",
		time.RFC3339,
	}
	for _, format := range formats {
		if t, err := time.Parse(format, s); err == nil {
			return t, nil
		}
	}
	return time.Time{}, fmt.Errorf("unable to parse time: %s", s)
}

func cleanHTML(s string) string {
	s = strings.ReplaceAll(s, "</a>", "")
	for strings.Contains(s, "<a ") {
		start := strings.Index(s, "<a ")
		if start == -1 {
			break
		}
		end := strings.Index(s[start:], ">")
		if end == -1 {
			break
		}
		s = s[:start] + s[start+end+1:]
	}
	s = strings.ReplaceAll(s, "<b>", "")
	s = strings.ReplaceAll(s, "</b>", "")
	s = strings.ReplaceAll(s, "<span id='sc' style='color:blue;'>", "")
	s = strings.ReplaceAll(s, "</span>", "")
	s = strings.TrimSpace(s)
	return s
}

// getRecentSearches retrieves the most recent unique tracking IDs from the log
func getRecentSearches(limit int) ([]string, error) {
	if limit <= 0 {
		limit = 10
	}

	logPath := filepath.Clean(logFileName)
	file, err := os.Open(logPath)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, fmt.Errorf("open log file: %w", err)
	}
	defer file.Close()

	// Read all lines to process in reverse order
	var entries []logEntry
	decoder := json.NewDecoder(file)
	for {
		var entry logEntry
		if err := decoder.Decode(&entry); err == io.EOF {
			break
		} else if err != nil {
			continue // Skip invalid lines
		}
		entries = append(entries, entry)
	}

	// Process in reverse to get most recent first
	seen := make(map[string]bool)
	var recent []string
	for i := len(entries) - 1; i >= 0 && len(recent) < limit; i-- {
		trackNum := entries[i].TrackNumber
		if trackNum != "" && !seen[trackNum] {
			seen[trackNum] = true
			recent = append(recent, trackNum)
		}
	}

	return recent, nil
}
