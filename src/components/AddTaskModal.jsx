import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "../services/taskService";
import categories from "../data/categories.json";

function AddTaskModal({ show, handleClose }) {
    const queryClient = useQueryClient();

    const [formData, setFormData] = React.useState({
        title: "",
        remarks: "",
        dueDate: new Date().toISOString().split("T")[0], // pre-fill with today   
        dueTime: "",
        categoryId: categories[0]?.id || "",
    });

    const addTaskMutation = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            queryClient.invalidateQueries(["tasks"]); // refresh tasks everywhere
            handleClose();
            setFormData({
                title: "",
                remarks: "",
                dueDate: "",
                dueTime: "",
                categoryId: categories[0]?.id || "",
            });
        },
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {


        if (!formData.title.trim()) {
            alert("Task title is required");
            return;
        }
        if (!formData.dueDate) {
            alert("Due date is required");
            return;
        }


        const newTask = {
            ...formData,
            id: Date.now().toString(),
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addTaskMutation.mutate(newTask);
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
                            name="categoryId"
                            value={formData.categoryId}
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
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskDueTime">
                        <Form.Label>Due Time</Form.Label>
                        <Form.Control
                            type="time"
                            name="dueTime"
                            value={formData.dueTime}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskRemarks">
                        <Form.Label>Remarks</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Optional notes"
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
                    disabled={addTaskMutation.isLoading}
                >
                    {addTaskMutation.isLoading ? "Saving..." : "Save Task"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTaskModal;
