import React from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // React Query mutation
    const registerMutation = useMutation({
        mutationFn: (newUser) => api.post('/register', newUser),
        onSuccess: (res) => {
            console.log('User registered:', res.data);
            window.location.href = '/sign-in'
        },
        onError: (err) => {
            console.error(err.response?.data || err.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        registerMutation.mutate({
            name: formData.firstName + ' ' + formData.lastName,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            mobile_number: formData.mobileNumber,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
        });
    };

    return (
        <Row className='bg-light min-vh-100 m-0 justify-content-center align-items-center'>
            <Col md={8} lg={5}>
                <Card className='shadow border-0 rounded-3'>
                    <Card.Body>
                        <Card.Title className='text-center mb-3'>
                            Welcome to DoQuest!
                        </Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="firstName">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="lastName">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="mobileNumber">
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Mobile Number"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password_confirmation">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm Password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button
                                type="submit"
                                variant="primary"
                                className='w-100'
                                disabled={registerMutation.isLoading}
                            >
                                {registerMutation.isLoading ? 'Signing Up...' : 'Sign Up'}
                            </Button>

                            <hr />

                            <p className="text-center">
                                Already have a Account? <Link to="/sign-in" className='fw-semibold'>Sign In</Link>
                            </p>

                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default SignUp;
