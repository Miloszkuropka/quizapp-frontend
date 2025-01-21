import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from '../api/api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect,useContext } from "react";
import { LoginContext } from "../context/LoginContext";

function ProtectedRoute({ children, adminOnly = false  }) {
    const [isAuthorized, setIsAuthorized] = useState(null); // Domyślnie null (ładowanie) 

    const { token, supervisor } = useContext(LoginContext); 

    useEffect(() => {
        const auth = async () => {
            if (!token) {
                setIsAuthorized(false); // Brak tokenu = brak dostępu
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp < now) {
                    // Token wygasł, odśwież go
                    await refreshToken();
                } else {
                    setIsAuthorized(true); // Token ważny
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                setIsAuthorized(false);
            }
        };

        auth();
    }, [token]);

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        if (!refresh) {
            setIsAuthorized(false);
            return;
        }

        try {
            const response = await api.post("/api/token/refresh/", { refresh });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access); // Zapis nowego tokenu
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null ) {
        return <div>Loading...</div>;
      }

      if (adminOnly && (!supervisor || !supervisor.is_superuser)) {
        return <Navigate to="*" />; // Przekierowanie na stronę główną
    }

    return isAuthorized ? children : <Navigate to="/login" />; 
}

export default ProtectedRoute;