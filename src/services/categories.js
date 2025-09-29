import api from "../api";


export const getCategories = async () => {
    try {
        const { data } = await api.get("/get-categories");
        return data;
    } catch (error) {
        console.error("Error fetching Categories", error);
        return []; // return empty array on error
    }
};
