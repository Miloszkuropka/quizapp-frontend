import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { get, post } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';

function EditUser() {
    const { userId } = useParams();
    const { token } = useContext(LoginContext);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);

            const url = ENDPOINTS.GetUserDetails.replace(':userId', userId);

            const onSuccess = (response, data) => {
                setUserDetails(data);
                setLoading(false);
            };

            const onFail = (response) => {
                toast.error('Failed to fetch user details!');
                setLoading(false);
            };

            await get(url, onSuccess, onFail, token);
        };

        fetchUserDetails();
    }, [userId, token]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleUpdateUser = async () => {
        setUpdating(true);
        const url = ENDPOINTS.UpdateUser.replace(':userId', userId);

        const onSuccess = (response, data) => {
            toast.success('User updated!');
            setUpdating(false);
            navigate('/admin/userlist')
        };

        const onFail = (response) => {
            toast.error('Failed to update user.');
            setUpdating(false);
        };

        await post(url, userDetails, onSuccess, onFail, token);
    };

    const handleDeleteUser = async () => {
        const url = ENDPOINTS.DeleteUser.replace(':userId', userId);

        const onSuccess = () => {
            toast.success('User has been deleted!');
            navigate('/admin/userlist'); 
        };

        const onFail = () => {
            toast.error('Failed to delete user.');
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Error during deletion');
            }
    
            if (response.status !== 204) {
                const data = await response.json();
                console.log(data);
            }
    
            onSuccess();
        } catch (error) {
            onFail();
            console.error('Error deleting user:', error);
        } 
    };

    const handleShowDeleteModal = () => setShowDeleteModal(true);
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    const handleShowUpdateModal = () => setShowUpdateModal(true);
    const handleCloseUpdateModal = () => setShowUpdateModal(false);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!userDetails) {
        return <p className="text-center">User details not available.</p>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <Button
                    variant="secondary"
                    onClick={() => navigate('/admin/userlist')}
                >
                    Go Back
                </Button>
            </div>

            <h2 className="form-width">Edit user</h2>
            <p></p>
            <Form className="form-width">
                <Form.Group className="mb-3">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={userDetails.first_name || ''}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={userDetails.last_name || ''}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>User name</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={userDetails.username || ''}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={userDetails.email || ''}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="primary"
                        onClick={handleShowUpdateModal}
                        disabled={updating}
                    >
                        {updating ? 'Updating...' : 'Accept changes'}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleShowDeleteModal}
                    >
                        Delete user
                    </Button>
                </div>
            </Form>

            {/* Modal potwierdzenia usunięcia */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation of deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user? This operation cannot be undone
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal do potwierdzenia akceptowania zmian */}
            <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation of update</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to update this user? This operation cannot be undone
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUpdateModal}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleUpdateUser}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditUser;