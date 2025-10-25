import axios from "@/config/axios";
import { Course, CourseWithProgress, OpenedCourse } from "@/types";

export const getCourses = async (): Promise<CourseWithProgress[]> => {
  try {
    const response = await axios.get<CourseWithProgress[]>(`/courses`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error occurred while fetching courses:", error.message);
    }
    return [];
  }
};

export const openCourseById = async (id: string) => {
  try {
    const response = await axios.get<OpenedCourse>(`/courses/${id}/open`);
    console.log('response', response.data);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching category with ID ${id}:`,
        error.message
      );
    }
  }
};

export const getCourseById = async (id: string) => {
  try {
    const response = await axios.get<Course>(`/courses/${id}`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Error occurred while fetching course with ID ${id}:`,
        error.message
      );
    }
  }
};
