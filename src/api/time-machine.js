import crypto from "crypto";
import axios from "axios";

const hashIp = ({ ipAddress, key, date }) => {
	const dateSalt = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

	const hash = crypto
		.createHash("sha256")
		.update(`${ipAddress}-${key}-${dateSalt}`)
		.digest("hex");

	return hash;
};

export default async function timeMachine(req, res) {
	const ipAddress = req.headers["client-ip"];
	const hashedIp = hashIp({
		ipAddress,
		key: process.env.HASH_KEY,
		date: new Date(),
	});

	const { year, location } = req.body;

	try {
		const travellers = await axios.get(
			`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
			{
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			}
		);

		const records = travellers.data.records;

		const foundPassenger = records.find(
			(passenger) => passenger.fields.id === hashedIp
		);

		if (foundPassenger) {
			return res
				.status(429)
				.json({ status: 429, message: "Timeship is charging 🔋⚡️" });
		}

		await axios.post(
			`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
			{
				records: [
					{
						fields: {
							id: hashedIp,
							year: parseInt(year),
							location,
						},
					},
				],
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
			}
		);

		return res.status(201).json({
			status: 201,
			message: `You are now in ${location} in the year ${year} ⏱`,
		});
	} catch (error) {
		return res.status(500).json({ status: 500, message: error.message });
	}
}
