import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const Chat = ({ conversation, socket, auth, setSidebar }) => {
  const [messages, setMessages] = useState([]);
  const textRef = useRef();
  const divRef = useRef(null);

  useEffect(() => {
    (() => {
      const div = divRef.current;
      div.scrollTop = div.scrollHeight;
    })();
  }, [messages]);

  useEffect(() => {
    function getMessages() {
      if (!conversation?._id) return;
      socket?.emit(
        "conversation:getmessages",
        { conversation: conversation?._id },
        (err, res) => {
          if (err) toast.error(err?.message);
          if (res?.data) setMessages([...res.data]);
        }
      );
    }
    getMessages();
  }, [conversation, socket]);

  useEffect(() => {
    socket?.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { ...data }]);
    });

    // Remove event listener on component unmount
    return () => socket?.off("receive_message");
  }, [socket]);

  function sendText() {
    if (textRef.current.value.trim() === "" || !conversation?._id) return;
    socket?.emit(
      "send_message",
      { conversation: conversation?._id, text: textRef.current.value },
      (err, _) => {
        if (err) toast.error(err?.message);
      }
    );
    textRef.current.value = "";
  }

  return (
    <div id='chat' className='position-relative'>
      <div id='chat-header'>
        <div className='ham-menu' onClick={() => setSidebar(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div id='chat-name'>
          {conversation?.name ? conversation?.name : "Select Conversation"}
        </div>
      </div>

      <hr />
      <div ref={divRef} id='chat-messages'>
        {messages.map((msg, i) => (
          <div key={i} className='w-100'>
            <div
              className={
                msg.from?.toString() !== auth?._id?.toString()
                  ? "message"
                  : "message my"
              }>
              <p className='m-0 p-0'> {msg.text}</p>
              <div style={{ fontSize: "10px", textAlign: "end" }}>
                <span>
                  {new Date(msg?.createdAt).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* {msg.from?.toString() === auth?._id?.toString() &&
                msg?.seen === true ? (
                  <span className='ms-3 text-success'>seen</span>
                ) : (
                  <span className='ms-3 text-grey'>sent</span>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        id='chat-input'
        style={{
          position: "fixed",
          bottom: "0",
          width: "-webkit-fill-available",
          boxShadow: "0 -1px rgb(192, 192, 192, 0.5)",
          backgroundColor: "white",
        }}>
        <div className='container'>
          <div
            className='p-3 d-flex justify-content-center mx-auto align-items-center'
            style={{ maxWidth: "60rem" }}>
            <input
              type='text'
              ref={textRef}
              className='form-control me-1'
              style={{
                boxShadow: "0 0 10px rgb(192, 192, 192, 0.5)",
                padding: ".7rem",
              }}
            />
            <svg
              height='30'
              width='30'
              viewBox='0 0 24 24'
              fill='none'
              style={{ cursor: "pointer" }}
              onClick={sendText}
              xmlns='http://www.w3.org/2000/svg'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                <path
                  d='M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z'
                  fill='#828282'></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
