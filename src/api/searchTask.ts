import apiClient from '../services/apiClient';
import qs from 'qs';
// export const searchTask = async (filters: { projectIds: string[]; itoProcessId: string; unit: string; assigneeId: string; startDate: string; dueDate: string; taskName: string; }) => {
//     const params: { [key: string]: string } = {};

//     if (filters.itoProcessId) params.itoProcessId = filters.itoProcessId;
//     if (filters.itoProcessId) params.unit = filters.unit;
//     if (filters.assigneeId) params.assigneeId = filters.assigneeId;
//     if (filters.startDate) params.startDate = filters.startDate;
//     if (filters.dueDate) params.dueDate = filters.dueDate;
//     if (filters.taskName) params.taskName = filters.taskName;

//     // projectIds와 unit 필터 추가
//     if (filters.projectIds && filters.projectIds.length > 0) {
//         params.projectIds = filters.projectIds; // 배열로 직렬화
//     }

//     try {
//         const response = await apiClient.get('/tasks/search', { params });
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching tasks:", error);
//         throw error;
//     }
    
// };
export const searchTask = async (filters: { 
    itoProcessId?: string; 
    assigneeId?: string; 
    startDate?: string; 
    dueDate?: string; 
    taskName?: string; 
    projectIds?: string[]; // 여러 프로젝트 ID 지원
    unit?: string; // 유닛 필터 추가
}) => {
    const params: { [key: string]: string | string[] } = {};

    // 필터에 따라 파라미터 추가
    if (filters.itoProcessId) params.itoProcessId = filters.itoProcessId;
    if (filters.assigneeId) params.assigneeId = filters.assigneeId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.dueDate) params.dueDate = filters.dueDate;
    if (filters.taskName) params.taskName = filters.taskName;
    
    // projectIds와 unit 필터 추가
    if (filters.projectIds && filters.projectIds.length > 0) {
        params.projectIds = filters.projectIds; // 배열로 직렬화
    }
    if (filters.unit) params.unit = filters.unit;

    try {
        //const response = await apiClient.get('/tasks/search', { params });
        const response = await apiClient.get('/tasks/search', {
            params: filters,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }) // projectIds[]=10&projectIds[]=20 형식으로 직렬화
          });
        return response.data;
        
    
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};