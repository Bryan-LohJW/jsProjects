import { createRef, useContext, useState } from 'react';

import Modal from '../ui/Modal';
import { LocationContext } from '@/store/location-context';
import classes from './LocationForm.module.css';
import lookup from 'country-code-lookup';
import { LocationStorageType, LocationType } from '@/models/types';

const LocationForm: React.FC<{}> = () => {
	// consider pulling out some of the logic of fetching data to a custom hook
	const { toggleLocationForm, addLocation } = useContext(LocationContext);

	const [isLoading, setIsLoading] = useState(false);
	const [isCountryError, setIsCountryError] = useState(false);
	const [isCityError, setIsCityError] = useState(false);
	const [countryErrorMessage, setCountryErrorMessage] = useState('');
	const [cityErrorMessage, setCityErrorMessage] = useState('');

	const countryRef = createRef<HTMLInputElement>();
	const cityRef = createRef<HTMLInputElement>();

	const onCountryChange = () => {
		setIsCountryError(false);
		setCountryErrorMessage('');
	};

	const onCityChange = () => {
		setIsCityError(false);
		setCityErrorMessage('');
	};

	const onAddLocation = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		if (isCountryError || isCityError) {
			return;
		}

		setIsLoading(true);

		if (countryRef.current!.value.trim().length === 0) {
			setIsCountryError(true);
			setCountryErrorMessage('Enter a country');
			setIsLoading(false);
			return;
		}

		if (cityRef.current!.value.trim().length === 0) {
			setIsCityError(true);
			setCityErrorMessage('Enter a city');
			setIsLoading(false);
			return;
		}

		const formattedCountry = countryRef
			.current!.value.toLowerCase()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		const countryCodeData = lookup.byCountry(formattedCountry);
		let countryCode = '';
		if (countryCodeData === null) {
			setIsCountryError(true);
			setCountryErrorMessage('Unable to find country');
			setIsLoading(false);
			return;
		}
		countryCode = countryCodeData.iso2;

		const geoLocationResponse = await fetch(
			`/api/getGeolocation?city=${
				cityRef.current!.value
			}&country=${countryCode}`
		);

		if (!geoLocationResponse.ok) {
			console.log(geoLocationResponse.statusText);
			setIsLoading(false);
			return;
		}

		const geoLocationData = await geoLocationResponse.json();

		if (geoLocationData.length === 0) {
			setIsCityError(true);
			setCityErrorMessage('Unable to find city');
			setIsLoading(false);
			return;
		}
		const { lat, lon, name } = geoLocationData[0];

		const locationStorage: LocationStorageType = {
			id: Math.random().toString(),
			city: name,
			country: countryCodeData.country,
			coordinate: [lat, lon],
		};
		await fetch('/api/locations', {
			method: 'POST',
			body: JSON.stringify(locationStorage),
		});

		addLocation(locationStorage);
		setIsLoading(false);
		toggleLocationForm();
	};

	return (
		<Modal onClick={toggleLocationForm}>
			<p className={classes.header}>Add a new location</p>
			<form onSubmit={onAddLocation} className={classes.form}>
				<div className={classes['input-field']}>
					<label htmlFor="country">
						Country:{' '}
						{isCountryError &&
							countryErrorMessage.trim().length !== 0 && (
								<span className={classes.error}>
									{countryErrorMessage}
								</span>
							)}
					</label>

					<input
						type="text"
						id="country"
						name="country"
						ref={countryRef}
						onChange={onCountryChange}
					/>
				</div>
				<div className={classes['input-field']}>
					<label htmlFor="city">
						City:{' '}
						{isCityError &&
							cityErrorMessage.trim().length !== 0 && (
								<span className={classes.error}>
									{cityErrorMessage}
								</span>
							)}
					</label>

					<input
						type="text"
						id="city"
						name="city"
						ref={cityRef}
						onChange={onCityChange}
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					Go
				</button>
			</form>
		</Modal>
	);
};

export default LocationForm;
