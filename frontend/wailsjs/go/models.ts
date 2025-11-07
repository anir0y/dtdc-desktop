export namespace main {
	
	export class Milestone {
	    name: string;
	    location: string;
	    dateTime: string;
	    completed: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Milestone(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.location = source["location"];
	        this.dateTime = source["dateTime"];
	        this.completed = source["completed"];
	    }
	}
	export class TimelineEvent {
	    dateTime: string;
	    location: string;
	    status: string;
	    details: string;
	
	    static createFrom(source: any = {}) {
	        return new TimelineEvent(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dateTime = source["dateTime"];
	        this.location = source["location"];
	        this.status = source["status"];
	        this.details = source["details"];
	    }
	}
	export class TrackingInfo {
	    trackingNumber: string;
	    referenceNo: string;
	    status: string;
	    statusDate: string;
	    origin: string;
	    destination: string;
	    bookingDate: string;
	    estimatedDelivery: string;
	    currentLocation: string;
	    nextLocation: string;
	    milestones: Milestone[];
	    timeline: TimelineEvent[];
	    isDelivered: boolean;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new TrackingInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.trackingNumber = source["trackingNumber"];
	        this.referenceNo = source["referenceNo"];
	        this.status = source["status"];
	        this.statusDate = source["statusDate"];
	        this.origin = source["origin"];
	        this.destination = source["destination"];
	        this.bookingDate = source["bookingDate"];
	        this.estimatedDelivery = source["estimatedDelivery"];
	        this.currentLocation = source["currentLocation"];
	        this.nextLocation = source["nextLocation"];
	        this.milestones = this.convertValues(source["milestones"], Milestone);
	        this.timeline = this.convertValues(source["timeline"], TimelineEvent);
	        this.isDelivered = source["isDelivered"];
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

