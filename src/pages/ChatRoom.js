import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import { API } from "../utils/API.js";

import Sidebar from "../components/Sidebar.js";
import Chat from "../components/Chat.js";
import useAuth from "../hooks/useAuth.js";

const ChatRoom = () => {
  const { auth, setAuth } = useAuth();
  const [conversation, setConversation] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io.connect(API, {
      auth: {
        token: "Bearer " + auth?.accessToken,
      },
      query: {
        userId: auth?._id,
      },
      withCredentials: true,
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
  }, [socket, auth]);

  useEffect(() => {
    socket?.on("logout", () => {
      setAuth({ accessToken: "", _id: "", email: "" });
    });
  }, [socket, setAuth]);

  return (
    <div className='d-flex'>
      <Sidebar
        {...{
          conversation,
          setConversation,
          socket,
          auth,
          setAuth,
        }}
      />
      <Chat {...{ conversation, socket, auth }} />
    </div>
  );
};

export default ChatRoom;
