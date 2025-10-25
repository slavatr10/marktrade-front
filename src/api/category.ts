import axios from "@/config/axios";
import type { Category, CurrentCategory } from "@/types";

export const getCategoryByCourseId = async (course_id: string) => {
  try {
    const response = await axios.get<Category[]>(
      `/categories/courses/${course_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occurred while fetching categories:", error.message);
    }
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    const response = await axios.get<CurrentCategory>(
      `/categories/${categoryId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching category with ID ${categoryId}:`,
        error.message
      );
    }
  }
};
