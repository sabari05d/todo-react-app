import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../api';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // React Query mutation
    const loginMutation = useMutation({
        mutationFn: (newUser) => api.post('/login', newUser),
        onSuccess: (res) => {
            console.log('User Login:', res);

            // Save token + user in localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect to home page
            window.location.href = "/";
        },
        onError: (err) => {
            console.error(err.response?.data || err.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate({
            email: formData.email,
            password: formData.password,
        });
    };


    return (
        <>
            <Row className='bg-light min-vh-100 m-0 justify-content-center align-items-center'>
                <Col md={8} lg={5}>
                    <Card className='shadow border-0 rounded-3'>
                        <Card.Body>
                            <Card.Title className='text-center mb-3'>
                                Welcome back to DoQuest!
                            </Card.Title>

                            <Form onSubmit={handleSubmit}>
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

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <div style={{ position: "relative" }}>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span
                                            onClick={togglePassword}
                                            style={{
                                                position: "absolute",
                                                right: "14px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                                color: "#555"
                                            }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </span>
                                    </div>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className='w-100'
                                    disabled={loginMutation.isLoading}
                                >
                                    {loginMutation.isLoading ? 'Signing In...' : 'Sign In'}
                                </Button>

                                <hr />

                                <p className="text-center">
                                    Don't have an Account? <Link to="/sign-up" className='fw-semibold'>Sign Up</Link>
                                </p>


                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default SignIn