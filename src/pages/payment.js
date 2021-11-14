import React, {useState, useEffect} from "react";
import queryString from 'query-string'
import axios from 'axios'
import { Link } from "gatsby";

export default function Payment({location}) {

	const [status, setStatus] = useState("pending")
	const [sessionId, setSessionId] = useState("")
	const [message, setMessage] = useState("")

	useEffect(() => {
		const params = queryString.parse(location.search)
		if(params.session_id) {
			setSessionId(params.session_id)
		}else{
			setStatus("failed")
		}
	}, [location.search])

	useEffect(() => {
		if(!sessionId) return;

		const getTravelData = async() => {
			try {
			const {data} =  await axios.get('/api/time-machine', {
					params:{
						sessionId
					}
				})

				setStatus("success")
				setMessage(data.message)
			} catch (error) {
				setStatus("failed")
				setMessage(error.response?.data?.message || error.message)
			}
		}

		getTravelData()
	}, [sessionId])

	return (
		<div className="container mx-auto m-8">
			{status === "pending" && <p>Fetching travel details ...</p>}
			{status === "failed" && <p>Invalid travel Ticket</p>}
			{status === "success" && <p>Success 🚀</p>}
			<p>{message}</p>
			<Link to='/travel' className="text-blue-500">←Back to Travel Page</Link>
		</div>
	);
}
