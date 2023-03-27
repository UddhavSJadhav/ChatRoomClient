import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.js";
import RequireAuth from "./components/RequireAuth.js";
import Connect from "./pages/Connect.js";
import ChatRoom from "./pages/ChatRoom.js";

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/*public routes*/}
        <Route path='connect' element={<Connect />} />

        {/*private routes*/}
        <Route element={<RequireAuth />}>
          <Route path='/' element={<ChatRoom />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
