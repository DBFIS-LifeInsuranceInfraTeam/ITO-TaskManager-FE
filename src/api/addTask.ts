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

    recurring?: boolean; // 주기적 여부
    frequencyType?: string; // daily, weekly, monthly, yearly 등
    frequencyInterval?: number; // n일, n주, n개월마다 등
    hasEndDate?: boolean; // 종료일 여부

    // 주기적인 업무 옵션
    weeklyDay?: string[];           // 매주 반복 시 특정 요일 (예: 'Monday')

    // 매월 반복
    monthlyDayOfMonth?: number;   // 매월 특정 일자 (예: 매월 6일)
    monthlyWeekOfMonth?: number;  // 매월 특정 주차 (예: 첫째 주)
    monthlyDayOfWeek?: string;    // 매월 특정 요일 (예: 'Wednesday' - 첫째 주 수요일)

    // 매년 반복
    yearlyMonth?: number;         // 매년 특정 월 (예: 11 - 11월)
    yearlyDayOfMonth?: number;    // 매년 특정 일자 (예: 6일)
    yearlyWeekOfMonth?: number;   // 매년 특정 주차 (예: 첫째 주)
    yearlyDayOfWeek?: string;     // 매년 특정 요일 (예: 'Wednesday' - 첫째 주 수요일)
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