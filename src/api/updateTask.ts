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
    itoProcessId: number;
    assigneeConfirmation: string; //Y/N
}

export const updateTask = async (taskData: updateTaskData) => {
    try {
        const response = await apiClient.put(`/tasks`, taskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};