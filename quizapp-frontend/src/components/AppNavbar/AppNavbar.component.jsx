import { Link } from 'react-router-dom';
import { Fragment, useContext, useState, useEffect } from 'react';
import { LoginContext } from '../../context/LoginContext';
import "./AppNavbar.component.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function AppNavbar() {
  const { token, user, supervisor } = useContext(LoginContext); 

  const urls = [
    { url: "/login", name: "Login", auth: false },
    { url: "/register", name: "Register", auth: false },
    { url: "/logout", name: "Logout", auth: true },
    { url: "/quiz", name: "Quiz", auth: true },
    { url: "/quizzes", name: "Quizzes", auth: true },
    { url: "/logout", name: "Logout", auth: true, adminOnly: true },
    { url: '/admin/dashboard', name: 'Admin Dashboard', auth: true, adminOnly: true },
    { url: '/admin/logstable', name: 'Logs Table', auth: true, adminOnly: true },
    { url: '/admin/userlist', name: 'User List', auth: true, adminOnly: true },
    //{ url: '/admin/userform', name: 'Create User', auth: true, adminOnly: true },
    { url: "/statistics", name: "Statistics", auth: true }
  ];

  const isVisible = (auth, adminOnly = false) => {
    if (!token) return !auth;
    if (adminOnly && supervisor?.is_superuser) return true;
    if (!adminOnly && auth && !supervisor?.is_superuser) return true;
    return false;
  };

  useEffect(() => {
    console.log('User:', supervisor?.is_superuser);
    //console.log("co w tokenie: " + token)
  }, [user]);
  
  return (
    <nav>
      <div className="navbar-container">
        <div className="logo-container">
          LOGO
        </div>
        <ul className='menu'>
          <li>
            <Link className="nav-link" to="/">Home</Link>
          </li>
            {urls.map((x, index) =>
              isVisible(x.auth, x.adminOnly) ? (
                <li key={index}>
                  <Link className="nav-link" to={x.url}>{x.name}</Link>
                </li>
              ) : null
            )}
        </ul>
      </div>
    </nav>
  );
}

export default AppNavbar;
