import React from "react";
import axios from "axios";
import useSWR from "swr";

export default function History({ user }) {
	const fetchHistory = async () => {
		const { data } = await axios.get(`/api/travel-history?email=${user.email}`);
		return data;
	};

	const { data } = useSWR(
		user ? `travel-history/${user.email}` : null,
		fetchHistory,
		{ refreshInterval: 5000 }
	);

	return (
		<section className=" w-full max-w-md p-4 rounded">
			<h2 className="font-bold text-xl text-purple-900 mb-4 ">History</h2>
			{data && (
				<div className="space-y-4 divide-y-2">
					{data.history.map((item) => (
						<div
							key={item.id}
							className="text-purple-900 flex justify-between  p-2"
						>
							<span>📍{item.fields.location}</span>
							<span>{item.fields.year}</span>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
