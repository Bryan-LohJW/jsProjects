import { useContext } from 'react';

import Location from './Location';
import { LocationContext } from '@/store/location-context';
import classes from './LocationList.module.css';

const LocationList: React.FC<{}> = () => {
	const { locations } = useContext(LocationContext);

	return (
		<>
			{locations.length === 0 && (
				<p className={classes.firstLoc}>Add your first location!</p>
			)}
			<ul className={classes.list}>
				{locations.map((location) => {
					return <Location key={location.id} location={location} />;
				})}
			</ul>
		</>
	);
};

export default LocationList;
