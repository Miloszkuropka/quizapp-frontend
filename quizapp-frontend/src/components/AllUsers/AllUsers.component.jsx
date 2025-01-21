import { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { get, post } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';

const UserList1 = () => {
    const [users, setUsers] = useState([]); // Stan do przechowywania użytkowników
    const [loading, setLoading] = useState(false); // Stan do kontrolowania ładowania
    const {token, setToken, user} = useContext(LoginContext);

    const onSubmit = async (e) => {
        e.preventDefault(); // Zapobiega odświeżaniu formularza po kliknięciu submit
        console.log("Fetching all users...");
        setLoading(true); // Ustawiamy loading na true podczas ładowania

        const onSuccess = (response, data) => {
            console.log("Users data: ", data);
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
            <ul>
                {users.map((user, index) => (
                    <li key={index}>{user.username}</li> // Wyświetlaj nazwę użytkownika lub inne właściwości
                ))}
            </ul>
        </div>
    );
};

export default UserList1;
