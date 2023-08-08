import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
