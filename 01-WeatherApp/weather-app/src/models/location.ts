class LocationModel {
	id: string;
	city: string;
	country: string;
	coordinate: number[];
	weather?: string;

	constructor(country: string, city: string, coordinate: number[]) {
		this.country = country;
		this.city = city;
		this.coordinate = coordinate;
		this.id = new Date().toISOString();
	}
}

export default LocationModel;
