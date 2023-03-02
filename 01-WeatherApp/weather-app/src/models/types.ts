export interface LocationStorageType {
	id: string;
	city: string;
	country: string;
	coordinate: number[];
}

export interface WeatherType {
	weatherMain: string;
	weatherDescription: string;
	temp: number;
	humidity: number;
	precipitation: number;
	wind: number;
	dateTime: Date;
}

export interface LocationType {
	id: string;
	city: string;
	country: string;
	weatherMain: string;
	weatherDescription: string;
	temp: number;
	humidity: number;
	precipitation: number;
	wind: number;
	dateTime: Date;
}

export interface LocationForecastType {
	location: LocationStorageType;
	weatherList: WeatherType[];
}

export interface ResponseFuncs {
	GET?: Function;
	POST?: Function;
	PUT?: Function;
	DELETE?: Function;
}

export interface WeatherFetchData {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	};
	weather: [
		{
			id: number;
			main: string;
			description: string;
			icon: string;
		}
	];
	clouds: {
		all: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	visibility: number;
	pop: number;
	rain?: {
		'3h': number;
	};
	sys: {
		pod: string;
	};
	dt_txt: string;
}

export interface WeatherForecastFetchData {
	cod: string;
	message: number;
	cnt: number;
	list: WeatherFetchData[];
	city: {
		id: number;
		name: string;
		coord: {
			lat: number;
			lon: number;
		};
		country: string;
		population: number;
		timezone: number;
		sunrise: number;
		sunset: number;
	};
}
