import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const city = req.query.city;
		const country = req.query.country;

		const geoResponse = await fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${process.env.WEATHER_KEY}`
		);
		if (!geoResponse.ok) {
			console.log(geoResponse.statusText);
			console.log('error');
			return;
		}
		const geoData = await geoResponse.json();

		res.status(200).json({ data: geoData });
	}
}

export default handler;
