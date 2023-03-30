import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import { API } from "../utils/API.js";

import Sidebar from "../components/Sidebar.js";
import Chat from "../components/Chat.js";
import useAuth from "../hooks/useAuth.js";

const ChatRoom = () => {
  const { auth, setAuth } = useAuth();
  const [conversation, setConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketConnection = io.connect(API, {
      auth: {
        token: "Bearer " + auth?.accessToken,
      },
      query: {
        userId: auth?._id,
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
  }, [socket, auth]);

  useEffect(() => {
    socket?.on("logout", () => {
      setAuth({ accessToken: "", _id: "", email: "" });
    });
  }, [socket, setAuth]);

  const setLastMessage = (convoid, message) => {
    setConversations((prev) => {
      console.log(prev);
      const oldConvo = prev.find(
        (e) => e?._id?.toString() === convoid?.toString()
      );
      console.log(oldConvo);
      const oldUsers = prev.filter(
        (e) => e?._id?.toString() !== convoid?.toString()
      );
      console.log(oldUsers);
      console.log([{ ...oldConvo, message }, ...oldUsers]);
      return [{ ...oldConvo, message }, ...oldUsers];
    });
  };

  return (
    <div className='d-flex'>
      <Sidebar
        {...{
          conversation,
          setConversation,
          socket,
          auth,
          conversations,
          setConversations,
        }}
      />
      <Chat {...{ conversation, socket, auth, setLastMessage }} />
    </div>
  );
};

export default ChatRoom;
