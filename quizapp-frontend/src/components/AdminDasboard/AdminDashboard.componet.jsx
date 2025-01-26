import { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
    const { token } = useContext(LoginContext);
    const [loading, setLoading] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [latestLogs, setLatestLogs] = useState([]);
    const [loginsData, setLoginsData] = useState({ labels: [], data: [] });
    const [isAdmin, setIsAdmin] = useState(false);  // Dodane do przechowywania statusu admina

    const fetchUserCount = async () => {
        const onSuccess = (response, data) => {
            setUserCount(data.length);
        };

        const onFail = (response) => {
            toast.error('Failed to fetch users!');
            console.error('Error fetching users:', response);
        };

        await get(ENDPOINTS.GetUsers, onSuccess, onFail, token);
    };

    const fetchLogs = async () => {
        const onSuccess = (response, data) => {
            const logs = data.slice(-5);
            const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setLatestLogs(sortedLogs);

            const today = new Date();
            const loginsPerDay = Array(7).fill(0);

            data.forEach(log => {
                const logDate = new Date(log.timestamp);
                const diffInDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
                if (diffInDays >= 0 && diffInDays < 7) {
                    loginsPerDay[6 - diffInDays] += 1;
                }
            });

            const labels = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(today.getDate() - (6 - i));
                return date.toISOString().slice(0, 10);
            });

            setLoginsData({ labels, data: loginsPerDay });
        };

        const onFail = (response) => {
            toast.error('Failed to fetch logs!');
            console.error('Error fetching logs:', response);
        };

        await get(ENDPOINTS.GetLogs, onSuccess, onFail, token);
    };

    // Funkcja sprawdzająca, czy użytkownik jest administratorem
    // Zaktualizowana funkcja sprawdzająca admina:
const checkIfAdmin = async () => {
    const onSuccess = (response, data) => {
        if (data.isAdmin) {
            setIsAdmin(true);  // Jeśli użytkownik jest adminem, ustawiamy isAdmin na true
            fetchUserCount();  // Pobieramy dane użytkowników
            fetchLogs();  // Pobieramy logi
        } else {
            setIsAdmin(false);  // Jeśli użytkownik nie jest adminem
            toast.error('You do not have permission to access this page!');
        }
        setLoading(false);  // Ustawiamy loading na false po zakończeniu sprawdzania
    };

    const onFail = (response) => {
        toast.error('Failed to check admin status!');
        console.error('Error checking admin status:', response);
        setLoading(false);  // Ustawiamy loading na false w przypadku błędu
    };

    await get(ENDPOINTS.CheckAdminStatus, onSuccess, onFail, token);
};

    useEffect(() => {
        setLoading(true);  // Rozpoczynamy ładowanie
        if (token) {
            checkIfAdmin();  // Sprawdzamy, czy użytkownik jest adminem
        } else {
            setLoading(false);  // Jeśli brak tokena, ustawiamy loading na false
            toast.error('Please log in to continue!');
        }
    }, [token]);

    const chartData = {
        labels: loginsData.labels,
        datasets: [
        {
            label: 'Logins in the Last Week',
            data: loginsData.data,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            fill: true,
        },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
        {loading && <p>Loading...</p>}
        {!loading && isAdmin && (
            <>
            {/* Górna połowa */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* Sekcja: Liczba użytkowników */}
                <div style={{ flex: 1, marginRight: '20px' }}>
                <h2>Total Users</h2>
                <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{userCount}</p>
                </div>

                {/* Sekcja: Tabela z logami */}
                <div style={{ flex: 2 }}>
                <h2>Latest Logs</h2>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {latestLogs.map((log) => (
                        <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td>{log.user}</td>
                        <td>{log.type}</td>
                        <td>{log.status}</td>
                        <td>{log.details}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Dolna połowa */}
            <div style={{ width: '800px', maxHeight: '500px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center' }}>Logins in the Last 7 Days</h2>
                <Line data={chartData} />
            </div>
            </>
        )}
        </div>
    );
}

export default AdminDashboard;
