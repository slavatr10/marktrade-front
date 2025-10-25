import axios from "@/config/axios";

import type {
  CategoryProgress,
  CategoryWithProgress,
  ExerciseProgress,
  LessonProgress,
  Progress,
  TrackCategory,
  TrackExercise,
  TrackLesson,
  TrackLessonWithDetails,
} from "@/types";

export const getCourseProgress = async (
  course_id: string
): Promise<Progress | null> => {
  try {
    const response = await axios.get<Progress>(
      `/progress/courses/${course_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching progress for course ID ${course_id}:`,
        error.message
      );
    }
    return null;
  }
};

export const getCourseProgressInLessons = async (
  category_id: string
): Promise<LessonProgress | null> => {
  try {
    const response = await axios.get<LessonProgress>(
      `/progress/categories/${category_id}/lessons`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching lesson progress for category ID ${category_id}:`,
        error.message
      );
    }
    return null;
  }
};

export const getCategoryLessons = async (
  categoryId: string
): Promise<TrackLessonWithDetails[] | null> => {
  try {
    const response = await axios.get<TrackLessonWithDetails[]>(
      `/progress/users/lessons/categories/${categoryId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching lesson progress`,
        error.message
      );
    }
    return null;
  }
};

export const getCourseProgressInExercises = async (
  category_id: string
): Promise<ExerciseProgress | null> => {
  try {
    const response = await axios.get<ExerciseProgress>(
      `/progress/categories/${category_id}/exercises`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching exercise progress for category ID ${category_id}:`,
        error.message
      );
    }
    return null;
  }
};

export const getCourseProgressCategories = async (
  category_id: string
): Promise<CategoryProgress | null> => {
  try {
    const response = await axios.get<CategoryProgress>(
      `/progress/categories/${category_id}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching progress for categories with ID ${category_id}:`,
        error.message
      );
    }
    return null;
  }
};

export const setProgressLesson = async (
  lessonId: string,
  completed: boolean
): Promise<TrackLesson | null> => {
  try {
    const response = await axios.post<TrackLesson>(`/progress/lessons/track`, {
      lessonId: lessonId,
      completed: completed,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while setting progress for lesson ID ${lessonId}:`,
        error.message
      );
    }
    return null;
  }
};

export const submitCategoryProgress = async (
  category_id: string,
  progress: number,
  complete: boolean
): Promise<TrackCategory | null> => {
  try {
    const response = await axios.post<TrackCategory>(
      `/progress/categories/track`,
      {
        categoryId: category_id,
        progress: progress,
        completed: complete,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while submit category track`,
        error.message
      );
    }
    return null;
  }
};

export const submitExercisesProgress = async (
  category_id: string,
  complete: boolean
): Promise<TrackExercise | null> => {
  try {
    const response = await axios.post<TrackExercise>(
      `/progress/exercises/track`,
      {
        exerciseId: category_id,
        completed: complete,
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while submit category track`,
        error.message
      );
    }
    return null;
  }
};

export const getCategoriesProgress = async (): Promise<
  CategoryWithProgress[] | null
> => {
  try {
    const response = await axios.get<CategoryWithProgress[]>(
      `/progress/users/categories`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while submit category track`,
        error.message
      );
    }
    return null;
  }
};
