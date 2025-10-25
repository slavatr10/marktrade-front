import { useQuery } from "@tanstack/react-query";
import { openCourseById  } from "@/api/course";
import { 
  getCourseProgress,
} from "@/api/progress";
import { getExerciseById } from "@/api/exercise";
import { OpenedCourse } from "@/types/entities/Course";
import { Progress } from "@/types/entities/Progress";
import { Exercise } from "@/types/entities/Exercise";
import { CACHE_TIME, STALE_TIME } from "@/constants/query";

export const useCourse = (courseId: string) => {
  return useQuery<OpenedCourse | undefined, Error, OpenedCourse>({
    queryKey: ["course", courseId],
    queryFn: () => openCourseById(courseId),
    enabled: Boolean(courseId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    select: (data) => data || {} as OpenedCourse,
  });
};

export const useCourseProgress = (courseId: string) => {
  return useQuery<Progress | null, Error, Progress>({
    queryKey: ["courseProgress", courseId],
    queryFn: () => getCourseProgress(courseId),
    enabled: Boolean(courseId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    select: (data) => ({
      total: data?.total || 0,
      completed: data?.completed || false,
      completedLessons: data?.completedLessons || 0,
      totalLessons: data?.totalLessons || 0,
    }),
  });
};

export const useExercise = (exerciseId: string) => {
  return useQuery<Exercise | null, Error, Exercise>({
    queryKey: ["exercise", exerciseId],
    queryFn: () => getExerciseById(exerciseId),
    enabled: Boolean(exerciseId),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    select: (data) => ({
      ...data,
      questions: data?.questions || [],
      number: data?.number || 0,
    } as Exercise),
  });
};


export const useExercises = (exerciseIds: string[]) => {
  return useQuery<Record<string, Exercise | null>, Error, Record<string, Exercise>>({
    queryKey: ["exercises", exerciseIds.sort().join(",")],
    queryFn: async () => {
      const uniqueIds = [...new Set(exerciseIds)];
      const exercises = await Promise.all(
        uniqueIds.map((id) => getExerciseById(id))
      );

      return exercises.reduce((acc, exercise, index) => {
        if (exercise) {
          acc[uniqueIds[index]] = {
            ...exercise,
            questions: exercise.questions || [],
            number: exercise.number || 0,
          };
        }
        return acc;
      }, {} as Record<string, Exercise>);
    },
    enabled: exerciseIds.length > 0,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

export const useMaterialsData = (courseData: OpenedCourse | undefined) => {
  const exerciseIds = courseData?.categories?.map(cat => cat.exerciseId).filter(Boolean) || [];
  const { data: exerciseQuestions = {} } = useExercises(exerciseIds);

  const materialsCategories = courseData?.categories || [];

  return {
    exerciseQuestions: Object.fromEntries(
      Object.entries(exerciseQuestions).map(([id, exercise]) => [
        id,
        exercise?.questions?.length || 0
      ])
    ),
    materialsCategories,
  };
};


