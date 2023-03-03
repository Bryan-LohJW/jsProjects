import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

import { LocationStorageType, LocationType } from '@/models/types';
import { LocationContext } from '@/store/location-context';
import classes from './Location.module.css';

const Location: React.FC<{
	location: LocationStorageType;
}> = (props) => {
	const { removeLocation } = useContext(LocationContext);
	const { location } = props;
	const [loadedLocation, setLoadedLocation] = useState<LocationType>();
	const router = useRouter();

	useEffect(() => {
		async function loadWeather() {
			const apiResponse = await fetch(
				`/api/getWeather?lat=${location.coordinate[0]}&lon=${location.coordinate[1]}`
			);
			const apiData = await apiResponse.json();

			const weatherData = apiData.data;

			const hydratedLocation: LocationType = {
				id: location.id,
				city: location.city,
				country: location.country,
				weatherMain: weatherData.weather[0].main,
				weatherDescription: weatherData.weather[0].description
					.split(' ')
					.map((word: string) => {
						return word.charAt(0).toUpperCase() + word.slice(1);
					})
					.join(' '),
				temp: weatherData.main.temp,
				humidity: weatherData.main.humidity,
				precipitation: weatherData.rain ? weatherData.rain['1h'] : 0,
				wind: weatherData.wind.speed,
				dateTime: new Date(
					weatherData.dt * 1000 + weatherData.timezone * 1000
				),
				icon: weatherData.weather[0].icon,
			};

			setLoadedLocation(hydratedLocation);
		}
		loadWeather();
	}, [location]);

	const locationDetailHandler = () => {
		console.log(location.id);
		router.push(
			`/location/${location.city
				.toLowerCase()
				.replaceAll(' ', '_')}-${location.country
				.toLowerCase()
				.replaceAll(' ', '_')}?id=${location.id}`,
			`/location/${location.city
				.toLowerCase()
				.replaceAll(' ', '_')}-${location.country
				.toLowerCase()
				.replaceAll(' ', '_')}`
		);
	};

	const weatherMain = loadedLocation ? loadedLocation.weatherMain : '';

	let weatherClass: string = '';

	const weatherTheme = (weatherMain: string) => {
		switch (weatherMain) {
			case 'Thunderstorm':
				return classes.thunderstorm;
			case 'Drizzle':
				return classes.drizzle;
			case 'Rain':
				return classes.rain;
			case 'Snow':
			case 'snow':
				return classes.snow;
			case 'Clear':
				return classes.clear;
			case 'Clouds':
				return classes.clouds;
			default:
				return classes.clear;
		}
	};

	weatherClass = weatherTheme(weatherMain!);
	console.log(
		`${location.country.toLowerCase().replaceAll(' ', '_')}/${location.city
			.toLowerCase()
			.replaceAll(' ', '_')}`
	);

	return (
		<div
			className={classes.location + ' ' + weatherClass}
			onClick={locationDetailHandler}
		>
			<header>
				<div>
					<p className={classes.title}>{location.city}</p>
					<p className={classes.time}>
						{loadedLocation
							? loadedLocation.dateTime
									.toUTCString()
									.slice(16, -7) + ' H'
							: ''}
					</p>
				</div>
				<div className={classes.weatherImage}>
					<p>
						{loadedLocation
							? loadedLocation.weatherDescription
							: 'Loading...'}
					</p>
					<Image
						src={
							loadedLocation
								? `http://openweathermap.org/img/wn/${loadedLocation.icon}@2x.png`
								: ''
						}
						alt="Weather Image"
						width={60}
						height={60}
					/>
				</div>
			</header>
			<main className={classes.content}>
				<div className={classes.information}>
					<p className={classes.label}>Temperature</p>
					<p>
						{loadedLocation
							? loadedLocation.temp.toFixed(1) + '\u00B0C'
							: ''}
					</p>
				</div>
				<div className={classes.information}>
					<p className={classes.label}>Rain (1h)</p>
					<p>
						{loadedLocation
							? loadedLocation.precipitation + 'mm'
							: ''}
					</p>
				</div>
				<div className={classes.information}>
					<p className={classes.label}>Wind</p>
					<p>{loadedLocation ? loadedLocation.wind + 'm/s' : ''}</p>
				</div>
				<div className={classes.information}>
					<p className={classes.label}>Humidity</p>
					<p>{loadedLocation ? loadedLocation.humidity + '%' : ''}</p>
				</div>
			</main>
		</div>
	);
};

export default Location;
