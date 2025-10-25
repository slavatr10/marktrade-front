import {
  BottomSheet,
  GlobalLoader,
  MaterialBlock,
  SuccessPage,
} from '@/components';
import React, { useEffect, useState } from 'react';
import { useLoaderStore } from '@/store';
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

const FIRST_COURSE_ID = '8bc653d6-30fe-4f2a-b636-285a882c744d';

const CardItem: React.FC<React.ComponentProps<typeof MaterialBlock>> = (
  props
) => (
  <div className="snap-start shrink-0 w-[306px] mb-11">
    <MaterialBlock {...props} />
  </div>
);

const MainPage: React.FC = () => {
  useTelegramAuth();
  const { status, resetNoAccess, isTelegramAuthLoading } = useTelegramAuth();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);

  const search = useSearch({ from: '/' });
  const categoryIdToOpenTest = search.openTestFor;
  const courseIdToActivate = search.courseId;
  const { loading } = useLoaderStore();
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
  const { data: activeCourseData, isLoading: isCourseDetailsLoading } =
    useCourse(activeCourseId);
  const { data: activeCourseProgress, isLoading: isProgressLoading, refetch: refetchProgress } =
    useCourseProgress(activeCourseId);

  const [testsDone, setTestsDone] = useState(0);

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

  // if (loading || isDataLoading || isTelegramAuthLoading) {
  //   return <GlobalLoader />;
  // }

  if (
    loading ||
    isDataLoading || 
    isTelegramAuthLoading ||
    (activeCourseId && (isCourseDetailsLoading || isProgressLoading))
  ) {
    return <GlobalLoader />;
  }

  if (!activeCourse) {
    return <GlobalLoader />;
  }

  if (status === 'no-access') {
    return (
      <SuccessPage
        type="noAccess"
        text="У Вас нету доступа"
        linkUrl="https://t.me/SashaPT_CEO"
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

        <HorizontalCarousel className="mt-2">
          {Array.isArray(processedCourses) && processedCourses.length > 0 ? (
            processedCourses.map((course, index) => (
              <div>
                <CardItem
                  key={course.id}
                  blocked={course.isBlocked}
                  title={course.name}
                  lessons={course.lessonsQuantity}
                  time={course.hoursQuantity}
                  rating={course.rate}
                  completedLessons={course.completedLessons || 0}
                  onClick={
                    !course.isBlocked ? () => setActiveIdx(index) : undefined
                  }
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

        {activeCourse.description ? (
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

        <ActiveCourseModules courseId={activeCourse?.id} />
      </div>

      <Footer />
      {categoryForTest && (
        <BottomSheet
          headerImg={testingImg}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={`Тестирование №${categoryForTest?.exercise?.number}`}
          text1="Пришло время тестирования! Что в этом плохого? Наоборот, давай проверим, насколько хорошо ты усвоил теоретические знания."
          text2="Когда пройдёшь — сможешь двигаться дальше!"
          isTest
          onClick={startTest}
          linkText="Начать тестирование"
        />
      )}
    </>
  );
};

export default MainPage;
