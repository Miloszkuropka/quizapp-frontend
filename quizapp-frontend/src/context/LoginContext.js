import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { ACCESS_TOKEN, REFRESH_TOKEN,IS_SUPERUSER  } from "../constants";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [supervisor, setSupervisor] = useState(() => {
    const isSuperUser = localStorage.getItem(IS_SUPERUSER);
    return isSuperUser ? { is_superuser: JSON.parse(isSuperUser) } : null;
  });

  useEffect(() => {
    const handleTokenUpdate = () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);

          setUser({
            user_id: decoded.user_id,
          });

          localStorage.setItem('token', token);
        } catch (error) {
          console.error('Invalid token:', error);
          clearAuthData();
        }
      } else {
        clearAuthData(); 
      }
    };

    const clearAuthData = () => {
      setUser(null);
      setSupervisor(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem(IS_SUPERUSER);
    };

    handleTokenUpdate();
  }, [token]);

  return (
    <LoginContext.Provider value={{ token, setToken, user, setUser, supervisor, setSupervisor }}>
      {children}
    </LoginContext.Provider>
  );
};