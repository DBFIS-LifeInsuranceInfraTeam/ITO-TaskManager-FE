import apiClient from '../apiClient';

interface updateTaskData {
    projectId: string;
    taskName: string;
    description: string;
    assigneeIds: string[];
    createdDate: string;
    startDate: string;
    dueDate: string;
    itoProcessId: string;
}

export const updateTask = async (taskId: string,taskData: Record<string, any>) => {
    try {
        const response = await apiClient.put(`/tasks/${taskId}`, taskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};