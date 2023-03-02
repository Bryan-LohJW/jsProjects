import { WeatherType } from '@/models/types';
import classes from './LocationDetails.module.css';

const Detail: React.FC<{ weather: WeatherType }> = (props) => {
	return (
		<div className={classes.forecast}>
			<p>weather image</p>
			{props.weather.precipitation !== 0 && (
				<p>{props.weather.precipitation}mm</p>
			)}
			<p>{props.weather.temp}degC</p>
		</div>
	);
};

const DetailList: React.FC<{
	weatherArray: WeatherType[];
}> = (props) => {
	return (
		<div>
			{props.weatherArray.map((weather) => {
				return (
					<Detail
						key={weather.dateTime.getHours()}
						weather={weather}
					></Detail>
				);
			})}
		</div>
	);
};

const LocationDetails: React.FC<{ forecast: WeatherType[][] }> = (props) => {
	return (
		<div className={classes.content}>
			<div className={classes.timestamp}>
				<p className={classes.morning}>Morning</p>
				<p className={classes.afternoon}>Afternoon</p>
				<p className={classes.night}>Night</p>
			</div>
			<div className={classes.forecasts}>
				{props.forecast &&
					props.forecast.map((weatherArray, index) => {
						return (
							<div
								className={
									classes.dayList +
									' ' +
									(index === 0 ? classes.firstDay : ' ')
								}
								key={
									weatherArray[0] &&
									weatherArray[0].dateTime.getDay()
								}
							>
								<p>
									{weatherArray[0].dateTime
										.toDateString()
										.slice(0, -5)}
								</p>
								<DetailList
									weatherArray={weatherArray}
								></DetailList>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default LocationDetails;
