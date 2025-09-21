import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, addTask, updateTask, deleteTask } from "../services/taskService";
import categoriesData from "../data/categories.json";
import EditTaskModal from '../components/EditTaskModel';
import { Badge, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaRegCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';


// Colors for status
const statusColors = {
    pending: "warning",
    finished: "success",
};


const Dashboard = ({ theme, setTheme }) => {
    const queryClient = useQueryClient();

    // Edit modal
    const [showEdit, setShowEdit] = React.useState(false);
    const [currentTask, setCurrentTask] = React.useState(null);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const [categories, setCategories] = React.useState([]);

    // Handle mobile/desktop range
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ Categories (static JSON)
    React.useEffect(() => {
        setCategories(categoriesData);
    }, []);

    // Fetch tasks via React Query
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    });

    const today = new Date().toISOString().split("T")[0];

    // Filter pending + overdue tasks
    const filteredTasks = tasks.filter(
        (task) => task.status === "pending" && task.dueDate <= today
        // (task) => task.dueDate <= today
    );

    // ✅ Mutations
    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });


    if (isLoading) return <p>Loading...</p>;

    // Helpers
    const getCategory = (id) => categories.find((c) => c.id === id.toString());


    const handleEdit = (task) => {
        setCurrentTask(task);
        setShowEdit(true);
    };

    const CustomToggle = React.forwardRef(({ onClick }, ref) => (
        <span
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            style={{ cursor: "pointer" }}
        >
            <BsThreeDots size={18} />
        </span>
    ));


    return (
        <>
            <h1 className="fw-bold">Welcome, Your Grace!</h1>
            <p className="">Your pending tasks up to today...</p>

            {/* Task Cards */}
            <Row>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <Col md={4} key={task.id}>
                            <Card className={`mb-3 shadow-sm text-capitalize ${theme === "Dark" ? "theme-dark" : "theme-light"}`}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        {/* Left: Task details */}
                                        <div className="d-flex ">
                                            <div className="d-flex justify-content-center align-items-center me-2">
                                                {/* Checkbox */}
                                                {task.status === "finished" ? (
                                                    <FaCheckCircle
                                                        className="text-success fs-4"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            updateTaskMutation.mutate({ ...task, status: "pending" })
                                                        }
                                                    />
                                                ) : (
                                                    <FaRegCircle
                                                        className="text-secondary fs-4"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            updateTaskMutation.mutate({ ...task, status: "finished" })
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <h6 className="mb-1">{task.title}</h6>
                                                {task.remarks && (
                                                    <p className="small  mb-2">{task.remarks}</p>
                                                )}
                                                <small className="">
                                                    <Badge
                                                        bg=""
                                                        style={{
                                                            backgroundColor: getCategory(task.categoryId)?.color || "#6c757d",
                                                            color: "white" // ensure text is visible
                                                        }}
                                                    >
                                                        {
                                                            getCategory(task.categoryId)?.name || "Unknown"
                                                        }
                                                    </Badge>

                                                    {task.dueDate && (
                                                        <span className="ms-2">
                                                            <FaClock
                                                                style={{ color: "#6f42c1" }}
                                                                className="me-1 mb-1"
                                                            />
                                                            {task.dueDate}
                                                            {task.dueTime && (
                                                                <span className="ms-2">
                                                                    {task.dueTime}
                                                                </span>
                                                            )}
                                                        </span>
                                                    )}


                                                </small>
                                            </div>
                                        </div>

                                        {/* Right: Menu + Checkbox + Status */}
                                        <div className="d-flex flex-column align-items-end justify-content-between">
                                            <div>
                                                {/* 3 dots dropdown */}
                                                <Dropdown className="task-dropdown mb-0">
                                                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom" />

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item onClick={() => handleEdit(task)}>Edit Task</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => deleteTaskMutation.mutate(task.id)}>
                                                            Delete Task
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>



                                            <div>
                                                {/* Status Badge */}
                                                <Badge bg={statusColors[task.status] || "secondary"}>
                                                    {task.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center text-muted">No tasks for today.</p>
                )}
            </Row>

            <EditTaskModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                task={currentTask}
                onUpdate={(updatedTask) => updateTaskMutation.mutate(updatedTask)}
            />

        </>
    )
}

export default Dashboard
