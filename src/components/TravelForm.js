import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const getAccessToken = async ({
	getAccessTokenSilently,
	getAccessTokenWithPopup,
}) => {
	const options = {
		audience: process.env.GATSBY_AUTH0_TIME_TRAVEL_API,
	};

	try {
		return await getAccessTokenSilently(options);
	} catch (error) {
		if (error.error === "consent_required") {
			return await getAccessTokenWithPopup(options);
		} else {
			throw error;
		}
	}
};

export default function TravelForm() {
	const [status, setStatus] = useState("initial");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("#fff");

	const [inputValues, setImputValues] = useState({
		year: "",
		location: "",
	});

	const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

	const handleInputChange = (e) => {
		const { name, value } = e.currentTarget;
		setImputValues({
			...inputValues,
			[name]: value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setStatus("pending");
			setColor("#3454d1");
			setMessage("Boarding timeship ... 🚀");

			const accessToken = await getAccessToken({
				getAccessTokenSilently,
				getAccessTokenWithPopup,
			});

			const response = await axios.post(
				"/api/time-machine",
				{
					year: inputValues.year,
					location: inputValues.location,
					email: user.email,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setStatus("success");
			setColor("#23ce6b");
			setMessage(response.data.message);
			console.log(response.data);
		} catch (error) {
			setStatus("failed");
			if (error.response.data.status === 429) {
				setColor("#fb5012");
			} else {
				setColor("#f00");
			}
			setMessage(error.response.data.message);
		}
	};

	return (
		<section className="bg-white w-full max-w-xl py-2 px-8 rounded">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold my-4">Time Machine ⏱🚀</h1>
			</div>
			<form
				className="flex flex-col text-lg space-y-8 font-medium"
				onSubmit={handleSubmit}
				method="POST"
				action="/api/time-machine"
			>
				<div className="flex flex-col">
					<label htmlFor="location">Location</label>
					<span className="font-light text-gray-500 text-sm">ex. Kigali</span>
					<input
						type="text"
						name="location"
						className="border-2 py-2 text-center"
						value={inputValues.location}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="year">Year</label>
					<span className="font-light text-gray-500 text-sm">ex. 2005</span>

					<input
						type="number"
						name="year"
						className="border-2 py-2 text-center"
						value={inputValues.year}
						onChange={handleInputChange}
						required
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white text-2xl font-bold p-4 rounded "
					disabled={status === "pending" || !user ? true : false}
				>
					Travel 🚀
				</button>
			</form>
			<div
				className="text-white mt-4 p-2 rounded  font-bold"
				style={{ backgroundColor: color }}
			>
				{message}
			</div>
		</section>
	);
}
