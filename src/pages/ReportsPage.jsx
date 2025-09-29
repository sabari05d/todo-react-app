import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card, Row, Col, ProgressBar, Spinner } from "react-bootstrap";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
    ResponsiveContainer
} from "recharts";
import { getTasks } from "../services/taskService";
import { VscGraph } from "react-icons/vsc";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppData } from "../context/AppDataContext";



const ReportsPage = () => {
    const { tasks, categories } = useAppData();

    const categoryMap = categories.reduce((acc, c) => {
        acc[c.id] = c;
        return acc;
    }, {});

    // --- Dynamic Data Processing ---
    const today = new Date().toISOString().split("T")[0];

    // Tasks due today
    const todayTasks = tasks.filter(task => task.due_date?.startsWith(today));

    // Completed today (use completedAt if exists, fallback to due_date)
    const completedToday = tasks.filter(
        t => t.status === "finished" && t.completedAt?.startsWith(today)
    ).length;

    // This Week’s Tasks (due_date based)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekTasks = tasks.filter(task => {
        const due = new Date(task.due_date);
        return due >= startOfWeek && due <= endOfWeek;
    });

    // Completed this week (using status)
    const completedWeek = weekTasks.filter(t => t.status === "finished").length;

    // ✅ Completed vs Pending (Pie Chart)
    const completedCount = tasks.filter(t => t.status === "finished").length;
    const pendingCount = tasks.length - completedCount;
    const pieData = [
        { name: "Completed", value: completedCount },
        { name: "Pending", value: pendingCount }
    ];
    const COLORS = ["#28a745", "#dc3545"];

    // ✅ Tasks per day (dynamic)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const barData = days.map((day, index) => {
        const dayTasks = weekTasks.filter(t => new Date(t.due_date).getDay() === index);
        const completedDay = dayTasks.filter(t => t.status === "finished").length;
        return { day, completed: completedDay };
    });

    // Category Reports (dynamic)
    const categoryReports = Object.values(
        tasks.reduce((acc, t) => {
            const categoryName = categoryMap[t.category_id]?.name || "Uncategorized";

            if (!acc[categoryName]) {
                acc[categoryName] = {
                    category: categoryName,
                    total: 0,
                    completed: 0,
                    color: categoryMap[t.category]?.color || "#6c757d" // fallback color
                };
            }

            acc[categoryName].total++;
            if (t.status === "finished") acc[categoryName].completed++;
            return acc;
        }, {})
    );



    return (
        <div className="container-fluid">
            <h2 className="mb-4"><VscGraph /> Reports & Progress</h2>

            {/* Summary Cards */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Today’s Progress</Card.Title>
                            <Card.Text>
                                {completedToday}/{todayTasks.length} tasks finished
                            </Card.Text>
                            <ProgressBar
                                now={todayTasks.length ? (completedToday / todayTasks.length) * 100 : 0}
                                label={`${todayTasks.length ? Math.round((completedToday / todayTasks.length) * 100) : 0}%`}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="mt-3 mt-md-0">
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>This Week’s Progress</Card.Title>
                            <Card.Text>
                                {completedWeek}/{weekTasks.length} tasks finished
                            </Card.Text>
                            <ProgressBar
                                variant="info"
                                now={weekTasks.length ? (completedWeek / weekTasks.length) * 100 : 0}
                                label={`${weekTasks.length ? Math.round((completedWeek / weekTasks.length) * 100) : 0}%`}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Completed vs Pending</Card.Title>
                            <ResponsiveContainer width="100%" height={250} >

                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                        onClick={() => { }}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>

                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Tasks Completed (This Week)</Card.Title>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip cursor={{ stroke: 'transparent' }} />
                                    <Bar dataKey="completed" fill="#007bff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Category Reports */}
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Card.Title>Reports by Category</Card.Title>

                    <Row>

                        {categoryReports.map((cat, index) => (
                            <Col lg={6} key={index} className="mb-3">
                                <p>
                                    <strong>
                                        {cat.category}:
                                    </strong>
                                    {' '} {cat.completed}{' '}/{' '}{cat.total}
                                    {' '} Finished
                                </p>
                                <ProgressBar
                                    variant="success"
                                    now={cat.total ? (cat.completed / cat.total) * 100 : 0}
                                    label={`${cat.total ? Math.round((cat.completed / cat.total) * 100) : 0}%`}
                                />
                            </Col>
                        ))}
                    </Row>

                </Card.Body>
            </Card>
        </div>
    );
};

export default ReportsPage;
