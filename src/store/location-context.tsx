import React, { useState } from 'react';

import { LocationStorageType, LocationType } from '@/models/types';

type LocationContextObj = {
	isLogin: boolean;
	toggleLogin: () => void;
	username: string;
	setUsername: (username: string) => void;
	showLocationForm: boolean;
	toggleLocationForm: () => void;
	locations: LocationStorageType[];
	addLocation: (loaction: LocationStorageType) => void;
	setLocations: (locations: LocationStorageType[]) => void;
	removeLocation: (id: string) => void;
};

export const LocationContext = React.createContext<LocationContextObj>({
	isLogin: true,
	toggleLogin: () => {},
	username: '',
	setUsername: (username: string) => {},
	showLocationForm: false,
	toggleLocationForm: () => {},
	locations: [],
	addLocation: (loaction: LocationStorageType) => {},
	setLocations: (locations: LocationStorageType[]) => {},
	removeLocation: (id: string) => {},
});

const LocationContextProvider: React.FC<{ children: React.ReactNode }> = (
	props
) => {
	const [isLogin, setIsLogin] = useState(true); // default is true
	const [username, setUsername] = useState('');
	const [showLocationForm, setshowLocationForm] = useState(false);
	const [locations, setLocations] = useState<LocationStorageType[]>([]);

	const toggleLogin = () => {
		if (isLogin) {
			setLocations([]);
		}
		setIsLogin((prevstate) => !prevstate);
	};

	const toggleLocationForm = () => {
		setshowLocationForm((prevState) => !prevState);
	};

	const addLocation = (location: LocationStorageType) => {
		setLocations((prevState) => prevState.concat(location));
	};

	const removeLocation = (id: string) => {
		setLocations((prevState) => {
			return prevState.filter((location) => {
				if (location.id !== id) {
					console.log('not removed');
					return true;
				}
				console.log('removed');
				return false;
			});
		});
	};

	const contextValue: LocationContextObj = {
		isLogin: isLogin,
		toggleLogin: toggleLogin,
		username: username,
		setUsername: setUsername,
		showLocationForm: showLocationForm,
		toggleLocationForm: toggleLocationForm,
		locations: locations,
		addLocation: addLocation,
		setLocations: setLocations,
		removeLocation: removeLocation,
	};

	return (
		<LocationContext.Provider value={contextValue}>
			{props.children}
		</LocationContext.Provider>
	);
};

export default LocationContextProvider;
