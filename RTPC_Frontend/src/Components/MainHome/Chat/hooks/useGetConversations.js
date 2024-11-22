import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);


	useEffect(() => {
		const getConversations = async () => {
			
			setLoading(true);
			try {
				const token = localStorage.getItem('token');
				
				
				
				const res = await axios.get("http://localhost:3000/api/members",{
					
						headers: {
						  'Authorization': `Bearer ${token}` 
					  }
				});
				
				const data = res.data;
				
				if (data.error) {
					throw new Error(data.error);
					console.log("ERRROR")
				}
				
				
				setConversations(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;