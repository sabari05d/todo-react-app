import React, { forwardRef } from "react";
import { Badge, Card, Dropdown, Row, Col, Form } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaRegCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import EditTaskModal from "../components/EditTaskModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks, addTask, updateTask, deleteTask } from "../services/taskService";
import { IoCalendarNumber } from "react-icons/io5";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { getCategories } from "../services/categories";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppData } from "../context/AppDataContext";



// Colors for status
const statusColors = {
    pending: "warning",
    finished: "success",
};

const CalendarButton = forwardRef(({ onClick }, ref) => (
    <div
        className="bg-white shadow p-2 px-3 rounded cursor d-flex align-items-center"
        onClick={onClick}  // DatePicker opens when this is clicked
        ref={ref}
    >
        <IoCalendarNumber className="fs-5 me-2" />
        <span>Calendar</span>
    </div>
));

const Tasks = () => {
    const queryClient = useQueryClient();

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    // Edit modal
    const [showEdit, setShowEdit] = React.useState(false);
    const [currentTask, setCurrentTask] = React.useState(null);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    const [showPicker, setShowPicker] = React.useState(false);

    // Handle mobile/desktop range
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch tasks via React Query
    const { tasks, profile, categories } = useAppData();

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



    // Format date
    const formatDay = (date) =>
        date.toLocaleDateString("en-US", { weekday: "short" });
    const formatDateNum = (date) =>
        date.toLocaleDateString("en-US", { day: "numeric" });



    const getDates = () => {
        let arr = [];
        const range = isMobile ? 2 : 4;
        for (let i = -range; i <= range; i++) {
            let d = new Date(selectedDate);
            d.setDate(selectedDate.getDate() + i);
            arr.push(d);
        }
        return arr;
    };



    const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.due_date).toISOString().split("T")[0];
        const selected = selectedDate.toISOString().split("T")[0];
        return taskDate === selected;
    });


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




    // Helper to get category object by id
    const getCategory = (id) => categories.find((c) => c.id === id);
    console.log(getCategory);

    return (
        <div className="">
            <div className="d-flex">
                <div className="justify-content-end">
                    <div className="text-end mb-3" style={{ cursor: 'pointer' }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            customInput={<CalendarButton />}  // our trigger
                            withPortal
                            onClickOutside={() => { }} // optional: can handle outside clicks
                        />
                    </div>
                </div>
            </div>


            {/* Date Navigation */}
            <div className="d-flex justify-content-between mt-1 mb-3">
                {getDates().map((d, i) => (
                    <div
                        key={i}
                        className={`px-3 mx-1 py-2 rounded text-center border shadow ${d.toDateString() === selectedDate.toDateString()
                            ? "bg-primary text-white"
                            : "bg-white"
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
                                                            backgroundColor: getCategory(task.category_id)?.color || "#6c757d",
                                                            color: "white" // ensure text is visible
                                                        }}
                                                    >
                                                        {
                                                            getCategory(task.category_id)?.name || "Unknown"
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
