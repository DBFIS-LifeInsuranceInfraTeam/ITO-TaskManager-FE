import apiClient from '../apiClient';



export const addLiketoComment = async (commentId: bigint, userId: string) => {
    try {
        const response = await apiClient.post(`/comments/${commentId}/like`, {
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};