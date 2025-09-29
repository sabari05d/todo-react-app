import api from "../api";

// Simulating API with localStorage
const STORAGE_KEY = "tasks";


// Get all tasks
export const getTasks = async () => {
    try {
        const { data } = await api.post("/get-tasks");
        return data; // array of tasks
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
};

// Add new task
export const addTask = async (task) => {
    try {
        const { data } = await api.post("/save-task", task);
        return data; // newly created task from backend
    } catch (error) {
        console.error("Error saving task:", error);
        throw error;
    }
};

// Update existing task
export const updateTask = async (updatedTask) => {
    try {
        if (updatedTask.status === 'finished') {
            updatedTask.completed_at = new Date().toISOString();
        }
        const { data } = await api.post("/update-task", updatedTask);
        return data; // updated task from backend
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

// Delete task
export const deleteTask = async (id) => {
    try {
        const { data } = await api.post("/delete-task", { id });
        return data; // backend can return deleted id or message
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};


// New function to clear all tasks
export const clearAllTasks = async () => {
    // localStorage.removeItem(STORAGE_KEY);
    // return true;

    try {
        const { res } = await api.post("/clear-all-task");
        return res; // backend can return deleted id or message
    } catch (error) {
        console.error("Error Clearing task:", error);
        throw error;
    }
};


// Clear all Tasks
