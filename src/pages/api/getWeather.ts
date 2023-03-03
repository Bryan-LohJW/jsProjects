import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const lat = req.query.lat;
		const lon = req.query.lon;

		const weatherResponse = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_KEY}&units=metric`
		);
		if (!weatherResponse.ok) {
			console.log(weatherResponse.statusText);
			console.log('error');
			return;
		}
		const weatherData = await weatherResponse.json();
		res.status(200).json({ data: weatherData });
	}
}

export default handler;
