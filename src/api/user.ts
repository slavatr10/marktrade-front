import axios from "axios";

export const getBalance = async (traderId: string) => {
    try {
        const response = await axios.post(`/users/pocket-option-balance`, {
            traderId, // відправляємо як рядок
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error occurred while fetching balance:", error.message);
        }
    }
};
