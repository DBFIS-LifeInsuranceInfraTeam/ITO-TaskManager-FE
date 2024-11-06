import apiClient from '../services/apiClient';

// interface addTaskData {
//     taskName: string;
//     description: string;
//     assigneeId: string;
//     createdDate: string;
//     startDate: string;
//     dueDate: string;
//     frequencyId: number|null;
//     status: number;
//     itoProcessId: number;
//     assigneeConfirmation: string; //Y/N
// }

// export const addTask = async (taskData: addTaskData) => {
//     try {
//         const response = await apiClient.post(`/tasks`, taskData);
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

interface AddTaskData {
    taskName: string;
    description: string;
    assigneeId: string;
    createdDate: string;
    startDate: string;
    dueDate: string;
    frequencyId: number | null;
    status: number;
    itoProcessId: number;
    assigneeConfirmation: string; // 'Y' or 'N'

    isRecurring?: boolean; // 주기적 여부
    frequencyType?: string; // daily, weekly, monthly, yearly 등
    frequencyInterval?: number; // n일, n주, n개월마다 등
    hasEndDate?: boolean; // 종료일 여부
}

export const addTask = async (taskData: AddTaskData) => {
    try {
        // Set dueDate to be the same as startDate
        const fullTaskData = {
            ...taskData,
            dueDate: taskData.startDate,
        };

        const response = await apiClient.post(`/tasks`, fullTaskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};