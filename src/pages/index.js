import React from "react";
import { Link } from "gatsby";

export default function IndexPage() {
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
				<Link
					to="/travel"
					className="bg-green-500 text-lg font-bold text-white p-4 rounded"
				>
					Ready to travel
				</Link>
			</section>
		</main>
	);
}
