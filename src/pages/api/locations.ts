import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const client = await MongoClient.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.9nrmgz7.mongodb.net/?retryWrites=true&w=majority`
	);

	const db = client.db();

	const username = req.query.user?.toString();

	const locationCollection = db.collection(username!);

	if (req.method === 'GET') {
		const result = await locationCollection.find().toArray();

		client.close();

		res.status(200).json({ locationArray: result });
	}

	if (req.method === 'POST') {
		const data = JSON.parse(req.body);

		const result = await locationCollection.insertOne(data);

		console.log(result);

		client.close();

		res.status(201).json({ message: 'Location inserted!' });
	}

	if (req.method === 'DELETE') {
		const id = JSON.parse(req.body).id;

		const result = await locationCollection.deleteOne({ id: id });

		console.log(result);

		client.close();

		res.status(204).send({ message: 'Successfully deleted' });
	}
}

export default handler;
