import { useEffect, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import {
  submitCategoryProgress,
  submitExercisesProgress,
} from '@/api/progress';
import { getExerciseById, submitAnswer } from '@/api/exercise';
import { useLoaderStore } from '@/store';
import {
  Answer,
  BottomSheet,
  Button,
  GlobalLoader,
  IntroductionHeader,
  SuccessPage,
} from '@/components';
import { Answer as AnswerType, Question } from '@/types';
import axios from 'axios';
import { getCategoryByCourseId } from '@/api/category';
import bgImage from '@/assets/images/main-bg.png';
import { Body, Title } from '@/components/typography';
import explanationImg from '@/assets/images/explanation.png';

type AnswerStatus = 'correct' | 'incorrect';

const TestPage = () => {
  const { loading, startLoading, stopLoading } = useLoaderStore();

  const search = useSearch({ from: '/test' });
  const courseId = search.course_id;
  const exerciseId = search.exercise_id;
  //const questionNumber = search.question;
  const questionNumber = parseInt(search.question, 10) || 1;
  //const exercisesQuantity = search.exercisesQuantity;
  const [exercisesQuantity, setExercisesQuantity] = useState(0);
  const testNumber = search.testNumber;
  const categoryId = search.categoryId;
  // const userId = localStorage.getItem("user_id");
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState<AnswerType | null>(
    null
  );
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [classCheck, setClassCheck] = useState<string>('');
  const [exercise, setExercise] = useState<Question[]>([]);
  const [countQuestion, setCountQuestion] = useState<number>(0);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
  const [nextSuccessLink, setNextSuccessLink] = useState<string>(
    `/materials?id=${courseId}&openCategory=${categoryId}`
  );
  console.log(nextSuccessLink);
  const [answerStatuses, setAnswerStatuses] = useState<{
    [key: number]: AnswerStatus;
  }>({});

  const submit = async (question_id: string, answer: string) =>
    await submitAnswer(question_id, { value: answer } as AnswerType);
  const correctAnswserIndex = answers.findIndex((ans) => ans.isCorrect);

  const letterPrefix =
    correctAnswserIndex !== -1
      ? `${String.fromCharCode(65 + correctAnswserIndex)}.`
      : '';

  useEffect(() => {
    if (!exerciseId) return;

    const fetchData = async () => {
      startLoading();
      try {
        const exerciseData = await getExerciseById(exerciseId);
        const questions = exerciseData?.questions || [];

        setExercise(questions);
        setExercisesQuantity(questions.length);
      } catch (error) {
        console.error('Помилка завантаження даних тесту:', error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [exerciseId, startLoading, stopLoading]); // Залежність тільки від ID тесту

  // ✅ Ефект №2: для оновлення стану ПИТАННЯ, коли змінюється номер або завантажуються дані
  useEffect(() => {
    // Скидаємо відповіді для нового питання
    setSelectedAnswer(null);
    setConfirmedAnswer(null);
    setClassCheck('');
    setIsAnswerConfirmed(false);

    // Встановлюємо нові варіанти відповідей, якщо дані вже завантажені
    if (exercise.length > 0 && questionNumber <= exercise.length) {
      setAnswers(exercise[questionNumber - 1]?.answers || []);
    }
    // ✅ Цей ефект тепер залежить і від `questionNumber`, і від `exercise`
  }, [questionNumber, exercise]);

  useEffect(() => {
    console.log('--- СТОРІНКА ТЕСТУ ЗАВАНТАЖЕНА ---');
    console.log('Отримані параметри з URL:', {
      courseId,
      exerciseId,
      questionNumber,
      exercisesQuantity,
      testNumber,
      categoryId,
    });
  }, [search]);

  // const handleConfirmAnswer = () => {
  //   if (!selectedAnswer) return;

  //   setConfirmedAnswer(selectedAnswer);
  //   setCountQuestion((prev) => {
  //     if (selectedAnswer.isCorrect) {
  //       return prev + 1;
  //     }
  //     return prev;
  //   });
  //   setClassCheck(selectedAnswer.isCorrect ? 'right' : 'wrong');
  //   setIsAnswerConfirmed(true);
  // };
  const handleConfirmAnswer = () => {
    if (!selectedAnswer) return;

    setConfirmedAnswer(selectedAnswer);
    setCountQuestion((prev) => {
      if (selectedAnswer.isCorrect) {
        return prev + 1;
      }
      return prev;
    });
    setClassCheck(selectedAnswer.isCorrect ? 'right' : 'wrong');
    setIsAnswerConfirmed(true);

    // 2. ОНОВЛЮЄМО СТАН РЕЗУЛЬТАТІВ ПІСЛЯ ВІДПОВІДІ
    setAnswerStatuses((prevStatuses) => ({
      ...prevStatuses,
      [questionNumber]: selectedAnswer.isCorrect ? 'correct' : 'incorrect',
    }));
  };

  useEffect(() => {
    if (questionNumber > exercisesQuantity) {
      const submitProgress = async () => {
        await submitCategoryProgress(categoryId, 100, true);
        await submitExercisesProgress(exerciseId, true); // Додати цю строку
      };
      submitProgress();
    }
  }, [questionNumber]);

  useEffect(() => {
    if (questionNumber > exercisesQuantity) {
      const goToNext = async () => {
        try {
          const categories = await getCategoryByCourseId(courseId);
          let nextLink = `/materials?id=${courseId}`;
          if (categories) {
            const currentCategory = categories.find(
              (cat: any) => cat.id === categoryId
            );
            if (currentCategory) {
              const nextCategory = categories.find(
                (cat: any) => cat.order === currentCategory.order + 1
              );
              if (nextCategory) {
                nextLink = `/materials?id=${courseId}&openCategory=${nextCategory.id}`;
              } else {
                const { data: courses } = await axios.get(
                  'https://miniappback.onrender.com/api/courses'
                );
                const currentCourse = courses.find(
                  (c: any) => c.id === courseId
                );
                if (currentCourse) {
                  const nextCourse = courses.find(
                    (c: any) =>
                      c.course_order === currentCourse.course_order + 1
                  );
                  if (nextCourse) {
                    nextLink = `/materials?id=${nextCourse.id}`;
                  }
                }
              }
            }
          }
          setNextSuccessLink(nextLink);
        } catch (e) {
          setNextSuccessLink(`/materials?id=${courseId}`);
        }
      };
      goToNext();
    }
  }, [questionNumber]);

  console.log(answers.find((el) => el.isCorrect));
  if (loading) {
    return <GlobalLoader />;
  }

  if (!loading && exercisesQuantity > 0 && questionNumber > exercisesQuantity) {
    return (
      <SuccessPage
        text="Тест завершён!"
        rightAnswers={countQuestion}
        questions={exercisesQuantity}
        linkUrl={'/'}
        linkText="Продолжить"
        isRegistration={false}
        exerciseId={exerciseId}
        courseId={courseId}
        categoryId={categoryId}
        testNumber={testNumber}
      />
    );
  }

  return (
    <>
      <div
        className="flex flex-col w-full h-screen bg-black text-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex-1 overflow-y-auto p-4 pt-[calc(5.1rem+var(--safe-top))]">
          <IntroductionHeader
            type="text"
            title={`Урок №${testNumber}`}
            categoryId={categoryId}
            testsLabel={`Вопрос ${questionNumber}/${exercisesQuantity}`}
          />

          <div className="flex items-center gap-2 overflow-x-auto mb-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden carousel-gutter -mx-4">
            {Array.from({ length: exercisesQuantity }, (_, i) => {
              const num = i + 1;
              const status = answerStatuses[num];
              const isActive = num === questionNumber;

              let statusClass = '';
              if (isActive) {
                statusClass = 'bg-[#E3E8F3] text-[#181717]  border-[#181717]';
              } else if (status === 'correct') {
                statusClass = 'bg-[#D5F5E3] text-[#2ECC71] border-[#2ECC71]';
              } else if (status === 'incorrect') {
                statusClass = 'bg-[#FADBD8] text-[#E74C3C] border-[#E74C3C]';
              } else {
                statusClass = 'bg-[#CCCCCC] border-none text-[#181717]';
              }

              const itemClass = `flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-[6px] border border-[1px]  transition-colors duration-300 ${statusClass}`;

              return (
                <div key={num} className={itemClass}>
                  <Title variant="h7">{num}</Title>
                </div>
              );
            })}
          </div>

          <div
            className="w-full bg-white rounded-2xl mb-7 p-4"
            style={{ boxShadow: '0 4px 4px rgba(44,52,80,0.05)' }}
          >
            <Body variant="lgRegular" className="text-left text-[#181717]">
              {exercise[questionNumber - 1]?.value}
            </Body>
            {exercise[questionNumber - 1]?.photo && (
              <img
                src={exercise[questionNumber - 1]?.photo}
                alt="Изображение к вопросу"
                className="flex w-full rounded-3xl mt-3"
              />
            )}
          </div>

          <div className="flex flex-col gap-4 mt-2 mb-8 items-center">
            {answers.map((answerElement, index) => (
              <Answer
                className={confirmedAnswer === answerElement ? classCheck : ''}
                index={index}
                key={index}
                answer={answerElement}
                setAnswer={setSelectedAnswer}
                selectedAnswer={selectedAnswer}
                rightAnswer={
                  isAnswerConfirmed
                    ? answers.find((el) => el.isCorrect) || null
                    : null
                }
                disabled={isAnswerConfirmed}
                isConfirmed={isAnswerConfirmed}
              />
            ))}
          </div>

          {isAnswerConfirmed && (
            <div className="pb-4">
              {selectedAnswer?.isCorrect ? (
                <Title variant="h8" className="text-[#2ECC71] mb-2">
                  Ваш ответ правильный!
                </Title>
              ) : (
                <Title variant="h8" className="text-[#E74C3C] mb-2">
                  Ваш ответ неправильный!
                </Title>
              )}

              <div className="flex flex-row justify-center items-center text-left">
                <Body variant="smMedium" className="text-light mr-2">
                  Правильный ответ:{' '}
                  <strong>
                    {' '}
                    {letterPrefix} {answers.find((ans) => ans.isCorrect)?.value}
                  </strong>
                </Body>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white w-full p-4 pb-[calc(2rem+var(--safe-bottom))]">
          {!isAnswerConfirmed ? (
            <button
              className={`flex justify-center rounded-full w-full p-3 ${
                selectedAnswer
                  ? 'text-white bg-cerulean-800'
                  : 'text-white bg-[#CCCCCC] cursor-not-allowed'
              }`}
              onClick={handleConfirmAnswer}
              disabled={!selectedAnswer}
            >
              <Title variant="h6">Подтвердить ответ</Title>
            </button>
          ) : (
            <>
              <Link
                to={`/test?exercise_id=${exerciseId}&question=${
                  questionNumber + 1
                }&course_id=${courseId}&testNumber=${testNumber}&exercisesQuantity=${exercisesQuantity}&categoryId=${categoryId}&deposit=${
                  Number(testNumber) === 1 &&
                  questionNumber === exercisesQuantity
                    ? 'deposit'
                    : ''
                }`}
                className="flex justify-center rounded-full w-full text-white bg-cerulean-800 p-3 mb-3"
                onClick={async (e) => {
                  if (confirmedAnswer) {
                    await submit(
                      exercise[questionNumber - 1]?.id,
                      confirmedAnswer?.value
                    );
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                <Title variant="h6">
                  {questionNumber === exercisesQuantity
                    ? 'Завершить'
                    : 'Продолжить'}
                </Title>
              </Link>
              <Button
                title="Объяснение"
                onClick={() => setIsExplanationOpen(true)}
                className="w-full m-0"
                styledClassName="!text-[#181717]"
              />
            </>
          )}
        </div>
      </div>
      <BottomSheet
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        title="Объяснение"
        text1={answers.find((el) => el.isCorrect)?.explanation}
        href="https://t.me/SashaPT_CEO"
        linkText="Закрыть"
        headerImg={explanationImg}
      />
    </>
  );
};

export default TestPage;
