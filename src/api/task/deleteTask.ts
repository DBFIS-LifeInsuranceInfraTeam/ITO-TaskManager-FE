import apiClient from "../apiClient";

export const deleteTask = async (taskId: string) => {
    try {
        const response = await apiClient.delete(`/tasks/${taskId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching date:", error);
        throw error;
    }
};