import Image from 'next/image';

import { WeatherType } from '@/models/types';
import classes from './LocationDetails.module.css';

const Detail: React.FC<{ weather: WeatherType }> = (props) => {
	return (
		<div className={classes.forecast}>
			<Image
				src={
					props.weather
						? `http://openweathermap.org/img/wn/${props.weather.icon}@2x.png`
						: ''
				}
				alt="Weather Image"
				width={60}
				height={60}
				className={classes.weatherIcon}
			/>
			<p>
				<b>Temp:</b> {props.weather.temp}&#176;C
			</p>
			{props.weather.precipitation !== 0 && (
				<p>
					<b>Rain:</b> {props.weather.precipitation}mm
				</p>
			)}
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
								<p className={classes.date}>
									{weatherArray[0].dateTime
										.toDateString()
										.slice(0, -5)}
								</p>
								<DetailList weatherArray={weatherArray} />
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default LocationDetails;
