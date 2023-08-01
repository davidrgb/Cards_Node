import { Outlet, Link } from "react-router-dom";

import HomeIcon from '@mui/icons-material/Home';

import LogOutButton from "../components/LogOutButton"; 

import '../components/Button.css';

import './Layout.css';

export default function Layout() {
  return (
    <>
      <nav>
        <ul className="nav-row">
          <li>
            <Link to="/"><button className="rounded-square-button" title="Home"><HomeIcon /></button></Link>
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