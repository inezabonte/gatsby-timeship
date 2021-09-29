import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export default function History({ user }) {
	const fetchHistory = async () => {
		const { data } = await axios.get(`/api/travel-history?email=${user.email}`);
		return data;
	};

	const { data, isLoading } = useQuery(
		[user ? `travel-history/${user.email}` : null],
		fetchHistory,
		{ refetchInterval: 5000 }
	);

	return (
		<section className=" w-full max-w-md p-4 rounded">
			<h2 className="font-bold text-xl text-purple-900 mb-4 ">History</h2>
			<div className="space-y-4 divide-y-2">
				{!user || isLoading ? (
					<span className="text-purple-700 text-sm">
						Travel history not available
					</span>
				) : (
					data.history.map((item) => (
						<div
							key={item.id}
							className="text-purple-900 flex justify-between  p-2"
						>
							<span>📍{item.fields.location}</span>
							<span>{item.fields.year}</span>
						</div>
					))
				)}
			</div>
		</section>
	);
}
