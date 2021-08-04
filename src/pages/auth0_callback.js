import React, { useEffect } from "react";
import { useAuth } from "react-use-auth";

const Auth0CallbackPage = () => {
	const { handleAuthentication } = useAuth();

	useEffect(() => {
		handleAuthentication({ postLoginRoute: "/travel" });
	}, [handleAuthentication]);

	return (
		<main className="h-screen flex justify-center items-center bg-gray-100 ">
			<section className="bg-white w-full max-w-xl py-4 px-8 rounded">
				<h1 className="text-3xl font-bold my-4"> WELCOME TO TIMESHIP 🚀 </h1>
			</section>
		</main>
	);
};

export default Auth0CallbackPage;
