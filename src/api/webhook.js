import axios from "axios";
import createError from "http-errors";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
	try {
		if (req.method === "POST") {
			const { type, data } = req.body;

			// Check event type and payment status
			const session = await checkEventAndStatus(type, data);

			// Check if ticket is being re-used
			await checkTicketReuse(session.id);

			// Save travel details to Airtable
			await saveToAirtable(session);

			return res.status(201).json({
				status: 201,
				message: `success`,
			});
		}
		return res.status(401).json({ message: "Method not allowed" });
	} catch (error) {
		return res.status(error.status).json({ message: error.message });
	}
}

async function checkEventAndStatus(type, data) {
	if (type !== "checkout.session.completed") {
		throw createError(401, "Event type not allowed");
	}

	const stripeSession = await stripe.checkout.sessions.retrieve(data.object.id);
	if (stripeSession.payment_status !== "paid") {
		throw createError(401, "You haven't paid for your ticket 👮🏽‍♀️🚨");
	}

	return stripeSession;
}

async function checkTicketReuse(sessionId) {
	const travellers = await axios.get(
		`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_KEY}/users`,
		{
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
			},
		}
	);

	const records = travellers.data.records;

	const foundTicket = records.find(
		(passenger) => passenger.fields.ticket === sessionId
	);

	if (foundTicket) {
		throw createError(401, "This ticket has already been used");
	}
}

async function saveToAirtable(session) {
	const currentTimestamp = Math.floor(Date.now() / 1000);
	await axios.post(
		`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_KEY}/users`,
		{
			records: [
				{
					fields: {
						email: session.metadata.email,
						year: parseInt(session.metadata.year),
						location: session.metadata.location,
						ticket: session.id,
						timestamp: currentTimestamp,
					},
				},
			],
		},
		{
			headers: {
				Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
			},
		}
	);
}
