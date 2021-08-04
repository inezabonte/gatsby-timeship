import React, { useState } from "react";
import axios from "axios";

const IndexPage = () => {
	const [inputValues, setImputValues] = useState({
		year: "",
		location: "",
	});
	const [status, setStatus] = useState("initial");
	const [message, setMessage] = useState("");
	const [color, setColor] = useState("#fff");

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
			const response = await axios.post("/api/time-machine", {
				year: inputValues.year,
				location: inputValues.location,
			});
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
		<main className="h-screen flex justify-center items-center bg-gray-100 ">
			<section className="bg-white w-full max-w-xl py-4 px-8 rounded">
				<h1 className="text-3xl font-bold my-4">Time Machine ⏱🚀</h1>
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
					className="text-white mt-8 p-8 rounded text-2xl font-extrabold"
					style={{ backgroundColor: color }}
				>
					{message}
				</div>
			</section>
		</main>
	);
};

export default IndexPage;
