import { LocationStorageType, LocationType } from '@/models/types';
import { LocationContext } from '@/store/location-context';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
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
				dateTime: new Date(weatherData.dt * 1000),
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
				.replaceAll(' ', '_')}`
		);
	};

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
		<div
			className={classes.location + ' ' + weatherClass}
			onClick={locationDetailHandler}
		>
			<header>
				<div>
					<p className={classes.title}>{location.city}</p>
					<p className={classes.time}>
						{loadedLocation
							? loadedLocation.dateTime.toLocaleTimeString()
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
						src={weatherIconSource}
						alt="Weather Image"
						width={60}
						height={60}
					/>
				</div>
			</header>
			<main className={classes.content}>
				<div className={classes.information}>
					<p className={classes.label}>Precipitation (1h)</p>
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

				{/* <button onClick={deleteHandler}>Delete</button> */}
			</main>
		</div>
	);
};

export default Location;
