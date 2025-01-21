import "./Home.component.css";
import { LoginContext } from "../../context/LoginContext";
import {useContext} from "react"

function Home() {

    const { token, user } = useContext(LoginContext);
    const isLoggedIn = !!token;

    return (
        <div className="home-container">
            {isLoggedIn ? (
                <>
                    <h1>Zalogowano</h1>
                    {/* <img src="ondrej.jpg" alt="Zalogowany" className="home-image" /> */}
                </>
            ) : (
                <>
                    <h1>Niezalogowany użytkownik</h1>
                    {/* <img src="AndrzejNiezalogowany.jpg" alt="Niezalogowany" className="home-image" /> */}
                </>
            )}
        </div>
    );
}

export default Home;