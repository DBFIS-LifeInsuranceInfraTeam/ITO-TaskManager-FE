import apiClient from '../services/apiClient';

interface addTaskData {
    taskId: number|null;
    projectId: number;
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

export const addTask = async (taskData: addTaskData) => {
    try {
        const response = await apiClient.post(`/tasks`, taskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};