import { Category } from "./Category";
import { Lesson } from "./Lesson";

export interface Progress {
  total: number;
  completed: boolean;
  completedLessons: number;
  totalLessons: number;
}

export interface LessonProgress {
  progress: number;
  completed: boolean;
}

export type CategoryProgress = LessonProgress;

export interface ExerciseProgress {
  progress: number;
  completed: boolean;
  completedExercises: number;
  totalExercises: number;
}

export interface TrackLesson {
  id: string;
  completed: boolean;
  lessonId: string;
  userId: string;
}

export interface TrackLessonWithDetails extends TrackLesson {
  lesson: Lesson;
  courseId?: string;   
  categoryId?: string;
}

export interface TrackCategory extends TrackLesson {
  progress: number;
}

export interface TrackExercise extends Omit<TrackLesson, "lessonId"> {
  exerciseId: string;
}

export interface CategoryWithProgress {
  id: string;
  progress: number;
  completed: boolean;
  categoryId: string;
  userId: string;
  category: Omit<Category, "lessons">;
}
