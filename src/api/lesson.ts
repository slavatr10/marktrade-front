import axios from "@/config/axios";
import type { Lesson } from "@/types";

export const getLessons = async (): Promise<Lesson[] | null> => {
  try {
    const response = await axios.get<Lesson[]>(`/lessons`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occurred while fetching lessons:", error.message);
    }
    return null;
  }
};

export const getLessonById = async (id: string): Promise<Lesson | null> => {
  try {
    const response = await axios.get<Lesson>(`/lessons/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching lesson with ID ${id}:`,
        error.message
      );
    }
    return null;
  }
};
