import React from 'react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, addTask, updateTask, deleteTask } from "../services/taskService";
import EditTaskModal from '../components/EditTaskModel';
import { Badge, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { FaCheckCircle, FaClock, FaRegCircle } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { useAppData } from '../context/AppDataContext';


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

    // Handle mobile/desktop range
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch tasks via React Query
    const { tasks, profile, categories } = useAppData();


    const today = new Date().toISOString().split("T")[0];

    // Filter pending + overdue tasks
    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.due_date).toISOString().split("T")[0];
        return task.status === "pending" && taskDate <= today;
    });

    const upcomingTasks = tasks
        .filter((task) => task.status === "pending" && task.due_date >= today)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    // ✅ Mutations
    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: (updatedTask) => {
            queryClient.setQueryData(["tasks"], (oldTasks = []) =>
                oldTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
            );
        },
    });


    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => queryClient.invalidateQueries(["tasks"]),
    });

    // Helpers
    const getCategory = (id) => categories.find((c) => c.id == id);

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


            {/* Task Cards */}
            <Row>
                {/* Pending and Today's Tasks */}
                <Col md={8}>
                    <h1 className="fw-bold mb-3">Welcome, Your Grace!</h1>
                    {/* <p className="">Your pending tasks up to today...</p> */}
                    <Row>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <Col md={6} key={task.id}>
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
                                                                    backgroundColor: getCategory(task.category_id)?.color || "#6c757d",
                                                                    color: "white" // ensure text is visible
                                                                }}
                                                            >
                                                                {
                                                                    getCategory(task.category_id)?.name || "Unknown"
                                                                }
                                                            </Badge>

                                                            {task.due_date && (
                                                                <span className="ms-2">
                                                                    <FaClock style={{ color: "#6f42c1" }} className="me-1 mb-1" />
                                                                    {new Date(task.due_date).toLocaleDateString()} {/* Formats YYYY-MM-DD */}
                                                                    {task.due_time && (
                                                                        <span className="ms-2">
                                                                            {task.due_time.slice(0, 5)} {/* Show HH:MM */}
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
                            <p className="text-start text-muted mb-0">No tasks for today.</p>
                        )}
                    </Row>
                </Col>

                {/* Upcoming Tasks */}
                <Col md={4}>
                    <h2 className="fw-bold mb-3">Upcoming Tasks</h2>
                    <Card className='border-0 pb-0 '>
                        <Card.Body>
                            <Row>
                                {upcomingTasks.length > 0 ? (
                                    upcomingTasks.map((task) => (
                                        <Col key={task.id}>
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
                                                                            backgroundColor: getCategory(task.category_id)?.color || "#6c757d",
                                                                            color: "white" // ensure text is visible
                                                                        }}
                                                                    >
                                                                        {
                                                                            getCategory(task.category_id)?.name || "Unknown"
                                                                        }
                                                                    </Badge>

                                                                    {task.due_date && (
                                                                        <span className="ms-2">
                                                                            <FaClock style={{ color: "#6f42c1" }} className="me-1 mb-1" />
                                                                            {new Date(task.due_date).toLocaleDateString()} {/* Formats YYYY-MM-DD */}
                                                                            {task.due_time && (
                                                                                <span className="ms-2">
                                                                                    {task.due_time.slice(0, 5)} {/* Show HH:MM */}
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
                                    <p className="text-start text-muted mb-0">No Upcoming Tasks.</p>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

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
