import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../services/taskService";
import { useAppData } from "../context/AppDataContext";

function AddTaskModal({ show, handleClose }) {
    const { categories } = useAppData();
    const queryClient = useQueryClient();


    const [formData, setFormData] = React.useState({
        title: "",
        remarks: "",
        due_date: new Date().toISOString().split("T")[0], // pre-fill with today   
        due_time: "",
        reminder_time: "",
        category_id: "", // will set default below
    });

    // Update default category_id when categories load
    React.useEffect(() => {
        if (categories.length > 0 && !formData.category_id) {
            setFormData((prev) => ({ ...prev, category_id: categories[0].id }));
        }
    }, [categories]);



    const addTaskMutation = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]);
            handleClose(); // ✅ close modal
            setFormData({
                title: "",
                remarks: "",
                due_date: "",
                due_time: "",
                reminder_time: "",
                category_id: categories[0]?.id || "",
            });
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = () => {
        if (isSubmitting) return; // prevent double clicks
        setIsSubmitting(true);

        if (!formData.title.trim()) {
            alert("Task title is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.due_date) {
            alert("Due date is required");
            setIsSubmitting(false);
            return;
        }

        const newTask = {
            ...formData,
            id: Date.now().toString(),
            status: "pending",
            completed_at: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addTaskMutation.mutate(newTask, {
            onSettled: () => {
                setIsSubmitting(false); // re-enable after success or error
            },
        });
    };


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>ADD TASK</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="taskTitle">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskDueDate">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="due_date"
                            value={formData.due_date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskDueTime">
                        <Form.Label>Due Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="due_time"
                            value={formData.due_time}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskReminderDateTime">
                        <Form.Label>Reminder Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="reminder_time"
                            value={formData.reminder_time}
                            onChange={handleChange}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskRemarks">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Remarks Here..."
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={addTaskMutation.isLoading || isSubmitting}
                >
                    {addTaskMutation.isLoading || isSubmitting ? "Saving..." : "Save Task"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTaskModal;
