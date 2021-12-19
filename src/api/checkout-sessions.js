import axios from "axios";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

export default async function handler(req, res) {
	try {
		if (req.method === "POST") {
			await postHandler(req, res);
		}

		if (req.method === "GET") {
			await getHandler(req, res);
		}
		return res.status(405).json({ message: "Bad request" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
}

async function postHandler(req, res) {
	const currentTimestamp = Math.floor(Date.now() / 1000);
	try {
		await checkAuth(req, res);

		const { email, year, location, cancelUrl, successUrl } = req.body;
		const travellers = await axios.get(
			`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_KEY}/users`,
			{
				headers: {
					Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
				},
			}
		);

		const records = travellers.data.records
			.filter((user) => user.fields.email === email)
			.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

		if (records.length > 0) {
			const lastTrip = records[0].fields.timestamp + 300;

			if (lastTrip > currentTimestamp) {
				const timeRemaining = Math.floor((lastTrip - currentTimestamp) / 60);
				return res.status(429).json({
					status: 429,
					message: `${timeRemaining} minutes to full charge ⚡️`,
				});
			}
		}

		const session = await stripe.checkout.sessions.create({
			success_url: successUrl,
			cancel_url: cancelUrl,
			payment_method_types: ["card"],
			line_items: [{ price: "price_1JuaRQDUd9dYFKAvwijMLtPI", quantity: 1 }],
			mode: "payment",
			customer_email: email,
			metadata: {
				email,
				year,
				location,
			},
		});
		return res.status(200).json({ url: session.url });
	} catch (error) {
		return res.status(error.status || 500).json({
			status: error.status || 500,
			message: error.message,
		});
	}
}

async function getHandler(req, res) {
	const session = await stripe.checkout.sessions.retrieve(req.query.sessionId);
	if (session.payment_status !== "paid") {
		throw new Error("You haven't paid for your ticket 👮🏽‍♀️🚨");
	}
	res.status(200).json({
		message: `You travelled to ${session.metadata.location} in the year ${session.metadata.year}`,
	});
}
