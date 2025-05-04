import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async ({ text, file }) => {
    setLoading(true);
	console.log(text)
    try {
      const token = localStorage.getItem("token");

      let fileType = null;
      if (file?.startsWith("data:image/")) {
        fileType = "image";
      } else if (file?.startsWith("data:application/pdf")) {
        fileType = "pdf";
      }

      const res = await fetch(`http://localhost:5000/api/messages/send/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
        message:text,
          file,
          fileType,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
