import axios from "axios";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: "https://dev-x0k9-aws.us.auth0.com/.well-known/jwks.json",
	}),
	audience: "https://timeship-api/",
	issuer: "https://dev-x0k9-aws.us.auth0.com/",
	algorithms: ["RS256"],
});

const checkAuth = async (req, res) => {
	await new Promise((resolve, reject) => {
		jwtCheck(req, res, (result) => {
			if (result instanceof Error) {
				reject(result);
			}
			resolve(result);
		});
	});
};

export default async function timeMachine(req, res) {
	const currentTimestamp = Math.floor(Date.now() / 1000);
	try {
		await checkAuth(req, res);

		const { email, year, location } = req.body;
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

		if (records) {
			const lastTrip = records[0].fields.timestamp + 300;

			if (lastTrip > currentTimestamp) {
				const timeRemaining = Math.floor((lastTrip - currentTimestamp) / 60);
				return res.status(429).json({
					status: 429,
					message: `${timeRemaining} minutes to full charge ⚡️`,
				});
			}
		}

		await axios.post(
			`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
			{
				records: [
					{
						fields: {
							email,
							year: parseInt(year),
							location,
							timestamp: currentTimestamp,
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
		return res.status(error.status || 500).json({
			status: error.status || 500,
			message: error.message,
		});
	}
}
