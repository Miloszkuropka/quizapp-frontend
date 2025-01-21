import { Fragment, useContext, useEffect } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";

function Authorized({children}) {
    const [token, setToken] = useContext(LoginContext)
    const navigate = useNavigate()

    useEffect(() => {
        if(token == null) {
            navigate("/login")
        }
    })

    return (<Fragment>{children}</Fragment>)
}

export default Authorized;