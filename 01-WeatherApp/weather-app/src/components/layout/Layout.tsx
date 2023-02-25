import React, { use, useContext } from 'react';

import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';
import Login from '@/components/login/Login';
import LocationForm from '../location/LocationForm';
import { LocationContext } from '@/store/location-context';

const Layout: React.FC<{
	children: React.ReactNode;
}> = (props) => {
	const { showLocationForm } = useContext(LocationContext);

	return (
		<>
			<Login />
			{showLocationForm && <LocationForm />}
			<MainNavigation />
			<main className={classes.main}>{props.children}</main>
		</>
	);
};

export default Layout;
