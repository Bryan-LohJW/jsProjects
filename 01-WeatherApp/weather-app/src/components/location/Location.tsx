import { LocationStorageType, LocationType } from '@/models/types';
import { LocationContext } from '@/store/location-context';
import { weatherApiKey } from '@/utils/credentials';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import classes from './Location.module.css';

const Location: React.FC<{
	location: LocationStorageType;
}> = (props) => {
	const { removeLocation } = useContext(LocationContext);
	const { location } = props;
	const [loadedLocation, setLoadedLocation] = useState<LocationType>();

	useEffect(() => {
		async function loadWeather() {
			const weatherResponse = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${location.coordinate[0]}&lon=${location.coordinate[1]}&appid=${weatherApiKey}&units=metric`
			);

			if (!weatherResponse.ok) {
				console.log(weatherResponse.statusText);
				console.log('error');
				return;
			}

			const weatherData = await weatherResponse.json();

			const hydratedLocation: LocationType = {
				id: location.id,
				city: location.city,
				country: location.country,
				weatherMain: weatherData.weather[0].main,
				weatherDescription: weatherData.weather[0].description,
				temp: weatherData.main.temp,
				humidity: weatherData.main.humidity,
			};

			setLoadedLocation(hydratedLocation);
		}
		loadWeather();
	}, [location]);

	const deleteHandler = async () => {
		const response = await fetch('/api/locations', {
			method: 'DELETE',
			body: JSON.stringify({ id: location.id }),
		});
		if (!response.ok) {
			return;
		}
		removeLocation(location.id);
	};

	const weatherMain = loadedLocation ? loadedLocation.weatherMain : '';

	let weatherIconSource: string = '';
	let weatherClass: string = '';

	const weatherTheme = (weatherMain: string) => {
		switch (weatherMain) {
			case 'Thunderstorm':
				weatherIconSource =
					'http://openweathermap.org/img/wn/11d@2x.png';
				return classes.thunderstorm;
			case 'Drizzle':
				weatherIconSource =
					'http://openweathermap.org/img/wn/09d@2x.png';
				return classes.drizzle;
			case 'Rain':
				weatherIconSource =
					'http://openweathermap.org/img/wn/10d@2x.png';
				return classes.rain;
			case 'Snow':
			case 'snow':
				weatherIconSource =
					'http://openweathermap.org/img/wn/13d@2x.png';
				return classes.snow;
			case 'Clear':
				weatherIconSource =
					'http://openweathermap.org/img/wn/01d@2x.png';
				return classes.clear;
			case 'Clouds':
				weatherIconSource =
					'http://openweathermap.org/img/wn/03d@2x.png';
				return classes.clouds;
			default:
				return '';
		}
	};

	weatherClass = weatherTheme(weatherMain!);

	return (
		<div className={classes.location + ' ' + weatherClass}>
			<header>
				<Image
					src={weatherIconSource}
					alt="Weather Image"
					width={60}
					height={60}
				/>

				<div>
					<p className={classes.title}>{location.city}</p>
					<p>Day and time</p>
				</div>
			</header>
			<main className={classes.content}>
				<p>Precipitation</p>
				<p>Wind</p>
				<p>Humidity</p>
				<p>
					{loadedLocation
						? loadedLocation.weatherDescription
						: 'Loading...'}
				</p>
				<button onClick={deleteHandler}>Delete</button>
			</main>
			<footer className={classes.footer}>
				<p>Forecast for next few days</p>
			</footer>
		</div>
	);
};

export default Location;
