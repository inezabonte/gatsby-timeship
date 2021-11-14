import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import TravelForm from "../components/TravelForm";
import History from "../components/History";

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
				onClick={() => logout({ returnTo: window.location.origin })}
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

const Travel = () => {
	const { user } = useAuth0();

	return (
		<main className="h-screen flex flex-col space-y-6  items-center m-auto max-w-2xl">
			<nav className="bg-gray-100 w-full h-16 flex justify-between items-center p-2">
				<h1 className="text-gray-500 font-bold text-sm">{user?.email}</h1>
				<HandleAuthButton />
			</nav>
			<TravelForm />
			<History user={user} />
		</main>
	);
};

export default Travel;
