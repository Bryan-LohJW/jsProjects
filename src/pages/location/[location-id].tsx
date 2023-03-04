import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import lookup from 'country-code-lookup';
import {
	LocationForecastType,
	WeatherForecastFetchData,
	WeatherType,
} from '@/models/types';
import Content from '@/components/ui/Content';
import classes from './[location-id].module.css';
import LocationDetails from '@/components/location/LocationDetails';
import { LocationContext } from '@/store/location-context';

const LocationDetail = () => {
	const router = useRouter();
	const [daysForecast, setDaysForecast] = useState<WeatherType[][]>();
	const locationDetailsFromAsPath = router.asPath.slice(10);
	const [city, country] = locationDetailsFromAsPath!.split('-');
	const { removeLocation, username } = useContext(LocationContext);
	const id: string = router.query.id as string;
	console.log(id);

	useEffect(() => {
		async function fetchData() {
			const formattedCountry = country
				.toLowerCase()
				.split('_')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			const countryCodeData = lookup.byCountry(formattedCountry);
			let countryCode = '';
			if (countryCodeData === null) {
				// handle error
				return;
			}
			countryCode = countryCodeData.iso2;

			const formattedCity = city.split('_').join(' ');

			const geoLocationResponse = await fetch(
				`/api/getGeolocation?city=${formattedCity}&country=${countryCode}`
			);

			if (!geoLocationResponse.ok) {
				console.log(geoLocationResponse.statusText);
				return;
			}

			const geoData = await geoLocationResponse.json();

			const geoLocationData = geoData.data;

			console.log(geoLocationData);

			if (geoLocationData.length === 0) {
				// handle error
				return;
			}
			const { lat, lon, name } = geoLocationData[0];

			const weatherForecaseResponse = await fetch(
				`/api/getForecast?lat=${lat}&lon=${lon}`
			);

			if (!weatherForecaseResponse.ok) {
				// handle error
				return;
			}
			const forecastData = await weatherForecaseResponse.json();
			const weatherForecastData: WeatherForecastFetchData =
				forecastData.data;
			const loadedForecastData: LocationForecastType = {
				location: {
					id: 'hello',
					city: formattedCity,
					country: formattedCountry,
					coordinate: [lat, lon],
				},
				weatherList: weatherForecastData.list.map((weatherData) => {
					return {
						weatherMain: weatherData.weather[0].main,
						weatherDescription: weatherData.weather[0].description,
						temp: weatherData.main.temp,
						humidity: weatherData.main.humidity,
						precipitation: weatherData.rain
							? weatherData.rain['3h']
							: 0,
						wind: weatherData.wind.speed,
						dateTime: new Date(weatherData.dt_txt),
						icon: weatherData.weather[0].icon,
					};
				}),
			};

			const filterByDate: { [day: number]: WeatherType[] } = {};
			for (const timestamp of loadedForecastData.weatherList) {
				filterByDate[timestamp.dateTime.getDay()] = filterByDate[
					timestamp.dateTime.getDay()
				]
					? filterByDate[timestamp.dateTime.getDay()].concat(
							timestamp
					  )
					: [timestamp];
			}
			const sortByDate: WeatherType[][] = [];
			for (const key in filterByDate) {
				sortByDate.push(filterByDate[key]);
			}
			sortByDate.sort(
				(a, b) => a[0].dateTime.getDate() - b[0].dateTime.getDate()
			);

			setDaysForecast(sortByDate);
		}

		fetchData();
	}, [city, country]);

	const deleteHandler = async () => {
		const response = await fetch(`/api/locations?user=${username}`, {
			method: 'DELETE',
			body: JSON.stringify({ id: id }),
		});
		if (!response.ok) {
			return;
		}
		removeLocation(id);
		router.push('/');
	};

	return (
		<>
			<Content>
				<p className={classes.header}>
					{city
						.toLowerCase()
						.split('_')
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						)
						.join(' ')}
					,{' '}
					{country
						.toLowerCase()
						.split('_')
						.map(
							(word) =>
								word.charAt(0).toUpperCase() + word.slice(1)
						)
						.join(' ')}
				</p>
				<LocationDetails forecast={daysForecast!} />
				<button className={classes.action} onClick={deleteHandler}>
					Delete This Location
				</button>
			</Content>
		</>
	);
};

export default LocationDetail;
