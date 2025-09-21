// Simulating API with localStorage
const STORAGE_KEY = "tasks";

export const getTasks = async () => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
};

export const addTask = async (task) => {
    const tasks = await getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return task;
};

export const updateTask = async (updatedTask) => {
    let tasks = await getTasks();
    tasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return updatedTask;
};

export const deleteTask = async (id) => {
    let tasks = await getTasks();
    tasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return id;
};
