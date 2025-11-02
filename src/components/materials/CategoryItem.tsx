import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BottomSheet } from '@/components';
import { MaterialsCategory, Lesson, TrackLessonWithDetails } from '@/types';
import cn from 'classnames';
import { Body, Title } from '../typography';
import ArrowDown from '@/assets/icons/ArrowDown';
import LessonsIcon from '@/assets/icons/LessonsIcon';
import PenIcon from '@/assets/icons/PenIcon';
import testingImg from '@/assets/images/testing-img.png';
import LockIcon from '@/assets/icons/LockIcon';

interface CategoryItemProps {
  category: MaterialsCategory;
  index: number;
  currentCategory: MaterialsCategory | undefined;
  expandedLesson: string | null;
  courseId: string;
  exerciseQuestions: Record<string, number>;
  lessonsProgress: Record<string, TrackLessonWithDetails[]>;
  firstTestCompleted: boolean;
  isPreviousCategoryCompleted: boolean;
  onToggleLesson: (categoryId: string) => void;
  onLessonClick: (
    lesson: Lesson,
    index: number,
    category: MaterialsCategory
  ) => void;
  showTest: boolean;
}

export const CategoryItem = React.memo(
  ({
    category,
    //index,
    currentCategory,
    expandedLesson,
    courseId,
    exerciseQuestions,
    lessonsProgress,
    isPreviousCategoryCompleted,
    onToggleLesson,
    onLessonClick,
    showTest,
  }: CategoryItemProps) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const navigate = useNavigate();

    const exerciseId = category.exerciseId || '';
    const questionCount = exerciseQuestions[exerciseId] || 0;
    const testNumber = category.exercise?.number || 0;
    const allCompletedValue =
      lessonsProgress[category.id]?.every((el) => el.completed) || false;

    const isLocked = !isPreviousCategoryCompleted;
    // const isCompleted = category.completed;
    // const isCurrent = currentCategory?.id === category.id;

    const ifLessonCompleted = (categoryId: string, lessonId: string) => {
      return lessonsProgress[categoryId]?.find(
        (cur) => cur.lessonId === lessonId
      );
    };
    const handleTestClick = () => {
      if (isLocked || category?.exerciseCompleted || !allCompletedValue) {
        return;
      }

      navigate({
        to: `/test?exercise_id=${encodeURIComponent(
          exerciseId
        )}&question=1&exercisesQuantity=${encodeURIComponent(
          questionCount
        )}&course_id=${encodeURIComponent(
          courseId
        )}&testCompleted=false&testNumber=${testNumber}&categoryId=${
          category.id
        }`,
      });
    };

    const content = (
      <>
        <button
          className={cn('flex justify-between items-center w-full text-left', {
            'font-bold': expandedLesson === category.id,
          })}
          onClick={() => onToggleLesson(category.id)}
          disabled={isLocked}
        >
          <div>
            <div className="flex flex-col mb-3">
              <div className="flex items-center">
                <Title variant="h6" className="text-[#181717] mr-3">
                  {category.name}
                </Title>
                {/* <div className="flex items-center">
                  <WatchIcon />
                  <Body variant="xsRegular" className="text-[#181717] ml-1">
                    {category?.hoursQuantity} хв.
                  </Body>
                </div> */}
              </div>
            </div>
            {/* <div className="flex mt-0.5 items-center leading-[125%] text-[var(--color-natural-300)] font-medium text-sm">
              <span className="mr-2 additional-font-medium">
                {category.lessonsQuantity} уроки |
              </span>
              <span className="additional-font-medium">1 тест</span>
            </div> */}
            <div className="flex items-center">
              <div className="flex gap-1 items-center">
                <LessonsIcon />
                <Body variant="smMedium" className="text-light">
                  {category.lessonsQuantity} уроки
                </Body>
              </div>
              {category.id !== 'ac2b5bb0-c5ce-4622-b1da-feb63fecb735' && (
                <>
                  <span className="mx-2 text-[#5B5B5B]">•</span>
                  <div className="flex gap-1 items-center">
                    <PenIcon />
                    <Body variant="smMedium" className="text-light">
                      1 тест
                    </Body>
                  </div>
                </>
              )}
            </div>
          </div>
          {!isLocked ? <ArrowDown /> : <LockIcon />}
        </button>

        {expandedLesson === category.id && (
          <div className="mt-4">
            {category.lessons.map((lesson, lessonIndex) => {
              const completed = !!ifLessonCompleted(category.id, lesson.id)
                ?.completed;
              const shouldDrawLine = !(
                category.id === 'ac2b5bb0-c5ce-4622-b1da-feb63fecb735' &&
                lessonIndex === category.lessons.length - 1
              );
              return (
                <div className="flex items-center gap-4 mb-4" key={lesson.id}>
                  <button
                    className="flex  gap-3"
                    onClick={() => {
                      onLessonClick(lesson, lessonIndex, category);
                    }}
                  >
                    <div className="relative flex w-[18px] self-stretch justify-center">
                      {completed ? (
                        <div className="mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-white">
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M9 1L3.4 7L1 4.6"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="mt-1 flex h-[18px] w-[18px] border-2 border-[#B0B3B8] rounded-full bg-white"></div>
                      )}

                      {/* <span className="absolute left-1/2 top-[22px] -translate-x-1/2 bottom-0 w-[2px] h-[100%]  bg-[#E3E8F3]" /> */}
                      {shouldDrawLine && (
                        <span className="absolute left-1/2 -translate-x-1/2 top-[22px] -bottom-4 w-[2px] bg-[#E3E8F3]" />
                      )}
                    </div>
                    <div className="">
                      <Body
                        variant="mdRegular"
                        className="text-[#181717] text-left"
                      >
                        {lesson.name}
                      </Body>
                      {/* <Body
                        variant="smRegular"
                        className="text-[#B0B3B8] text-start"
                      >
                        9:45 хв
                      </Body> */}
                    </div>
                  </button>
                </div>
              );
            })}

            {showTest && (
              <button
                className="flex items-center gap-3 w-full text-left"
                onClick={handleTestClick}
                disabled={!allCompletedValue || category.exerciseCompleted}
              >
                <div className="w-[18px] flex items-center justify-center z-0">
                  {(() => {
                    if (category.exerciseCompleted) {
                      return (
                        <div className="mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-white">
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M9 1L3.4 7L1 4.6"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      );
                    }
                    if (!allCompletedValue) {
                      return (
                        <svg
                          className="mt-1"
                          width="18"
                          height="22"
                          viewBox="0 0 18 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.15 6.1875V9.25H1.8C1.32261 9.25 0.864773 9.43437 0.527208 9.76256C0.189642 10.0908 0 10.5359 0 11L0 19.75C0 20.2141 0.189642 20.6592 0.527208 20.9874C0.864773 21.3156 1.32261 21.5 1.8 21.5H16.2C16.6774 21.5 17.1352 21.3156 17.4728 20.9874C17.8104 20.6592 18 20.2141 18 19.75V11C18 10.5359 17.8104 10.0908 17.4728 9.76256C17.1352 9.43437 16.6774 9.25 16.2 9.25H14.85V6.1875C14.85 4.67908 14.2337 3.23244 13.1366 2.16583C12.0395 1.09922 10.5515 0.5 9 0.5C7.44848 0.5 5.96051 1.09922 4.86343 2.16583C3.76634 3.23244 3.15 4.67908 3.15 6.1875ZM5.4 9.25V6.1875C5.4 5.25924 5.77928 4.369 6.45442 3.71263C7.12955 3.05625 8.04522 2.6875 9 2.6875C9.95478 2.6875 10.8705 3.05625 11.5456 3.71263C12.2207 4.369 12.6 5.25924 12.6 6.1875V9.25H5.4ZM7.2 14.0625C7.20007 13.7593 7.28114 13.4614 7.43528 13.1978C7.58943 12.9343 7.81134 12.7142 8.07929 12.5591C8.34724 12.4041 8.65204 12.3193 8.96381 12.3132C9.27557 12.3071 9.58362 12.3799 9.85777 12.5244C10.1319 12.6688 10.3628 12.8801 10.5277 13.1374C10.6926 13.3947 10.7859 13.6892 10.7985 13.9921C10.8111 14.2951 10.7426 14.596 10.5996 14.8654C10.4566 15.1348 10.244 15.3635 9.9828 15.529L9.9756 15.5334C9.9756 15.5334 10.1511 16.5659 10.3491 17.7821V17.783C10.3489 17.9567 10.2778 18.1233 10.1514 18.2462C10.025 18.369 9.85371 18.4381 9.675 18.4384H8.3232C8.14449 18.4381 7.97317 18.369 7.8468 18.2462C7.72044 18.1233 7.64934 17.9567 7.6491 17.783V17.7821L8.0226 15.5334C7.76978 15.3748 7.56186 15.1572 7.41784 14.9004C7.27383 14.6437 7.19831 14.3559 7.1982 14.0634L7.2 14.0625Z"
                            fill="#404040"
                          />
                        </svg>
                      );
                    }

                    return (
                      <div className="mt-1 flex h-[18px] w-[18px] border-2 border-[#B0B3B8] rounded-full bg-white"></div>
                    );
                  })()}
                </div>
                <Body
                  variant="mdRegular"
                  className={
                    !allCompletedValue
                      ? 'text-[#bdbdbd] mt-1 leading-none'
                      : 'text-[#181717] mt-1'
                  }
                >
                  Тестирование №{testNumber}
                </Body>
              </button>
            )}

            <BottomSheet
              headerImg={testingImg}
              isOpen={isSheetOpen}
              onClose={() => setIsSheetOpen(false)}
              title={`Тестирование №${testNumber}`}
              text1="Пришло время тестирования. 
  Что в этом плохого? Ничего! 
  Давай проверим, насколько хорошо ты закрепил теоретические знания."
              text2="Когда пройдёшь — сможешь двигаться дальше."
              isTest
              onClick={handleTestClick}
              linkText="Начать"
            />
          </div>
        )}
      </>
    );

    return (
      <div
        className={cn('relative w-full px-5 py-4 rounded-[20px]', {
          'bg-[#F4F4F4]': isLocked,

          'bg-[#FFFFFF]': !isLocked && category.completed,
          'bg-white': !isLocked && currentCategory?.id === category.id,
          // 'bg-natural-850':
          //   !isLocked &&
          //   (expandedLesson === category.id ||
          //     currentCategory?.id !== category.id),

          'cursor-not-allowed': isLocked,
        })}
        style={{ boxShadow: '0 4px 4px rgba(44,52,80,0.05)' }}
      >
        {}
        <div>{content}</div>

        {}
      </div>
    );
  }
);
