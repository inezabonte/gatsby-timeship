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

		const records = travellers.data.records;

		const foundPassenger = records.find(
			(passenger) => passenger.fields.email === email
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
							email,
							year: parseInt(year),
							location,
							timestamp: new Date(),
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
			message:
				error.inner?.message || `Time machhine under maintenance try later`,
		});
	}
}
