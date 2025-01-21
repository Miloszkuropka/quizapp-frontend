import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post1 } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';

function UserForm() {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        email: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const onSuccess = () => {
            toast.success('User created successfully!');
            navigate('/admin/userlist');
        };

        const onFail = (response) => {
            toast.error('Failed to create user. Check the form and try again.');
            setSubmitting(false);
        };

        await post1(ENDPOINTS.Register, formData, onSuccess, onFail);
    };

    return (
        <div className="container mt-4">
            <h2 className="form-width">Create User</h2>
            <p></p>
            <Form onSubmit={handleSubmit} className="form-width">
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter username"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter password"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                        required
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : 'Create User'}
                </Button>
            </Form>
        </div>
    );
}

export default UserForm;