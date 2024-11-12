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
    projectId: string;
    taskName: string;
    description: string;
    assigneeId: string;
    createdDate: string;
    startDate: string;
    dueDate: string;
    frequencyId: null | number;
    status: number;
    itoProcessId: string;
    assigneeConfirmation: string;
    recurring?: boolean; // 주기적 여부
    frequencyType?: string; // daily, weekly, monthly, yearly 등
    frequencyInterval?: number | null; // n일, n주, n개월마다 등
    hasEndDate?: boolean; // 종료일 여부
    weeklyDay?: string[];
    monthlyDayOfMonth?: number | null;
    monthlyWeekOfMonth?: number | null;
    monthlyDayOfWeek?: string | null;
    yearlyMonth?: number | null;
    yearlyDayOfMonth?: number | null;
    yearlyWeekOfMonth?: number | null;
    yearlyDayOfWeek?: string | null;
  }


export const addTask = async (taskData: AddTaskData) => {
    try {
        // Set dueDate to be the same as startDate
        const fullTaskData = {
            ...taskData,
            dueDate: taskData.startDate,
        };

        const response = await apiClient.post(`/tasks/addtask`, fullTaskData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};