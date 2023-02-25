import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { mongoUser, mongoPass, weatherApiKey } from '@/utils/credentials';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		const client = await MongoClient.connect(
			`mongodb+srv://${mongoUser}:${mongoPass}@cluster0.9nrmgz7.mongodb.net/?retryWrites=true&w=majority`
		);

		const db = client.db();

		const locationCollection = db.collection('locations');

		const result = await locationCollection.find().toArray();

		client.close();

		res.status(200).json({ locationArray: result });
	}

	if (req.method === 'POST') {
		const data = JSON.parse(req.body);

		const client = await MongoClient.connect(
			`mongodb+srv://${mongoUser}:${mongoPass}@cluster0.9nrmgz7.mongodb.net/?retryWrites=true&w=majority`
		);

		const db = client.db();

		const locationCollection = db.collection('locations');

		const result = await locationCollection.insertOne(data);

		console.log(result);

		client.close();

		res.status(201).json({ message: 'Location inserted!' });
	}

	if (req.method === 'DELETE') {
		const id = JSON.parse(req.body).id;

		console.log(id);

		const client = await MongoClient.connect(
			`mongodb+srv://${mongoUser}:${mongoPass}@cluster0.9nrmgz7.mongodb.net/?retryWrites=true&w=majority`
		);

		const db = client.db();

		const locationCollection = db.collection('locations');

		const result = await locationCollection.deleteOne({ id: id });

		console.log(result);

		client.close();

		res.status(204).send();
	}
}

export default handler;
