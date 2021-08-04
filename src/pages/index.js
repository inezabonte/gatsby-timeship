import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";
import { navigate } from "gatsby";

export default function Index() {
	const { login, isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated()) {
			navigate("/travel");
		}
	});

	const handleLogin = () => {
		if (isAuthenticated()) {
			navigate("/travel");
		} else {
			login();
		}
	};

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
				<button
					onClick={handleLogin}
					className="bg-green-500 text-lg font-bold text-white p-4 rounded"
				>
					Ready to travel
				</button>
			</section>
		</main>
	);
}
