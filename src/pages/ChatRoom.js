import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import Sidebar from "../components/Sidebar.js";
import Chat from "../components/Chat.js";
import useAuth from "../hooks/useAuth.js";

const ChatRoom = () => {
  const { auth } = useAuth();
  const [conversation, setConversation] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io.connect("http://localhost:5000", {
      auth: {
        token: "Bearer " + auth?.accessToken,
      },
      query: {
        userId: auth?._id || 1234, // set your custom id here
      },
    });
    setSocket(socketConnection);
    return () => {
      socketConnection.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    socket?.on("connect_error", () => {
      socket.auth.token = "Bearer " + auth?.accessToken;
      socket?.connect();
    });
  }, [socket]);

  return (
    <div className='d-flex'>
      <Sidebar {...{ conversation, setConversation, socket }} />
      <Chat {...{ conversation, socket, auth }} />
    </div>
  );
};

export default ChatRoom;
