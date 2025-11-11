import {
  BottomSheet,
  GlobalLoader,
  MaterialBlock,
  SuccessPage,
} from '@/components';
import React, { useEffect, useMemo, useState } from 'react';
//import { useLoaderStore } from '@/store';
// import { Link } from "@tanstack/react-router";
import bgImage from '@/assets/images/main-bg.png';
import { Footer } from '@/components/footer/Footer';
import { useMainData, useTelegramAuth } from '@/hooks';
import { Body, Title } from '@/components/typography';
import { HorizontalCarousel } from '@/components/carousel/HorizontalCarousel';
import LessonsIcon from '@/assets/icons/LessonsIcon';
import PenIcon from '@/assets/icons/PenIcon';
import { ActiveCourseModules } from './ActiveCourseModules';
import { useCourse, useCourseProgress } from '@/hooks/useMaterialsData';
import { getCourseProgressInExercises } from '@/api/progress';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { MaterialsCategory } from '@/types';
import testingImg from '@/assets/images/testing-img.png';
import { useExercises } from '@/hooks/useMaterialsData';
import { OpenedCourse } from '@/types';
import { useProcessedCategories } from '@/hooks/useProcessedCategories';
// MainPage.tsx
import binaryTradingImg from '@/assets/images/binary-trading-img.png';
// ...

const FIRST_COURSE_ID = '8bc653d6-30fe-4f2a-b636-285a882c744d';

const CardItem: React.FC<React.ComponentProps<typeof MaterialBlock>> = (
  props
) => (
  <div className="snap-start shrink-0 mb-11">
    <MaterialBlock {...props} />
  </div>
);

const MainPage: React.FC = () => {
  const { status, resetNoAccess, isTelegramAuthLoading } = useTelegramAuth();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const search = useSearch({ from: '/' });
  const categoryIdToOpenTest = search.openTestFor;
  const courseIdToActivate = search.courseId;
  // const { loading } = useLoaderStore();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [categoryForTest, setCategoryForTest] =
    useState<MaterialsCategory | null>(null);

  const {
    isLoading: isDataLoading,
    error,
    processedCourses,
  } = useMainData(isTelegramAuthLoading);

  console.log(processedCourses);

  const activeCourse = processedCourses[activeIdx];
  const activeCourseId = activeCourse?.id ?? null;
  const { data: activeCourseData, isFetching: isCourseDetailsLoading } =
    useCourse(activeCourseId);
  const {
    data: activeCourseProgress,
    isFetching: isProgressLoading,
    refetch: refetchProgress,
  } = useCourseProgress(activeCourseId);
  const categoriesData =
    (activeCourseData as OpenedCourse | undefined)?.categories || [];

  const exerciseIds = useMemo(
    () => categoriesData.map((c) => c.exercise?.id).filter(Boolean) as string[],
    [categoriesData]
  );
  const { data: exercisesData = {} } = useExercises(exerciseIds);

  const exerciseQuestions = useMemo(() => {
    const out: Record<string, number> = {};
    Object.entries(exercisesData).forEach(([id, ex]) => {
      if (ex?.questions) out[id] = ex.questions.length;
    });
    return out;
  }, [exercisesData]);

  const materialsCategories: MaterialsCategory[] = useMemo(
    () =>
      categoriesData.map((c) => ({
        ...c,
        exerciseId: c.exercise?.id || '',
        exercise: { number: c.exercise?.number || 0 },
      })),
    [categoriesData]
  );
  const isDataReady =
    !isCourseDetailsLoading && !isProgressLoading && !!activeCourseData;

  const {
    processedCategories,
    lessonsProgress,
    firstTestCompleted,
    isLoading: isCategoriesLoading,
  } = useProcessedCategories(materialsCategories, isDataReady);
  const [testsDone, setTestsDone] = useState(0);

  const handleSlideChange = (newIndex: number) => {
    // Переконуємося, що індекс в межах масиву
    if (newIndex >= 0 && newIndex < processedCourses.length) {
      // Оновлюємо активний індекс ТІЛЬКИ ЯКЩО курс не заблокований
      if (!processedCourses[newIndex].isBlocked) {
        setActiveIdx(newIndex);
      }
      // Якщо курс заблокований, можна нічого не робити,
      // або, наприклад, автоматично "повернути" карусель назад (це складніше)
    }
  };

  const handleCourseClick = (
    course: (typeof processedCourses)[0],
    index: number
  ) => {
    if (!course.isBlocked) {
      // Клік на НЕзаблокований курс теж може просто оновлювати індекс,
      // хоча свайп вже це зробить. Можна залишити для ясності.
      setActiveIdx(index);
    }
  };

  useEffect(() => {
    let targetProgress = 0;

    if (!isTelegramAuthLoading) {
      targetProgress = 25;
      if (!isDataLoading && processedCourses.length > 0) {
        targetProgress = 50;
        const img = new Image();
        img.src = binaryTradingImg;
        if (activeCourseId) {
          const detailsDone = !isCourseDetailsLoading && activeCourseData;
          const progressDone = !isProgressLoading && activeCourseProgress;

          if (detailsDone && progressDone) {
            targetProgress = 75; // <-- НЕ 100, а 75!

            // Ось нова перевірка:
            if (!isCategoriesLoading) {
              targetProgress = 100; // <-- ТЕПЕР 100, коли модулі теж готові
            }
          } else if (detailsDone || progressDone) {
            targetProgress = 60; // (трохи змінив)
          }
        } else {
          targetProgress = 100;
        }
      }
    }

    // Анімація прогресу до цільового значення
    const intervalId = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < targetProgress) {
          // Плавно збільшуємо на 1-2% за крок, але не більше цільового
          return Math.min(prev + 2, targetProgress);
        }
        // Якщо досягли цілі, зупиняємо інтервал для цього етапу
        if (prev === 100) {
          clearInterval(intervalId);
        }
        return prev; // Залишаємо поточне значення
      });
    }, 30); // Швидкість анімації (мілісекунди) - можна підібрати

    // Очищуємо інтервал при зміні залежностей або розмонтуванні компонента
    return () => clearInterval(intervalId);
  }, [
    // Залежності залишаються ті самі
    isTelegramAuthLoading,
    isDataLoading,
    processedCourses,
    activeCourseId,
    isCourseDetailsLoading,
    activeCourseData,
    isProgressLoading,
    activeCourseProgress,
    isCategoriesLoading,
  ]);
  useEffect(() => {
    // Якщо є courseId в URL і список курсів вже завантажено
    if (courseIdToActivate && processedCourses.length > 0) {
      // Шукаємо індекс курсу, який потрібно активувати
      const courseIndex = processedCourses.findIndex(
        (c) => c.id === courseIdToActivate
      );
      // Якщо курс знайдено, встановлюємо його як активний
      if (courseIndex !== -1) {
        setActiveIdx(courseIndex);
      }
    }
  }, [courseIdToActivate, processedCourses]);
  useEffect(() => {
    if (activeCourseId) {
      refetchProgress();
    }
  }, [activeCourseId, refetchProgress]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!activeCourseId || !activeCourseData?.categories?.length) {
        if (!cancelled) setTestsDone(0);
        return;
      }
      try {
        const results = await Promise.all(
          activeCourseData.categories.map((cat) =>
            getCourseProgressInExercises(cat.id)
          )
        );
        const sum = results.reduce(
          (acc, r) => acc + (r?.completedExercises ?? 0),
          0
        );
        if (!cancelled) setTestsDone(sum);
      } catch {
        if (!cancelled) setTestsDone(0);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [activeCourseId, activeCourseData?.categories]);

  useEffect(() => {
    if (categoryIdToOpenTest && activeCourseData?.categories) {
      const foundCategory = activeCourseData.categories.find(
        (cat) => cat.id === categoryIdToOpenTest
      );

      if (foundCategory) {
        setCategoryForTest(foundCategory);
        setIsSheetOpen(true);

        navigate({ to: '/', replace: true });
      }
    }
  }, [categoryIdToOpenTest, activeCourseData, navigate]);

  if (loadingProgress < 100) {
    return <GlobalLoader progress={loadingProgress} />;
  }

  if (!activeCourse && !isDataLoading && !isTelegramAuthLoading) {
    return <GlobalLoader progress={100} />;
  }

  if (status === 'no-access') {
    return (
      <SuccessPage
        type="noAccess"
        text="У Вас нету доступа"
        linkUrl="https://t.me/mark_TU7"
        linkText="Написать"
        helperText="напишите нам, чтобы получить доступ к приложению"
        setButtonClicked={resetNoAccess}
      />
    );
  }

  if (error) {
    console.error('Error loading data:', error);
    return <div>Ошибка загрузки данных</div>;
  }

  // const clickId = localStorage.getItem('click_id') || '';
  // const regUrl = `https://u3.shortink.io/register?utm_campaign=802555&utm_source=affiliate&utm_medium=sr&a=jy9IGDHoNUussf&ac=bot-protrd&code=YRL936&click_id=${encodeURIComponent(
  //   clickId
  // )}`;

  // const handleRegClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (window.Telegram?.WebApp) {
  //     window.Telegram.WebApp.openLink(regUrl);
  //   } else {
  //     window.open(regUrl, '_blank');
  //   }
  // };

  const startTest = () => {
    if (!categoryForTest || !activeCourseId) return;

    // Нам потрібні лише ID, які ми вже маємо
    const { exercise } = categoryForTest;
    console.log('Дані категорії для тесту:', categoryForTest);
    const testNumber = exercise?.number || 0;

    navigate({
      to: `/test`,
      search: {
        exercise_id: (exercise as any)?.id,
        question: 1,
        course_id: activeCourseId,
        testNumber: testNumber,
        categoryId: categoryForTest.id,
      },
    });
  };
  console.log('active ' + activeCourse);

  return (
    <>
      <div
        className="
                p-4 min-h-dvh
                pt-[calc(6.8rem+var(--safe-top))]
                md:pt-[calc(4rem+var(--safe-top))]  
                pb-[calc(8rem+var(--safe-bottom))]
              "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <Title variant="h2" className="text-[#181717] mb-1">
          Добро пожаловать в Trade University community
        </Title>
        <Body variant="smMedium" color="medium" className="text-light mb-6">
          Начнём обучение!
        </Body>

        <HorizontalCarousel
          className="mt-2 !-mx-4 !px-4"
          onIndexChange={handleSlideChange}
        >
          {Array.isArray(processedCourses) && processedCourses.length > 0 ? (
            processedCourses.map((course, index) => (
              <div onClick={() => handleCourseClick(course, index)}>
                <CardItem
                  key={course.id}
                  blocked={course.isBlocked}
                  title={course.name}
                  lessons={course.lessonsQuantity}
                  time={course.hoursQuantity}
                  rating={course.rate}
                  completedLessons={course.completedLessons || 0}
                  // onClick={
                  //   !course.isBlocked ? () => setActiveIdx(index) : undefined
                  // }
                />
              </div>
            ))
          ) : (
            <div className="snap-start shrink-0 w-[306px] ">
              <Title variant="h3" className="text-[#181717]">
                Курс не найден
              </Title>
            </div>
          )}
        </HorizontalCarousel>

        {!(
          isCourseDetailsLoading ||
          isProgressLoading ||
          isCategoriesLoading
        ) ? (
          <>
            {activeCourse ? (
              <div className="mb-5">
                <Title variant="h6" className="text-[#181717] mb-2">
                  {activeCourse.name}
                </Title>

                <div className="mb-4 flex items-center gap-7">
                  <div className="flex items-center">
                    <LessonsIcon />
                    <Body variant="smMedium" className="ml-1 text-[#0049C7]">
                      {activeCourseProgress?.completedLessons}/
                      {activeCourse.lessonsQuantity} уроков
                    </Body>
                  </div>

                  {/* <div className="flex items-center">
                <PenIcon />
                <Body variant="smMedium" className="ml-1 text-[#0049C7]">
                  {testsDone}/{activeCourse.exercisesQuantity} тестов
                </Body>
              </div> */}
                  <div className="flex items-center">
                    <PenIcon />
                    <Body variant="smMedium" className="ml-1 text-[#0049C7]">
                      {activeCourseId === FIRST_COURSE_ID &&
                      testsDone === 2 &&
                      activeCourse.exercisesQuantity === 1
                        ? 1
                        : testsDone}
                      /{activeCourse.exercisesQuantity} тестов
                    </Body>
                  </div>
                </div>

                <Body variant="smRegular" className="text-light">
                  {activeCourse.description}
                </Body>
              </div>
            ) : (
              <></>
            )}
            {/* <ActiveCourseModules courseId={activeCourse?.id} /> */}
            <ActiveCourseModules
              key={activeCourse?.id}
              courseId={activeCourse?.id}
              categories={processedCategories}
              lessonsProgress={lessonsProgress}
              firstTestCompleted={firstTestCompleted}
              exerciseQuestions={exerciseQuestions}
            />
          </>
        ) : (
          <div className="flex justify-center items-center mt-10 h-64">
            <div
              className="w-12 h-12 border-4 border-[#0049C7] border-t-transparent rounded-full animate-spin"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>

      <Footer />
      {categoryForTest && (
        <BottomSheet
          headerImg={testingImg}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={`Тестирование №${categoryForTest?.exercise?.number}`}
          text1="Пришло время тестирования! Что в этом плохого? Наоборот, давай проверим, насколько хорошо ты усвоил теоретические знания."
          text2="Когда пройдёшь - сможешь двигаться дальше!"
          isTest
          onClick={startTest}
          linkText="Начать тестирование"
        />
      )}
    </>
  );
};

export default MainPage;
