import { useRouter } from 'next/router';

import lookup from 'country-code-lookup';
import { useEffect, useState } from 'react';
import {
	LocationForecastType,
	WeatherForecastFetchData,
	WeatherType,
} from '@/models/types';
import Content from '@/components/ui/Content';
import classes from './[location-id].module.css';
import LocationDetails from '@/components/location/LocationDetails';

const LocationDetail = () => {
	const router = useRouter();
	const [daysForecast, setDaysForecast] = useState<WeatherType[][]>();
	const locationDetailsFromAsPath = router.asPath.slice(10);
	const [city, country] = locationDetailsFromAsPath!.split('-');

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
				`http://api.openweathermap.org/geo/1.0/direct?q=${formattedCity},${countryCode}&limit=1&appid=${process.env.WEATHER_KEY}`
			);

			if (!geoLocationResponse.ok) {
				console.log(geoLocationResponse.statusText);
				return;
			}

			const geoLocationData = await geoLocationResponse.json();

			console.log(geoLocationData);

			if (geoLocationData.length === 0) {
				// handle error
				return;
			}
			const { lat, lon, name } = geoLocationData[0];

			const weatherForecaseResponse = await fetch(
				`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}&units=metric`
			);

			if (!weatherForecaseResponse.ok) {
				// handle error
				return;
			}

			const weatherForecastData: WeatherForecastFetchData =
				await weatherForecaseResponse.json();

			console.log(weatherForecastData);
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
						dateTime: new Date(+weatherData.dt * 1000),
					};
				}),
			};

			console.log(loadedForecastData);
			// split the data into different days, max 6 days
			// make an array with the smallest date, in terms of yr month day
			// should pull all of this into one function
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
			console.log(sortByDate);

			setDaysForecast(sortByDate);
		}

		fetchData();
	}, [city, country]);

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
			</Content>
		</>
	);
};

export default LocationDetail;
