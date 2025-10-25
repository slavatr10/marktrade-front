import { Exercise, Lesson, Question } from "@/types";

export interface Category {
  id: string;
  name: string;
  order: number;
  description: string;
  lessonsQuantity: number;
  hoursQuantity: number;
  exerciseId: string;
  courseId: string;
  lessons: Lesson[];
}

export interface CurrentCategory extends Category {
  exercise: CurrentCategoryExercise;
}

export interface CurrentCategoryExercise extends Omit<Exercise, "questions"> {
  questions: CurrentCategoryQuestion[];
}

export interface CurrentCategoryQuestion extends Omit<Question, "answers"> {
  exerciseId: string;
}

export interface MaterialsCategory extends Category {
  progress?: number;
  completed?: boolean;
  exerciseProgress?: number;
  exerciseCompleted?: boolean;
  exercise?: {
    number: number;
  };
}
