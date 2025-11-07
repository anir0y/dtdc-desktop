package main

import (
	"context"
	"fmt"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// TrackShipment tracks a shipment by its ID and returns the tracking info
func (a *App) TrackShipment(trackingID string) (*TrackingInfo, error) {
	if trackingID == "" {
		return nil, fmt.Errorf("tracking ID cannot be empty")
	}

	respBody, statusCode, err := queryDTDC(trackingID)
	if err != nil {
		return &TrackingInfo{
			Error: fmt.Sprintf("Failed to query DTDC: %v", err),
		}, err
	}

	if statusCode < 200 || statusCode >= 300 {
		return &TrackingInfo{
			Error: fmt.Sprintf("HTTP %d: Request failed", statusCode),
		}, fmt.Errorf("HTTP %d", statusCode)
	}

	info, err := parseTrackingResponse(respBody, trackingID)
	if err != nil {
		return &TrackingInfo{
			Error: fmt.Sprintf("Failed to parse response: %v", err),
		}, err
	}

	return info, nil
}

// GetRecentSearches returns the most recent unique tracking IDs
func (a *App) GetRecentSearches(limit int) ([]string, error) {
	return getRecentSearches(limit)
}
