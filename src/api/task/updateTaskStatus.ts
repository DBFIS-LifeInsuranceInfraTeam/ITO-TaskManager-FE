import apiClient from '../apiClient';


export const updateTaskStatus = async (taskId: string) => {
    try {
        const response = await apiClient.post(`/tasks/${taskId}/complete`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};