import React, { useState } from "react";
import * as yup from "yup";

const IndexPage = () => {
	const [inputValues, setImputValues] = useState({
		year: "",
		city: "",
	});

	const schema = yup.object().shape({
		year: yup
			.number()
			.typeError("We use numbers for now 🙃")
			.min(0, "That could destroy the planet 😡")
			.required("The year is required"),
		city: yup.string().required("Where are you going? 🌍"),
	});

	const handleInputChange = (e) => {
		setImputValues({
			...inputValues,
			[e.currentTarget.name]: e.currentTarget.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const validate = await schema.validate(inputValues);
			console.log(validate);
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<main className="h-screen flex justify-center items-center bg-gray-100 ">
			<section className="bg-white w-full max-w-3xl p-48">
				<h1 className="text-3xl font-bold mb-4">Time Machine ⏱🚀</h1>
				<form
					className="flex flex-col text-lg space-y-8"
					noValidate
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col">
						<label htmlFor="year">What year do you want to go travel to?</label>
						<input
							type="number"
							name="year"
							className="border-2 p-2 text-center"
							value={inputValues.year}
							onChange={handleInputChange}
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="city">Which city do you want to travel to?</label>
						<input
							type="text"
							name="city"
							className="border-2 p-2 text-center"
							value={inputValues.city}
							onChange={handleInputChange}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white text-lg font-bold p-2 rounded self-end"
					>
						Travel 🚀
					</button>
				</form>
			</section>
		</main>
	);
};

export default IndexPage;
