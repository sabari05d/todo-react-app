import React from 'react'

import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { CgMenuLeft } from "react-icons/cg";
import { Modal, Button } from "react-bootstrap";
import { FaBell, FaPlus } from 'react-icons/fa';
import AddTaskModal from '../components/AddTaskModal';
import { useQuery } from '@tanstack/react-query';
import { getProfile, getProfileImage } from "../services/profileService";
import dummyProfile from '../assets/images/dummy-profile.jpg';

function Layout({ theme, setTheme }) {

    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const { data: profileImage } = useQuery({
        queryKey: ["profileImage"],
        queryFn: getProfileImage,
    });

    const userName = profile?.firstName || "User";
    const userImage = profileImage || dummyProfile;

    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showTaskModal, setShowTaskModal] = React.useState(false);

    const [tasks, setTasks] = React.useState([]);

    // Load tasks from localStorage when Layout mounts
    React.useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, [showTaskModal]);

    const handleSaveTask = (task) => {
        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };





    return (
        <>
            <div className={`d-flex ${theme === "Dark" ? "theme-dark" : "theme-light"}`}>
                {/* Sidebar for desktop */}
                <div
                    className="d-none d-md-block border-end position-fixed h-100 bg-white"
                    style={{ width: "240px" }}
                >
                    <div className="p-3 border-bottom">
                        <h5 className="m-0">
                            <span className="dfs-1 fw-bold text-danger">
                                <Link to="/" className='text-decoration-none text-danger'>DoQuest</Link>
                            </span>
                        </h5>
                    </div>
                    <Nav className="flex-column p-2 ">
                        <Nav.Link as={Link} onClick={handleClose} to="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link as={Link} onClick={handleClose} to="/tasks">Tasks</Nav.Link>
                        <Nav.Link as={Link} onClick={handleClose} to="/settings">Settings</Nav.Link>
                    </Nav>
                </div>

                {/* Main Content wrapper */}
                <div className={`flex-grow-1 w-100 min-vh-100 ${theme === "Dark" ? "theme-dark" : "theme-light"}`} style={{ marginLeft: "0", backgroundColor: '#f8f9fc' }}>
                    {/* Navbar */}
                    <Navbar bg={theme === "Dark" ? "dark" : "white"} expand={false} className="shadow-sm px-3">
                        <span role="button" tabIndex="0"
                            className="d-md-none p-2 fs-5"
                            onClick={handleShow}
                        >
                            <CgMenuLeft className="mb-1" />
                        </span>
                        <Navbar.Brand className="ms-2">
                            <span className="dfs-1 fw-bold text-danger">
                                <Link to="/" className='text-decoration-none text-danger'>DoQuest</Link>
                            </span>
                        </Navbar.Brand>
                        {/* User Info */}
                        <div className="ms-auto d-flex align-items-center">

                            {/* Bell Icon */}
                            <span className="me-4 text-secondary">
                                <FaBell />
                            </span>

                            {/* Avatar */}
                            <img
                                src={userImage}
                                alt="User Avatar"
                                style={{
                                    width: "35px",
                                    height: "35px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginRight: "8px",
                                }}
                            />

                            {/* Name (hidden on small screens, shown on md+) */}
                            <span className="text-muted d-none d-md-inline">{userName}</span>
                        </div>
                    </Navbar>

                    {/* Offcanvas Sidebar for mobile */}
                    <Offcanvas show={show} onHide={handleClose} className="d-md-none bg-white">
                        <Offcanvas.Header closeButton className="shadow">
                            <Offcanvas.Title>
                                <span className="dfs-1 fw-bold text-danger">DoQuest</span>
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column">
                                <Nav.Link as={Link} onClick={handleClose} to="/dashboard">Dashboard</Nav.Link>
                                <Nav.Link as={Link} onClick={handleClose} to="/tasks">Tasks</Nav.Link>
                                <Nav.Link as={Link} onClick={handleClose} to="/settings">Settings</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* Page Content */}
                    <main
                        className="p-4"
                        style={{
                            marginLeft: window.innerWidth >= 768 ? "240px" : "0",
                            transition: "margin-left 0.3s ease",
                        }}
                    >
                        <Outlet /> {/* 👈 This renders the active route (Dashboard, Tasks, etc.) */}

                        <Button
                            className="btn btn-danger rounded-circle shadow"
                            style={{
                                position: "fixed",
                                bottom: "50px",
                                right: "50px",
                                width: "60px",
                                height: "60px",
                                fontSize: "24px",
                            }}
                            onClick={() => setShowTaskModal(true)}
                        >
                            <FaPlus className='mb-1' />
                        </Button>
                    </main>
                </div>
            </div >

            {/* Add Task Modal */}
            < AddTaskModal
                show={showTaskModal}
                handleClose={() => setShowTaskModal(false)
                }
                handleSave={handleSaveTask}
            />
        </>
    );
}

export default Layout;
