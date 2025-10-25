import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CategoryItem } from '@/components';

import {
  MaterialsCategory,
  TrackLessonWithDetails,
  Lesson,
} from '@/types';
import { sendDepositNotification } from '@/api/sendpulse';
import { getAuthTelegram } from '@/api/auth';

type Props = { 
  courseId?: string;
  categories: MaterialsCategory[];
  lessonsProgress: Record<string, TrackLessonWithDetails[]>;
  firstTestCompleted: boolean;
  exerciseQuestions: Record<string, number>;
};

const FIRST_MODULE_ID = 'ac2b5bb0-c5ce-4622-b1da-feb63fecb735';
const FIRST_LESSON_IN_MODULE_2_ID = 'f85c93ed-aca4-43d5-a021-d05bbe7a6a2d';

export const ActiveCourseModules: React.FC<Props> = ({ courseId,
  categories,
  lessonsProgress,
  firstTestCompleted,
  exerciseQuestions, }) => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/' });
  const openCategoryId = search.openCategory;

  const userId = localStorage.getItem('user_id') || '';

  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const currentCategory = useMemo(() => {
    const inProgress = categories.find(
      (c) => (c.progress || 0) > 0 && (c.progress || 0) < 100
    );
    if (inProgress) return inProgress;
    const firstIncomplete = categories.find((c) => !c.completed);
    return firstIncomplete || categories[0] || undefined;
  }, [categories]);

  const isCategoryAccessible = useCallback(
    (idx: number) => (idx === 0 ? true : !!categories[idx - 1]?.completed),
    [categories]
  );

  const ifLessonCompleted = useCallback(
    (categoryId: string, lessonId: string) =>
      Boolean(
        lessonsProgress[categoryId]?.find((l) => l.lessonId === lessonId)
          ?.completed
      ),
    [lessonsProgress]
  );

  const onToggleLesson = useCallback(
    (categoryId: string) => {
      const idx = categories.findIndex((c) => c.id === categoryId);
      if (isCategoryAccessible(idx))
        setExpandedLesson((p) => (p === categoryId ? null : categoryId));
    },
    [categories, isCategoryAccessible]
  );

  const onLessonClick = useCallback(
    (lesson: Lesson, index: number, category: MaterialsCategory) => {
      const categoryIndex = categories.findIndex((c) => c.id === category.id);
      if (!isCategoryAccessible(categoryIndex)) return;

      const isFirst = index === 0;
      const prevDone =
        index > 0 &&
        ifLessonCompleted(category.id, category.lessons[index - 1].id);
      const already = ifLessonCompleted(category.id, lesson.id);
      const allowed = isFirst || prevDone || already;
      const isDepositFalse = localStorage.getItem('deposit') === 'false';
      if (lesson.id === FIRST_LESSON_IN_MODULE_2_ID && isDepositFalse) {
        navigate({ to: '/deposit', search: { courseId: courseId } });
        return;
      }
      if (!allowed) return;

      navigate({
        to: '/lesson',
        search: {
          id: lesson.id,
          lessonNumber: String(index + 1),
          course_id: courseId || '',
          category_id: category.id,
          exercise_id: category.exerciseId || '',
          exercisesQuantity: String(
            exerciseQuestions[category.exerciseId || ''] || 0
          ),
          testNumber: String(category.exercise?.number || 0),
        },
      });
    },
    [
      categories,
      isCategoryAccessible,
      ifLessonCompleted,
      navigate,
      courseId,
      exerciseQuestions,
    ]
  );

  useEffect(() => {
    const handleDepositNotification = async () => {
      const contactId = localStorage.getItem('contact_id');
      if (contactId) {
        await sendDepositNotification(contactId);
      }
    };

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
          console.error('Помилка при перевірці статусу депозиту:', error);
        }
      }
    };

    if (userId) {
      fetchDepositStatus();
    }
  }, [userId]);

  useEffect(() => {
    if (openCategoryId && categories.length > 0) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === openCategoryId
      );
      if (categoryIndex !== -1 && isCategoryAccessible(categoryIndex)) {
        setExpandedLesson(openCategoryId);
        navigate({
          to: '/',
          search: (prev: any) => ({ ...prev, openCategory: undefined }),
          replace: true,
        });
      }
    }
  }, [openCategoryId, categories, isCategoryAccessible, navigate]);

  if (!courseId) return null;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4">
        {categories.map((category, index) => {
          const shouldShowTest = category.id !== FIRST_MODULE_ID;
          return (
            <Suspense key={category.id} fallback={<div>Загрузка…</div>}>
              <CategoryItem
                category={category}
                index={index}
                currentCategory={currentCategory}
                expandedLesson={expandedLesson}
                courseId={courseId}
                exerciseQuestions={exerciseQuestions}
                lessonsProgress={lessonsProgress}
                firstTestCompleted={firstTestCompleted}
                isPreviousCategoryCompleted={
                  index === 0 || categories[index - 1].completed || false
                }
                onToggleLesson={onToggleLesson}
                onLessonClick={onLessonClick}
                showTest={shouldShowTest}
              />
            </Suspense>
          );
        })}
      </div>
    </div>
  );
};
