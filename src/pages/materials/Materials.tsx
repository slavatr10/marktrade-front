import { useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { getAuthTelegram } from '@/api/auth';

import {
  getCategoryLessons,
  getCourseProgressInExercises,
} from '@/api/progress';
import { sendDepositNotification } from '@/api/sendpulse';

import {
  useCourse,
  useCourseProgress,
  useExercises,
} from '@/hooks/useMaterialsData';

import { useLoaderStore } from '@/store';
import { GlobalLoader, CourseHeader, CategoryItem } from '@/components';
import {
  Course,
  Progress,
  Lesson,
  MaterialsCategory,
  TrackLessonWithDetails,
  OpenedCourse,
} from '@/types';

import { Footer } from '@/components/footer/Footer';

// const FIRST_MODULE_ID = "2bccc164-1ec9-4bc5-affd-401da5376d44";
// const FIRST_LESSON_IN_MODULE_2_ID = "00c58918-65fb-4907-af13-d59074e227aa";
const FIRST_MODULE_ID = 'f9848e2a-2260-4281-ba6f-15f03666d1c8';
const FIRST_LESSON_IN_MODULE_2_ID = '5707d68c-6818-4521-9ddb-273f87d3ced6';

// Кастомный хук для получения всех данных материалов из курса
const useMaterialsData = (courseData: OpenedCourse | undefined) => {
  const categoriesData = courseData?.categories || [];

  const exerciseIds = useMemo(
    () => categoriesData.map((cat) => cat.exercise?.id).filter(Boolean),
    [categoriesData]
  );

  const { data: exercisesData = {} } = useExercises(exerciseIds);

  const exerciseQuestions = useMemo(
    () =>
      Object.entries(exercisesData).reduce((acc, [id, exercise]) => {
        if (exercise?.questions) {
          acc[id] = exercise.questions.length;
        }
        return acc;
      }, {} as Record<string, number>),
    [exercisesData]
  );

  // Перетворюємо категорії в MaterialsCategory format
  const materialsCategories = useMemo(
    () =>
      categoriesData.map((category) => ({
        ...category,
        exerciseId: category.exercise?.id || '',
        exercise: {
          number: category.exercise?.number || 0,
        },
      })),
    [categoriesData]
  );

  return { exerciseQuestions, materialsCategories };
};

const MaterialsPage = () => {
  const { loading, startLoading, stopLoading } = useLoaderStore();
  const navigate = useNavigate();
  const search = useSearch({ from: '/materials' });
  const courseId = search.id;
  const openCategoryId = search.openCategory;
  const userId = localStorage.getItem('user_id') || '';

  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [categories, setCategories] = useState<MaterialsCategory[]>([]);
  const [totalCompletedExercises, setTotalCompletedExercises] =
    useState<number>(0);
  const [lessonsProgress, setLessonsProgress] = useState<
    Record<string, TrackLessonWithDetails[]>
  >({});
  const [firstTestCompleted, setFirstTestCompleted] = useState<boolean>(false);

  const { data: courseData, isLoading: courseLoading } = useCourse(courseId);
  const { data: courseProgressData, isLoading: progressLoading } =
    useCourseProgress(courseId);

  const { exerciseQuestions, materialsCategories } =
    useMaterialsData(courseData);

  const currentCategory = useMemo(() => {
    const inProgressCategory = categories.find(
      (cat) => (cat.progress || 0) > 0 && (cat.progress || 0) < 100
    );
    if (inProgressCategory) return inProgressCategory;
    const firstIncompleteCategory = categories.find((cat) => !cat.completed);
    return firstIncompleteCategory || categories[0] || null;
  }, [categories]);

  const isCategoryAccessible = useCallback(
    (categoryIndex: number): boolean => {
      if (categoryIndex === 0) return true;
      return categories[categoryIndex - 1]?.completed || false;
    },
    [categories]
  );

  const ifLessonCompleted = useCallback(
    (categoryId: string, lessonId: string): boolean => {
      return Boolean(
        lessonsProgress[categoryId]?.find((cur) => cur.lessonId === lessonId)
          ?.completed
      );
    },
    [lessonsProgress]
  );

  const toggleLesson = useCallback(
    (categoryId: string) => {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === categoryId
      );
      if (isCategoryAccessible(categoryIndex)) {
        setExpandedLesson((prev) => (prev === categoryId ? null : categoryId));
      }
    },
    [categories, isCategoryAccessible]
  );

  const handleDepositNotification = useCallback(async () => {
    const contactId = localStorage.getItem('contact_id');
    if (contactId) {
      await sendDepositNotification(contactId);
    }
  }, []);

  useEffect(() => {
    const fetchDepositStatus = async () => {
      if (!localStorage.getItem('deposit')) {
        try {
          const responseAuth = await getAuthTelegram(userId);
          const depositStatus = responseAuth?.data?.user?.deposit;

          localStorage.setItem('deposit', depositStatus ? 'true' : 'false');

          if (depositStatus) {
            await handleDepositNotification();
          }
        } catch (error) {
          console.error('Ошибка при проверке статуса депозита:', error);
        }
      }
    };

    fetchDepositStatus();
  }, [userId, handleDepositNotification]);

  useEffect(() => {
    const loadCategoriesData = async () => {
      if (
        courseLoading ||
        progressLoading ||
        !courseData ||
        !materialsCategories.length ||
        !courseProgressData
      )
        return;

      startLoading();

      try {
        let completedExercisesCount = 0;
        const categoriesWithProgress = await Promise.all(
          materialsCategories.map(async (category) => {
            const [progressExercise, responseLessonProgress] =
              await Promise.all([
                getCourseProgressInExercises(category.id),
                getCategoryLessons(category.id),
              ]);

            if (category.id === FIRST_MODULE_ID) {
              setFirstTestCompleted(progressExercise?.completed || false);
            }

            if (progressExercise?.completedExercises) {
              completedExercisesCount += progressExercise.completedExercises;
            }

            setLessonsProgress((prev) => ({
              ...prev,
              [category.id]: responseLessonProgress || [],
            }));

            // Підраховуємо прогрес на основі завершених уроків
            const lessonsProgressData = responseLessonProgress || [];
            const completedLessonsCount = lessonsProgressData.filter(
              (lesson) => lesson.completed
            ).length;
            const totalLessonsCount = lessonsProgressData.length;
            const calculatedProgress =
              totalLessonsCount > 0
                ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
                : 0;
            const isCategoryCompleted =
              completedLessonsCount === totalLessonsCount &&
              totalLessonsCount > 0;

            return {
              ...category,
              progress: calculatedProgress,
              completed: isCategoryCompleted,
              exerciseCompleted: progressExercise?.completed || false,
            };
          })
        );
        setCategories(categoriesWithProgress);
        setTotalCompletedExercises(completedExercisesCount);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        stopLoading();
      }
    };

    loadCategoriesData();
  }, [
    courseData,
    materialsCategories,
    courseProgressData,
    courseLoading,
    progressLoading,
    startLoading,
    stopLoading,
  ]);

  useEffect(() => {
    if (openCategoryId && categories.length > 0) {
      const categoryExists = categories.find(
        (cat) => cat.id === openCategoryId
      );
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === openCategoryId
      );

      if (categoryExists && isCategoryAccessible(categoryIndex)) {
        setExpandedLesson(openCategoryId);
        navigate({ to: `/materials?id=${courseId}`, replace: true });
      }
    }
  }, [openCategoryId, categories, isCategoryAccessible, courseId, navigate]);

  const handleLessonIdClick = useCallback(
    (lesson: Lesson, index: number, category: MaterialsCategory) => {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === category.id
      );
      if (!isCategoryAccessible(categoryIndex)) {
        console.log('Категория заблокирована');
        return;
      }

      const isFirstLesson = index === 0;
      const previousLessonCompleted =
        index > 0 &&
        ifLessonCompleted(category.id, category.lessons[index - 1].id);
      const lessonAlreadyCompleted = ifLessonCompleted(category.id, lesson.id);
      const isLessonAccessible =
        isFirstLesson || previousLessonCompleted || lessonAlreadyCompleted;

      const isDepositFalse = localStorage.getItem('deposit') === 'false';

      if (lesson.id === FIRST_LESSON_IN_MODULE_2_ID && isDepositFalse) {
        navigate({ to: '/deposit', search: { courseId: courseId } });
        return;
      }

      if (isLessonAccessible) {
        navigate({
          to: `/lesson`,
          search: {
            id: lesson.id,
            lessonNumber: (index + 1).toString(),
            course_id: courseId,
            category_id: category.id,
            exercise_id: category.exerciseId || '',
            exercisesQuantity: (
              exerciseQuestions[category.exerciseId || ''] || 0
            ).toString(),
            testNumber: (category.exercise?.number || 0).toString(),
          },
        });
      }
    },
    [
      categories,
      courseId,
      exerciseQuestions,
      isCategoryAccessible,
      ifLessonCompleted,
      navigate,
    ]
  );

  if (loading || courseLoading || progressLoading) {
    return <GlobalLoader />;
  }

  return (
    <div className="min-h-dvh overflow-y-auto bg-neutral-950 overflow-y-auto">
      <div className="flex flex-col h-full items-center justify-between">
        <Suspense fallback={<GlobalLoader />}>
          <CourseHeader
            course={courseData as Course}
            courseProgress={courseProgressData as Progress}
            totalCompletedExercises={totalCompletedExercises}
          />
        </Suspense>

        <div
          className="flex flex-1 w-full"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 140% 80% at left top, rgba(35,82,52,1) 0%, #171717 85%),
              radial-gradient(ellipse 140% 80% at right top, rgba(25,33,28,1) 0%, #171717 85%)
            `,
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#0a0a0a',
          }}
        >
          <div className="flex flex-col flex-1 w-screen h-full bg-neutral-950 p-4 pb-24 rounded-t-[24px]">
            <p className="text-base text-white font-bold">Програма курсу</p>
            <div className="flex flex-col mt-4 gap-4">
              {categories?.map((category, index) => (
                <Suspense key={category.id} fallback={<div>Загрузка...</div>}>
                  <CategoryItem
                    category={category}
                    index={index}
                    currentCategory={currentCategory}
                    expandedLesson={expandedLesson}
                    courseId={courseId}
                    exerciseQuestions={exerciseQuestions}
                    lessonsProgress={lessonsProgress}
                    firstTestCompleted={firstTestCompleted}
                    isPreviousCategoryCompleted={index === 0 || categories[index - 1].completed || false}
                    onToggleLesson={toggleLesson}
                    onLessonClick={handleLessonIdClick} showTest={false}                  />
                </Suspense>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MaterialsPage;
