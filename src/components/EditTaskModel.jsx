
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import categories from "../data/categories.json";


const EditTaskModal = ({ show, onHide, task, onUpdate }) => {
    const [form, setForm] = useState(task || {});

    useEffect(() => {
        setForm(task || {});
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = () => {
        onUpdate(form); // ✅ call parent mutation
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="taskTitle">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            name="title"
                            value={form.title || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="taskCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="categoryId"
                            value={form.categoryId || ""}
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
                            value={form.dueDate || ""}
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
                            value={form.dueTime || ""}
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
                            value={form.remarks || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Update Task
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditTaskModal;
