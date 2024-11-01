import apiClient from '../services/apiClient';

interface AddCommentData {
    taskId: string;
    commentContent: string;
    commenterId: string;
}

export const addComment = async (commentData: AddCommentData) => {
    try {
        const response = await apiClient.post(`/comments`, commentData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};