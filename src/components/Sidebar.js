import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Sidebar = ({ conversation, setConversation, socket }) => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    socket?.on("conversation:new_chat", () => {});
  }, [socket]);

  useEffect(() => {
    function getFriends() {
      socket?.emit("user:conversations", (err, res) => {
        if (err) toast.error(err?.message);
        if (res?.data) setConversations([...res.data]);
      });
    }
    getFriends();
  }, [socket]);

  function searchUsers(e) {
    const username = e.target.value;
    setSearch(username);
    if (username.length < 4) return;
    socket?.emit("user:search", { username }, (err, res) => {
      if (err) toast.error(err?.message);
      if (res?.data) setUsers([...res?.data]);
    });
  }

  function startConversation(friend) {
    socket?.emit("conversation:create", { friend }, (err, res) => {
      if (err) toast.error(err?.message);
      if (res?.data) setConversations((prev) => [res?.data, ...prev]);
    });
    setSearch("");
  }

  return (
    <div id='sidebar'>
      <div id='header'>ChatRoom</div>
      <hr />
      <div className='m-1'>
        <input
          type='search'
          className='form-control'
          placeholder='Find Friends...'
          value={search}
          onChange={searchUsers}
        />
        <div className='position-relative w-100'>
          <div className='position-absolute'>
            <div className='w-100'>
              {search.length > 3 &&
                users?.map((e) => (
                  <div
                    key={e?._id}
                    className='bg-info mb-1 w-100 text-center'
                    onClick={() => startConversation(e?._id)}>
                    {e?.username}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        {conversations.map((convo, i) => (
          <div
            key={i}
            onClick={() =>
              convo?._id === conversation ? {} : setConversation(convo?._id)
            }>
            <div className='d-flex chat'>
              <div className='profile-img'>
                <img src='' alt='' width='50' height='50' />
              </div>
              <div className='profile-name-msg'>
                <h6>{convo?.friend?.name}</h6>
                <p>{convo?.text}</p>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
