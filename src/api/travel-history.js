import axios from "axios";

export default async function (req, res) {
	const { email } = req.query;

	const travellers = await axios.get(
		`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	);

	const records = travellers.data.records
		.filter((user) => user.fields.email === email)
		.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

	return res.status(200).json({ status: 200, history: records });
}
