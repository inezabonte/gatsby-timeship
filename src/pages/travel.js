import React, { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const HandleAuthButton = () => {
	const { logout, loginWithPopup, error, isLoading, isAuthenticated } =
		useAuth0();

	if (isLoading) {
		return (
			<button className="bg-blue-600 text-white font-bold p-2 rounded" disabled>
				Loading ...
			</button>
		);
	} else if (error) {
		return <span>Auth error: {error.message}</span>;
	} else if (isAuthenticated) {
		return (
			<button
				className="bg-blue-600 text-white font-bold p-2 rounded"
				onClick={() => logout({ returnTo: window?.location })}
			>
				Logout
			</button>
		);
	} else {
		return (
			<button
				className="bg-blue-600 text-white font-bold p-2 rounded"
				onClick={loginWithPopup}
			>
				Login
			</button>
		);
	}
};

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

const Travel = () => {
	const [status, setStatus] = useState("initial");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("#fff");

	const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();

	const [inputValues, setImputValues] = useState({
		year: "",
		location: "",
	});

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
		<main className="h-screen flex flex-col space-y-10  items-center m-auto max-w-2xl">
			<nav className="bg-gray-100 w-full h-16 flex justify-between items-center p-2">
				<h1 className="text-gray-500 font-bold text-sm">{user?.name}</h1>
				<HandleAuthButton />
			</nav>
			<section className="bg-white w-full max-w-xl py-4 px-8 rounded">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold my-4">Time Machine ⏱🚀</h1>
				</div>
				<form
					className="flex flex-col text-lg space-y-8"
					onSubmit={handleSubmit}
					method="POST"
					action="/api/time-machine"
				>
					<div className="flex flex-col">
						<label htmlFor="location">
							Which location do you want to travel to?
						</label>
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
						<label htmlFor="year">What year do you want to go travel to?</label>
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
						className="bg-blue-500 text-white text-2xl font-bold p-4 rounded border-4 border-blue-900 "
						disabled={status === "pending" ? true : false}
					>
						Travel 🚀
					</button>
				</form>
				<div
					className="text-white mt-8 p-8 rounded text-xl font-extrabold"
					style={{ backgroundColor: color }}
				>
					{message}
				</div>
			</section>
		</main>
	);
};

export default Travel;
