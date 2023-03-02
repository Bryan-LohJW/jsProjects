// const { MongoClient } = require('mongodb');

import Head from 'next/head';

import LocationList from '@/components/location/LocationList';
import { LocationType } from '@/models/types';
import { useContext, useEffect } from 'react';
import { LocationContext } from '@/store/location-context';
import Content from '@/components/ui/Content';
import classes from './index.module.css';

const thunderstorm: LocationType = {
	id: 'thunder6',
	city: 'SG',
	country: 'SG',
	weatherMain: 'Thunderstorm',
	weatherDescription: 'Very Thunder',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const drizzle: LocationType = {
	id: 'thunder5',
	city: 'SG',
	country: 'SG',
	weatherMain: 'Drizzle',
	weatherDescription: 'Very drizzle',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const rain: LocationType = {
	id: 'thunder4',
	city: 'SG',
	country: 'SG',
	weatherMain: 'Rain',
	weatherDescription: 'Very Rain',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const snow: LocationType = {
	id: 'thunder3',
	city: 'SG',
	country: 'SG',
	weatherMain: 'snow',
	weatherDescription: 'Very snow',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const clear: LocationType = {
	id: 'thunder2',
	city: 'SG',
	country: 'SG',
	weatherMain: 'Clear',
	weatherDescription: 'Very Clear',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const clouds: LocationType = {
	id: 'thunder1',
	city: 'SG',
	country: 'SG',
	weatherMain: 'Clouds',
	weatherDescription: 'Very Clouds',
	temp: 30,
	humidity: 30,
	dateTime: new Date(),
};

const ANOTHER_DUMMY_LOCATIONS = [
	thunderstorm,
	drizzle,
	rain,
	snow,
	clear,
	clouds,
];

const Home = () => {
	const { locations, setLocations } = useContext(LocationContext);

	useEffect(() => {
		console.log('useEffect Triggered');
		async function fetchData() {
			const response = await fetch('/api/locations');
			const data = await response.json();
			if (data.locationArray.length === locations.length) {
				return;
			}
			setLocations(data.locationArray);
		}
		fetchData();
	}, [locations, setLocations]);
	return (
		<>
			<Head>
				<title>Weather App</title>
				<meta
					name="description"
					content="Weather app for your location"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Content>
				<LocationList />
			</Content>
		</>
	);
};

export default Home;
