import apiClient from '../services/apiClient';

interface updateTaskData {
    projectId: string;
    taskName: string;
    description: string;
    assigneeId: string;
    createdDate: string;
    startDate: string;
    dueDate: string;
    frequencyId: number|null;
    status: number;
    itoProcessId: string;
    assigneeConfirmation: string; //Y/N
}

export const updateTask = async (taskId: string,taskData: updateTaskData) => {
    try {
        const response = await apiClient.put(`/tasks/${taskId}`, taskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};