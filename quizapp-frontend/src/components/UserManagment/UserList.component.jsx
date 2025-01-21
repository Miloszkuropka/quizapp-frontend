import { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { get, post } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { LoginContext } from '../../context/LoginContext';
import "./UserList.component.css";
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, user, supervisor } = useContext(LoginContext); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortActive, setSortActive] = useState(null);
    const navigate = useNavigate();

    const showUsers = async () => {
        console.log("Fetching all users...");
        setLoading(true);
    
        const onSuccess = (response, data) => {
            console.log("Users data: ", data);
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false); 
        };
    
        const onFail = (response) => {
            toast.error("Failed to fetch users!");
            toast.error("Error code: " + response.status);
            setLoading(false); 
        };
    
        await get(ENDPOINTS.GetUsers, onSuccess, onFail, token);
    };
    
    useEffect(() => {
        showUsers();
    }, [token]); 
    
    const handleSubmit = (e) => {
        e.preventDefault();
        showUsers();
    };

    const handleShowModal = (user) => {
        console.log("Showing details for user: ", user);
        setSelectedUser(user);
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false); 
        setSelectedUser(null);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleSort = () => {
        const sorted = [...filteredUsers].sort((a, b) => {
            if (sortActive === null || !sortActive) {
                return b.is_active - a.is_active;
            } else {
                return a.is_active - b.is_active;
            }
        });
        setSortActive(!sortActive);
        setFilteredUsers(sorted);
    };

    const handleEditUser = (userId) => {
        navigate(`/admin/userdetails/${userId}`);
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Form.Control
                    type="text"
                    placeholder="Search by username"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ maxWidth: '300px' }}
                />
                <Button variant="secondary" onClick={handleSort}>
                    Sort by Active ({sortActive ? 'Inactive First' : 'Active First'})
                </Button>
            </div>

            {loading && <p>Loading...</p>}

            {filteredUsers.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Is Activated?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.is_active ? 'Yes' : 'No'}</td>
                                <td>
                                    <Button
                                        variant="info"
                                        onClick={() => handleShowModal(user)}
                                    >
                                        Show details
                                    </Button>
                                    {' '}
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditUser(user.id)}
                                    >
                                        Edit User
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {showModal && (
                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>User details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {selectedUser ? (
                            <>
                                <p><strong>First Name:</strong> {selectedUser.first_name || 'No data'}</p>
                                <p><strong>Last Name:</strong> {selectedUser.last_name || 'No data'}</p>
                                <p><strong>User Name:</strong> {selectedUser.username || 'No data'}</p>
                                <p><strong>E-mail:</strong> {selectedUser.email || 'No data'}</p>
                                <p><strong>Created Date:</strong> {selectedUser.date_joined ? new Date(selectedUser.date_joined).toLocaleString( { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'No data'}</p>
                            </>
                        ) : (
                            <p>No user selected.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
}

export default UserList;