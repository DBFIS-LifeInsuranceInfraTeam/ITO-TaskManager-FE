import axios from 'axios';

const BASE_URL = '/api/comments';

interface AddLikeResponse {
    commentId: string;
    likeCount: number;
    likedUsers: string[];
}

export const addLiketoComment = async (commentId: bigint, userId: string): Promise<AddLikeResponse> => {
    try {
        const response = await axios.post(`comments/${commentId}/like`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error adding like:", error.response?.data);
            throw new Error(error.response?.data || "Failed to add like");
        }
        throw error;
    }
};
