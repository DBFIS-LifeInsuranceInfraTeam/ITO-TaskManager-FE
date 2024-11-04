import apiClient from "../services/apiClient";

export const deleteComment = async (commentId: bigint, userId: string) => {
    try {
        
        const response = await apiClient.delete(`/comments/${commentId}`, {
            data: { userId },
          });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching date:", error);
        throw error;
    }
};