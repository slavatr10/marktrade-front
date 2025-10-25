import axios from "@/config/axios";
import { Answer, Exercise, SubmitExercise } from "@/types";

export const getExercises = async () => {
  try {
    const response = await axios.get<Exercise[]>(`/exercises`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occurred while fetching exercises:", error.message);
    }
  }
};

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  try {
    const response = await axios.get<Exercise>(`/exercises/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching exercise with ID ${id}:`,
        error.message
      );
    }
    return null;
  }
};

export const getExercisesByCategoryId = async (
  category_id: string
): Promise<Exercise[] | null> => {
  try {
    const response = await axios.get<Exercise[]>(
      `/exercises/categories/${category_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while get Exercises by category id ${category_id}:`,
        error.message
      );
    }
    return null;
  }
};

export const submitAnswer = async (
  question_id: string,
  answer: Answer
): Promise<SubmitExercise | null> => {
  try {
    const response = await axios.post<SubmitExercise>(`/exercises/submit`, {
      questionId: question_id,
      answer: answer.value,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error occurred while submit answer`, error.message);
    }
    return null;
  }
};
