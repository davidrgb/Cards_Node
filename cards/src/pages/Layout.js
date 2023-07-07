import { Outlet, Link } from "react-router-dom";

import LogOutButton from "../components/LogOutButton"; 

import './Layout.css';

export default function Layout() {
  return (
    <>
      <nav>
        <ul className="nav-row">
          <li>
            <Link to="/"><button className="home-button">Home</button></Link>
          </li>
          <li>
            <LogOutButton />
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}