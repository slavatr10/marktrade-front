import React, { useEffect, useState } from 'react';
import { Link, useSearch, useNavigate } from '@tanstack/react-router';
import {
  VideoPlayer,
  GlobalLoader,
  IntroductionHeader,
  MethodichkaButton,
} from '@/components';
import { useLoaderStore } from '@/store';
import { getCategoryById } from '@/api/category';
import { getCategoryLessons, setProgressLesson } from '@/api/progress';
import { useSendPulseTag } from '@/hooks/useSendPulse';
import { invalidateProgress } from '@/libs/QueryClient';
import { TrackLessonWithDetails, Category, Lesson } from '@/types';
import { Footer } from '@/components/footer/Footer';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';
import handsIcon from '@/assets/images/hands-icon.png';
import upperIcon from '@/assets/images/upper-icon.png';
import hummerIcon from '@/assets/images/hummer-icon.png';

const FIRST_MODULE_ID = 'ac2b5bb0-c5ce-4622-b1da-feb63fecb735';
const LessonPage: React.FC = () => {
  const { loading, startLoading, stopLoading } = useLoaderStore();
  const navigate = useNavigate();
  const { sendTag, isLoading: isSendingTag } = useSendPulseTag();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const search = useSearch({ from: '/lesson' });
  const lessonId = search.id;
  const lessonNumber = parseInt(search.lessonNumber || '1', 10);
  const courseId = search.course_id;
  const categoryId = search.category_id;
  const exerciseId = search.exercise_id;
  const questionCount = search.exercisesQuantity;
  const testNumber = search.testNumber;

  const [allLessons, setAllLessons] = useState<TrackLessonWithDetails[]>([]);
  const [currentLesson, setCurrentLesson] =
    useState<TrackLessonWithDetails | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);
  const [lessonPoints, setLessonPoints] = useState<string[]>([]);

  useEffect(() => {
    if (!categoryId || !lessonId) return;
    const fetchData = async () => {
      setLoadingProgress(0);
      startLoading();
      try {
        setLoadingProgress(30);
        const categoryData: Category | undefined = await getCategoryById(
          categoryId
        );
        setLoadingProgress(60);
        if (!categoryData || !categoryData.lessons)
          throw new Error('Could not load category data.');
        setCategoryDetails(categoryData);
        const staticLessons = categoryData.lessons.sort(
          (a, b) => a.order - b.order
        );
        const progressData: TrackLessonWithDetails[] =
          (await getCategoryLessons(categoryId)) || [];
          setLoadingProgress(90);
        const mergedLessons = staticLessons.map((lesson: Lesson) => {
          const progressInfo = progressData.find(
            (p) => p.lessonId === lesson.id
          );
          return {
            lessonId: lesson.id,
            completed: progressInfo?.completed ?? false,
            lesson: lesson,
            id: progressInfo?.id || '',
            userId: progressInfo?.userId || '',
          } as TrackLessonWithDetails;
        });
        setAllLessons(mergedLessons);
        const foundLesson = mergedLessons.find((l) => l.lessonId === lessonId);
        if (foundLesson) {
          setCurrentLesson(foundLesson);
          setCompleted(foundLesson.completed);
          setLoadingProgress(100);
          await new Promise(resolve => setTimeout(resolve, 300));
        } else {
          setLoadingProgress(100);
          await new Promise(resolve => setTimeout(resolve, 300));
          navigate({ to: `/materials?id=${courseId}` });
        }
      } catch (error) {
        console.error('Error loading lesson data:', error);
        setLoadingProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, [categoryId, lessonId, courseId, navigate, startLoading, stopLoading]);

  useEffect(() => {
    if (currentLesson?.lesson?.description) {
      const points = currentLesson.lesson.description
        .split('.')
        .map((point) => point.trim())
        .filter((point) => point.length > 0);
      setLessonPoints(points);
    }
  }, [currentLesson]);

  const handleCheckboxChange = async () => {
    // Якщо урок вже пройдено або запит SendPulse ще виконується, нічого не робимо
    if (completed || !currentLesson || isSendingTag) return;

    // Оптимістично оновлюємо UI
    setCompleted(true);
    setCurrentLesson((prev) => (prev ? { ...prev, completed: true } : null));

    try {
      // Відправляємо прогрес на свій бекенд
      await setProgressLesson(currentLesson.lessonId, true);

      const contactId = localStorage.getItem('contact_id');
      const storedClickId = localStorage.getItem('click_id'); // Отримуємо click_id
      const lessonOrder = currentLesson.lesson.order; // Отримуємо номер уроку

      // -------------------------------------------------------------
      // ВІДПРАВКА ТЕГУ В SENDPULSE (ІСНУЮЧИЙ КОД - БЕЗ ЗМІН)
      // -------------------------------------------------------------
      if (contactId) {
        await sendTag(contactId, [`lesson${lessonOrder}`]);
        console.log(
          `SendPulse тег 'lesson${lessonOrder}' відправлено успішно.`
        );
      }

      // -------------------------------------------------------------
      // НОВИЙ КОД: ВІДПРАВКА ЗАПИТУ НА CHATTERFY (ТІЛЬКИ ДЛЯ УРОКІВ 1-5)
      // -------------------------------------------------------------
      // Перевіряємо, чи номер уроку знаходиться в діапазоні 1-5
      if (storedClickId && lessonOrder >= 1 && lessonOrder <= 5) {
        const chatterfyEvent = `lesson${lessonOrder}`; // Формуємо назву події (lesson1, lesson2, ...)
        const postbackUrl = `https://api.chatterfy.ai/api/postbacks/8dd8f7ba-3f29-4da8-9db4-3f04bf067c5e/tracker-postback?tracker.event=${chatterfyEvent}&clickid=${storedClickId}`;
        try {
          await fetch(postbackUrl, {
            method: 'GET',
            mode: 'no-cors', // Важливо для крос-доменних запитів, де відповідь не потрібна
          });
          console.log(
            `Chatterfy '${chatterfyEvent}' postback відправлено успішно.`
          );
        } catch (postbackError) {
          console.error(
            `Помилка при відправці Chatterfy '${chatterfyEvent}' postback:`,
            postbackError
          );
        }
      } else {
        if (!storedClickId) {
          console.warn(
            'Click ID не знайдено в localStorage. Chatterfy postback не відправлено.'
          );
        } else if (!(lessonOrder >= 1 && lessonOrder <= 5)) {
          console.log(
            `Урок ${lessonOrder} не в діапазоні 1-5. Chatterfy postback не відправлено.`
          );
        }
      }
      // -------------------------------------------------------------

      invalidateProgress(); // Інвалідація кешу прогресу
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      // Якщо сталася помилка, відкочуємо UI
      setCompleted(false);
      setCurrentLesson((prev) => (prev ? { ...prev, completed: false } : null));
    }
  };

  // if (loading || !currentLesson) {
  //   return <GlobalLoader />;
  // }
  if (loadingProgress < 100 || (!loading && !currentLesson)) { 
    return <GlobalLoader progress={loadingProgress} />;
  }

  const currentIndex = allLessons.findIndex(
    (l) => l.lessonId === currentLesson?.lessonId
  );
  const nextLesson = allLessons[currentIndex + 1];
  const isLastLesson = !nextLesson;
  const isFirstModule = categoryId === FIRST_MODULE_ID;

  const nextLessonUrl = nextLesson
    ? `/lesson?id=${nextLesson.lessonId}&lessonNumber=${
        lessonNumber + 1
      }&course_id=${courseId}&category_id=${categoryId}&exercise_id=${exerciseId}&exercisesQuantity=${questionCount}&testNumber=${testNumber}`
    : '#';

  // const testUrl = `/test?exercise_id=${encodeURIComponent(
  //   exerciseId
  // )}&question=1&exercisesQuantity=${encodeURIComponent(
  //   questionCount
  // )}&course_id=${encodeURIComponent(
  //   courseId
  // )}&testNumber=${testNumber}&categoryId=${categoryId}`;

  const moduleLabel = categoryDetails
    ? `Блок ${String(categoryDetails.order).padStart(2, '0')}`
    : '';

  return (
    <>
      <div
        className="bg-natural-950 min-h-screen rounded p-4 pb-32 pt-[calc(9rem+var(--safe-top))]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <IntroductionHeader
          type="text"
          title={`Урок №${lessonNumber}`}
          categoryId={categoryId}
          moduleLabel={moduleLabel}
        />
        <Title variant="h1" className="text-[#181717] text-center mb-6">
          {currentLesson?.lesson.name}
        </Title>
        <div className="mb-8">
          {currentLesson?.lesson?.video && (
            <VideoPlayer
              thumbnail={currentLesson.lesson.thumbnail}
              src={currentLesson.lesson.video}
              onFirstPlay={handleCheckboxChange}
            />
          )}
        </div>
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <img src={handsIcon} className="w-10 h-10"></img>
            <Body variant="mdRegular" className="text-light">
              {lessonPoints[0]}
            </Body>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <img src={upperIcon} className="size-10 shrink-0 object-contain"></img>
            <Body variant="mdRegular" className="text-light">
              {lessonPoints[1]}
            </Body>
          </div>
          <div className="flex items-center gap-2">
            <img src={hummerIcon} className="w-10 h-10"></img>
            <Body variant="mdRegular" className="text-light">
              {lessonPoints[2]}
            </Body>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between">
          {/* <label className="flex cursor-pointer items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={completed}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-sm border-2 ${
                  completed ? 'border-green-200' : 'border-gray-400'
                }`}
              >
                {completed && <CheckmarkIcon svgColor="#7FE2A1" />}
              </div>
            </div>
            <span className="ml-2 text-sm text-green-400">Урок пройдено</span>
          </label> */}

          {}
          {isLastLesson ? (
            // <Link
            //   // to={testUrl}
            //   // to={`/?openTestFor=${categoryId}`}
            //   to={`/?courseId=${courseId}&openTestFor=${categoryId}`}
            //   className={`flex w-full text-center rounded-[44px] ${
            //     completed
            //       ? 'bg-cerulean-800'
            //       : 'cursor-not-allowed bg-[#CCCCCC]'
            //   }`}
            //   onClick={(e) => {
            //     if (!completed) e.preventDefault();
            //   }}
            // >
            //   <div className="w-full py-3">
            //     <Title variant="h6" className="text-white">
            //       Продолжить
            //     </Title>
            //     {/* <ArrowLeft svgColor="black" direction="right" /> */}
            //   </div>
            // </Link>
            <Link
              to={
                isFirstModule
                  ? `/?courseId=${courseId}`
                  : `/?courseId=${courseId}&openTestFor=${categoryId}`
              }
              className={`flex w-full text-center rounded-[44px] ${
                completed
                  ? 'bg-cerulean-800'
                  : 'cursor-not-allowed bg-[#CCCCCC]'
              }`}
              onClick={(e) => {
                if (!completed) e.preventDefault();
              }}
            >
              <div className="w-full py-3">
                <Title variant="h6" className="text-white">
                  Следующий урок
                </Title>
              </div>
            </Link>
          ) : (
            <Link
              to={nextLessonUrl}
              className={`flex w-full text-center rounded-[44px] ${
                completed
                  ? 'bg-cerulean-800'
                  : 'cursor-not-allowed bg-[#CCCCCC]'
              }`}
              onClick={(e) => {
                if (!completed) e.preventDefault();
              }}
            >
              <div className="w-full py-3">
                <Title variant="h6" className="text-white">
                  Следующий урок
                </Title>
                {/* <ArrowLeft svgColor="black" direction="right" /> */}
              </div>
            </Link>
          )}
        </div>
        {currentLesson?.lesson.methodology && (
          <MethodichkaButton href={currentLesson.lesson.methodology} />
        )}
      </div>
      <Footer />
    </>
  );
};

export default LessonPage;
