import React, { useEffect, useState } from "react";

// Toast Component
const ReminderToast = ({ message, onClose, index }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // auto close after 5s
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                top: `${20 + index * 70}px`, // shift each toast up
                right: "20px",
                background: "#4caf50",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                zIndex: 9999,
                minWidth: "250px",
            }}
        >
            {message}
        </div>
    );
};

const TaskReminder = ({ tasks }) => {
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            tasks.forEach((task) => {
                if (task.status === "completed") return; // skip finished tasks

                const taskTime = new Date(`${task.reminderTime}:00`);
                const diff = taskTime - now;

                if (diff > 0 && diff <= 5 * 60 * 1000) {
                    const minutes = Math.floor(diff / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);

                    // Only push if not already showing
                    setReminders((prev) => {
                        const alreadyShown = prev.find((r) => r.id === task.id);
                        if (alreadyShown) return prev;
                        return [
                            ...prev,
                            {
                                id: task.id,
                                message: (
                                    <>
                                        Task <span className="text-capitalize fw-bold">{task.title}</span> is due in{" "}
                                        {minutes}m {seconds}s!
                                    </>
                                ),
                            },
                        ];
                    });
                    console.log('Called');

                    // Remove reminder after 30s so it can appear again
                    setTimeout(() => {
                        setReminders((prev) => prev.filter((r) => r.id !== task.id));
                    }, 30000);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [tasks]);



    return (
        <>
            {reminders.map((rem, index) => (
                <ReminderToast
                    key={rem.id}
                    message={rem.message}
                    index={index}
                    onClose={() =>
                        setReminders((prev) => prev.filter((r) => r.id !== rem.id))
                    }
                />
            ))}
        </>
    );
};

export default TaskReminder;
