import apiClient from "../apiClient";

// 반복 업무 삭제 함수
export const deleteRelatedTasks = async (taskIdPrefix: string) => {
    try {
        const response = await apiClient.delete('/tasks', {
            params: { taskIdPrefix } // taskIdPrefix를 쿼리 파라미터로 전달
        });
        console.log("Response:", response);
        return response.data; // 삭제 작업에 대한 응답 데이터 반환
    } catch (error) {
        console.error("Error deleting related tasks:", error);
        throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 재발생
    }
};
