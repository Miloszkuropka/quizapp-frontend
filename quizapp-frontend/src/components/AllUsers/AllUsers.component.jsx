import { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';

const UserList1 = () => {
    const [users, setUsers] = useState([]); // Stan do przechowywania użytkowników
    const [loading, setLoading] = useState(false); // Stan do kontrolowania ładowania
    const [isAdmin, setIsAdmin] = useState(false); // Stan do sprawdzenia, czy użytkownik jest adminem
    const { token, user } = useContext(LoginContext);

    // Funkcja sprawdzająca, czy użytkownik jest administratorem
    const checkIfAdmin = async () => {
        if (!token) {
            toast.error("Please log in to continue!");
            return;
        }

        const onSuccess = (response, data) => {
            if (data.isAdmin) {
                setIsAdmin(true);  // Jeśli użytkownik jest adminem, ustawiamy isAdmin na true
            } else {
                setIsAdmin(false);  // Jeśli użytkownik nie jest adminem
                toast.error("You do not have permission to access this page!");
            }
        };

        const onFail = (response) => {
            toast.error("Failed to check admin status!");
            console.error("Error checking admin status:", response);
        };

        await get(ENDPOINTS.CheckAdminStatus, onSuccess, onFail, token);
    };

    // Użycie useEffect do sprawdzenia statusu admina
    useEffect(() => {
        setLoading(true);
        checkIfAdmin(); // Sprawdzamy, czy użytkownik jest administratorem
    }, [token]);

    const onSubmit = async (e) => {
        e.preventDefault(); // Zapobiega odświeżaniu formularza po kliknięciu submit

        if (!isAdmin) {
            toast.error("You do not have permission to fetch users!");
            return;
        }

        setLoading(true); // Ustawiamy loading na true podczas ładowania

        const onSuccess = (response, data) => {
            setUsers(data); // Zapisujemy użytkowników w stanie
            toast.success('Users fetched successfully!'); // Powiadomienie o powodzeniu
        };

        const onFail = (response) => {
            toast.error("Failed to fetch users!");
            toast.error("Error code: " + response.status);
        };

        // Wykonaj zapytanie GET, aby pobrać wszystkich użytkowników
        await get(ENDPOINTS.GetUsers, onSuccess, onFail, token);
        setLoading(false); // Ustawiamy loading na false po zakończeniu
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <button type="submit">Fetch Users</button>
            </form>
            {loading && <p>Loading...</p>} {/* Pokazuje loading podczas pobierania */}
            {!isAdmin && <p>You are not authorized to view the users.</p>} {/* Komunikat, jeśli użytkownik nie jest adminem */}
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.username}</li> // Wyświetlaj nazwę użytkownika lub inne właściwości
                ))}
            </ul>
        </div>
    );
};

export default UserList1;
