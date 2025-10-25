import { CurrentCategory } from "./Category";

export interface Course {
  id: string;
  name: string;
  description: string;
  mentor: string;
  lessonsQuantity: number;
  hoursQuantity: number;
  exercisesQuantity: number;
  rate: number;
}

export interface OpenedCourse extends Course {
  categories: CurrentCategory[];
}

export interface CourseWithProgress extends Course {
  total?: number;
  completed: boolean;
  completedLessons: number;
  totalLessons?: number;
  isBlocked: boolean;
}
