import { useState, useEffect } from 'react';
import {
  getCategoryLessons,
  getCourseProgressInExercises,
} from '@/api/progress';
import { MaterialsCategory, TrackLessonWithDetails } from '@/types';

const FIRST_MODULE_ID = 'ac2b5bb0-c5ce-4622-b1da-feb63fecb735';

export const useProcessedCategories = (
  rawCategories: MaterialsCategory[],
  isDataReady: boolean
) => {
  const [categories, setCategories] = useState<MaterialsCategory[]>([]);
  const [lessonsProgress, setLessonsProgress] = useState<
    Record<string, TrackLessonWithDetails[]>
  >({});
  const [firstTestCompleted, setFirstTestCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isDataReady || !rawCategories.length) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);

      const cats: MaterialsCategory[] = [];
      const lessonsProg: Record<string, TrackLessonWithDetails[]> = {};
      let firstTestDone = false;

      for (const category of rawCategories) {
        const [progressExercise, responseLessonProgress] = await Promise.all([
          getCourseProgressInExercises(category.id),
          getCategoryLessons(category.id),
        ]);

        if (!mounted) return;

        lessonsProg[category.id] = responseLessonProgress || [];

        if (category.id === FIRST_MODULE_ID) {
          firstTestDone = !!progressExercise?.completed;
        }

        const lp = responseLessonProgress || [];
        const completedCount = lp.filter((l) => l.completed).length;
        const totalCount = lp.length;
        const calcProgress =
          totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        const isCompleted = totalCount > 0 && completedCount === totalCount;

        cats.push({
          ...category,
          progress: calcProgress,
          completed: isCompleted,
          exerciseCompleted: !!progressExercise?.completed,
        });
      }

      if (mounted) {
        setCategories(cats);
        setLessonsProgress(lessonsProg);
        setFirstTestCompleted(firstTestDone);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [rawCategories, isDataReady]);

  return { 
    processedCategories: categories, 
    lessonsProgress, 
    firstTestCompleted, 
    isLoading: isLoading 
  };
};