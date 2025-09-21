import React from "react";
import { Badge, Card, Dropdown, Row, Col, Form } from "react-bootstrap";
import categoriesData from "../data/categories.json";
import { FaCheckCircle, FaClock, FaRegCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import EditTaskModal from "../components/EditTaskModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, addTask, updateTask, deleteTask } from "../services/taskService";

// Colors for status
const statusColors = {
    pending: "warning",
    finished: "success",
};

const Tasks = () => {
    const queryClient = useQueryClient();

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [categories, setCategories] = React.useState([]);
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

    // ✅ Categories (static JSON)
    React.useEffect(() => {
        setCategories(categoriesData);
    }, []);

    // ✅ React Query: Fetch tasks
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    });

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




    // Format date
    const formatDay = (date) =>
        date.toLocaleDateString("en-US", { weekday: "short" });
    const formatDateNum = (date) =>
        date.toLocaleDateString("en-US", { day: "numeric" });



    const getDates = () => {
        let arr = [];
        const range = isMobile ? 2 : 4;
        for (let i = -range; i <= range; i++) {
            let d = new Date();
            d.setDate(selectedDate.getDate() + i);
            arr.push(d);
        }
        return arr;
    };



    // Helpers
    const getCategory = (id) => categories.find((c) => c.id === id.toString());
    const filteredTasks = tasks.filter(
        (task) => task.dueDate === selectedDate.toISOString().split("T")[0]
    );

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
        <div className="">
            {/* Date Navigation */}
            <div className="d-flex justify-content-between mb-3">
                {getDates().map((d, i) => (
                    <div
                        key={i}
                        className={`px-3 mx-1 py-2 rounded text-center ${d.toDateString() === selectedDate.toDateString()
                            ? "bg-primary text-white"
                            : "bg-light"
                            }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedDate(d)}
                    >
                        <p className="mb-0 fw-bold">{formatDateNum(d)}</p>
                        <p className="mb-1">{formatDay(d)}</p>
                    </div>
                ))}
            </div>

            {/* Task Cards */}
            <Row>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <Col md={4} key={task.id}>
                            <Card className="mb-3 shadow-sm text-capitalize">
                                <Card.Body>
                                    <div className="d-flex justify-content-between">
                                        {/* Left: Task details */}
                                        <div className="d-flex ">
                                            <div className="d-flex justify-content-center align-items-center me-2">
                                                {/* Checkbox */}
                                                {/* <Form.Check
                                                    type="checkbox"
                                                    checked={task.status === "finished"}
                                                    onChange={() =>
                                                        updateTaskMutation.mutate({
                                                            ...task,
                                                            status: task.status === "pending" ? "finished" : "pending",
                                                        })
                                                    }
                                                    className="mb-2 mt-0"
                                                /> */}

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
                                                    <p className="small text-muted mb-2">{task.remarks}</p>
                                                )}
                                                <small className="text-muted">
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

                                                    {task.dueTime && (
                                                        <span className="ms-2">
                                                            <FaClock
                                                                style={{ color: "#6f42c1" }}
                                                                className="me-1 mb-1"
                                                            />
                                                            {task.dueTime}
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
                    <p className="text-center text-muted">No tasks for this day.</p>
                )}
            </Row>

            <EditTaskModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                task={currentTask}
                onUpdate={(updatedTask) => updateTaskMutation.mutate(updatedTask)}
            />
        </div>
    );
};

export default Tasks;
