import { useContext } from 'react';

import Location from './Location';
import { LocationContext } from '@/store/location-context';

const LocationList: React.FC<{}> = () => {
	const { locations } = useContext(LocationContext);

	return (
		<ul>
			{locations.map((location) => {
				return <Location key={location.id} location={location} />;
			})}
		</ul>
	);
};

export default LocationList;
