import apiClient from '../services/apiClient';

export const searchTask = async (filters: { itoProcessId: string; assigneeId: string; startDate: string; dueDate: string; taskName: string; }) => {
    const params: { [key: string]: string } = {};

    if (filters.itoProcessId) params.itoProcessId = filters.itoProcessId;
    if (filters.assigneeId) params.assigneeId = filters.assigneeId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.dueDate) params.dueDate = filters.dueDate;
    if (filters.taskName) params.taskName = filters.taskName;

    try {
        const response = await apiClient.get('/tasks/search', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
    
};