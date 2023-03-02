import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const lat = req.query.lat;
		const lon = req.query.lon;

		const forecastResponse = await fetch(
			`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}&units=metric`
		);
		if (!forecastResponse.ok) {
			console.log(forecastResponse.statusText);
			console.log('error');
			return;
		}
		const weatherData = await forecastResponse.json();

		res.status(200).json({ data: weatherData });
	}
}

export default handler;
