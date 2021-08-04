import React from "react";

export default function Index() {
	return (
		<main className="flex flex-col h-screen justify-center items-center space-y-5">
			<section>
				<h1 className="text-3xl font-bold text-center">
					Welcome to Gatsby TimeShip
				</h1>
				<p className="text-xl font-medium text-center">
					A secret project being developed that enables Time travel. 🤫
				</p>
			</section>
			<section>
				<button className="bg-red-600 text-lg font-bold text-white p-4 rounded">
					Identify yourself 🏴‍☠️
				</button>
			</section>
		</main>
	);
}
