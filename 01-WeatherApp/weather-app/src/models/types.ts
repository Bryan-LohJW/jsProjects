export interface LocationType {
	id: string;
	city: string;
	country: string;
	weatherMain: string;
	weatherDescription: string;
	temp: number;
	humidity: number;
}

export interface LocationStorageType {
	id: string;
	city: string;
	country: string;
	coordinate: number[];
}

export interface ResponseFuncs {
	GET?: Function;
	POST?: Function;
	PUT?: Function;
	DELETE?: Function;
}
