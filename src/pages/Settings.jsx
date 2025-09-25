import React, { useState } from "react";
import { Card, Nav, Form, Button, Row, Col } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProfile,
    saveProfile,
    getProfileImage,
    saveProfileImage,
    deleteProfileImage,
} from "../services/profileService";
import dummyProfile from '../assets/images/dummy-profile.jpg';
import { clearAllTasks } from "../services/taskService";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("personal");
    const queryClient = useQueryClient();

    // Fetch profile & image with React Query
    const { data: formData = {}, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });
    const { data: profileImage } = useQuery({
        queryKey: ["profileImage"],
        queryFn: getProfileImage,
    });


    // Mutations
    const saveProfileMutation = useMutation({
        mutationFn: saveProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            alert("Profile saved successfully!");
        },
    });

    const saveImageMutation = useMutation({
        mutationFn: saveProfileImage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profileImage"] }),
    });

    const deleteImageMutation = useMutation({
        mutationFn: deleteProfileImage,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profileImage"] }),
    });

    const handleClearTasks = async () => {
        if (window.confirm("Are you sure you want to clear all tasks?")) {
            await clearAllTasks();
            alert("All tasks have been cleared!");
            // Optionally, refresh your tasks state in parent component
        }
    };

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        queryClient.setQueryData(["profile"], {
            ...formData,
            [name]: value,
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                saveImageMutation.mutate(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        deleteImageMutation.mutate();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveProfileMutation.mutate(formData);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container my-4">
            <Row>
                {/* Sidebar Tabs */}
                <Col md={3} className="mb-3 mb-md-0">
                    <Card className="p-3">
                        <Nav
                            variant="pills"
                            className="flex-column"
                            activeKey={activeTab}
                            onSelect={(selectedKey) => setActiveTab(selectedKey)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="personal">Personal Info</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="d-none">
                                <Nav.Link eventKey="general">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="data">Manage Data</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card>
                </Col>

                {/* Content Area */}
                <Col md={9}>
                    <Card className="p-4">
                        <Form onSubmit={handleSubmit}>
                            {/* Profile */}
                            {activeTab === "personal" && (
                                <>
                                    {/* Profile Image Upload Section */}
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="me-3">
                                            <img
                                                src={profileImage || dummyProfile}
                                                alt="Profile"
                                                style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                id="fileInput"
                                                style={{ display: "none" }}
                                                onChange={handleImageUpload}
                                            />

                                            <Button
                                                variant="primary"
                                                className="me-2 mb-2 w-100"
                                                onClick={() => document.getElementById("fileInput").click()}
                                            >
                                                Upload New
                                            </Button>

                                            <Button
                                                variant="outline-secondary"
                                                className="mb-2 w-100"
                                                onClick={handleDeleteImage}
                                            >
                                                Delete Avatar
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Mobile</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        Save Changes
                                    </Button>
                                </>
                            )}

                            {/* Theme */}
                            {activeTab === "general" && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Theme</Form.Label>
                                    <Form.Select
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleChange}
                                    >
                                        <option>Light</option>
                                        <option>Dark</option>
                                    </Form.Select>
                                </Form.Group>
                            )}

                            {/* Data */}
                            {activeTab === "data" && (
                                <div className="p-3 border rounded shadow-sm bg-light">
                                    <h5 className="mb-3">Manage Your Tasks</h5>
                                    <p className="mb-2">
                                        You can clear all your tasks from here. This will remove all tasks permanently.
                                    </p>
                                    <p className="text-warning fw-semibold fst-italic mb-3">
                                        Note: This action cannot be undone!
                                    </p>
                                    <Button variant="danger" onClick={handleClearTasks}>
                                        Clear All Tasks
                                    </Button>
                                </div>
                            )}



                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Settings;
