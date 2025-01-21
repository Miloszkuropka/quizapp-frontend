import { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Form, Button } from 'react-bootstrap';
import { get } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';
import toast from 'react-hot-toast';

function LogsTable() {
    const { token, user, supervisor } = useContext(LoginContext); 

    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [expandedLogId, setExpandedLogId] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);

        const onSuccess = (response, data) => {

            const parsedData = data.map((log) => ({
                ...log,
                device: typeof log.device === 'string'
                    ? JSON.parse(log.device.replace(/'/g, '"'))
                    : log.device,
            }));

            const sortedLogs = parsedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            console.log("Fetched logs:", data);
            setLogs(sortedLogs);
            setFilteredLogs(sortedLogs);
            setShowAll(false);
            setLoading(false);
        };

        const onFail = (response) => {
            toast.error("Failed to fetch logs!");
            toast.error("Error code: " + response.status);
            setLoading(false);
        };

        await get(ENDPOINTS.GetLogs, onSuccess, onFail, token);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleFilter = () => {
        let filtered = logs;

        // Filtruj po statusie
        if (statusFilter) {
            filtered = filtered.filter(log => log.status.toLowerCase().includes(statusFilter.toLowerCase()));
        }

        if (typeFilter) {
            filtered = filtered.filter(log => log.type.toLowerCase().includes(typeFilter.toLowerCase()));
        }

        // Filtruj po zakresie dat
        if (startDate) {
            filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(endDate));
        }

        const sortedFiltered = filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setFilteredLogs(sortedFiltered);
        setShowAll(true);
    };

    const toggleDetails = (id) => {
        setExpandedLogId(expandedLogId === id ? null : id);
    };

    const logsToDisplay = showAll ? filteredLogs : filteredLogs.slice(0, 50);

    return (
        <div>
            <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                <Form.Control
                    type="text"
                    placeholder="Filter by type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <Form.Control
                    type="text"
                    placeholder="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ maxWidth: '200px' }}
                />
                <Button variant="primary" onClick={handleFilter}>
                    Apply Filters
                </Button>
            </div>

            {loading && <p>Loading logs...</p>}

            {filteredLogs.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logsToDisplay.map((log) => (
                            <>
                                <tr key={log.id} onClick={() => toggleDetails(log.id)} style={{ cursor: 'pointer' }}>
                                    <td>{log.user ?? "Anonymo"}</td>
                                    <td>{log.type}</td>
                                    <td>{log.status}</td>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.details}</td>
                                </tr>
                                {expandedLogId === log.id && (
                                    <tr key={`${log.id}-details`} className="bg-light">
                                        <td colSpan="5">
                                            <div>
                                                <p><strong>IP Address:</strong> {log.ip_address ?? 'N/A'}</p>
                                                <p><strong>Device Details:</strong></p>
                                                <ul>
                                                    <li>
                                                        <strong>Device Type:</strong>{' '}
                                                        {log.device?.is_mobile
                                                            ? 'Mobile'
                                                            : log.device?.is_tablet
                                                            ? 'Tablet'
                                                            : log.device?.is_pc
                                                            ? 'Desktop'
                                                            : 'Unknown'}
                                                    </li>
                                                    <li><strong>Browser:</strong> {log.device?.browser ?? 'N/A'}</li>
                                                    <li><strong>OS:</strong> {log.device?.os ?? 'N/A'}</li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </Table>
            )}

            {filteredLogs.length === 0 && !loading && <p>No logs found.</p>}
        </div>
    );
}

export default LogsTable;
