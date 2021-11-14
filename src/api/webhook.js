import axios from "axios";
import createError from 'http-errors'
const stripe = require('stripe')(process.env.STRIPE_KEY)


export default async function  handler(req, res) {
	try {
		if(req.method === 'POST'){

			await webhookHandler(req, res)
		}
		return res.status(405).json({message: "Method not allowed"})
	} catch (error) {
		return res.status(error.status).json({message: error.message})	
	}
}

async function webhookHandler(req, res) {
	const {type, data} = req.body
	if(type !== 'checkout.session.completed'){
		throw createError(405, 'Event type not allowed')
	}
	
	const stripeSession = await stripe.checkout.sessions.retrieve(data.object.id)
	if(stripeSession.payment_status !== "paid"){
		throw createError(402,"You haven't paid for your ticket 👮🏽‍♀️🚨")
	}

	const travellers = await axios.get(
		`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
		{
			headers: {
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
		}
	);

	const records = travellers.data.records;

	const foundTicket = records.find(
		(passenger) => passenger.fields.ticket === stripeSession.id
	);

	if(foundTicket) {
		throw createError(406,"This ticket has already been used" )
	}

	const currentTimestamp = Math.floor(Date.now() / 1000);
	await axios.post(
		`https://api.airtable.com/v0/${process.env.BASE_KEY}/users`,
		{
			records: [
				{
					fields: {
						email: stripeSession.metadata.email,
						year: parseInt(stripeSession.metadata.year),
						location: stripeSession.metadata.location,
						ticket: stripeSession.id,
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
		message: `success`,
	})


}
