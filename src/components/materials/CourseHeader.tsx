import { Badge, IntroductionHeader } from '@/components';
import { Course, Progress } from '@/types';
import { StarIcon, WatchIcon, BooksIcon, TestsIcon } from '@/assets/icons';
import authorImage from '@/assets/images/author.webp';
import rectangleBg from '@/assets/images/rectangle.webp';

interface CourseHeaderProps {
  course: Course | null;
  courseProgress: Progress | null;
  totalCompletedExercises: number;
}

export const CourseHeader = ({
  course,
  courseProgress,
  totalCompletedExercises,
}: CourseHeaderProps) => {
  if (!course) return null;
  return (
    <div className="min-w-screen p-4 bg-[radial-gradient(ellipse_140%_80%_at_left_bottom,rgba(34,197,94,0.3)_0%,#171717_85%)] pt-[calc(6rem+var(--safe-top))] ">
      <IntroductionHeader type="text" title="Про курс" />

      <div
        className="bg-no-repeat  bg-origin-border"
        style={{
          backgroundImage: `url(${rectangleBg})`,
          backgroundPosition: '159px -14px',
        }}
      >
        <div className="flex items-center mb-4">
          <Badge value={course.rate || 0} icon={<StarIcon />} />
          <Badge
            type="time"
            value={course.hoursQuantity || 0}
            icon={<WatchIcon />}
          />
        </div>

        <h4 className="font-bold leading-[115%] text-white text-heading">
          {course.name}
        </h4>
        <div className="flex items-center mt-2 text-green-400 gap-8">
          <div className="flex items-center gap-2">
            <BooksIcon />
            <span className="additional-font-regular">
              <span className="mr-5 additional-font-regular">Уроки</span>{' '}
              {courseProgress?.completedLessons}/{course.lessonsQuantity}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TestsIcon />
            <span className="additional-font-regular">
              <span className="mr-5 additional-font-regular">Тести</span>{' '}
              {totalCompletedExercises}/{course.exercisesQuantity}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[var(--color-natural-50)] additional-font-regular">
          {course.description}
        </p>
      </div>

      <div className="flex items-center mt-2">
        <img src={authorImage} alt="avatar" className="size-10 mr-3" />
        <p className="flex flex-col">
          <span className="text-[12px]  text-[var(--color-natural-200)] additional-font-medium text-neutral-200">
            Автор курсу
          </span>
          <span className="font-bold  text-white text-name">
            {course.mentor}
          </span>
        </p>
      </div>
    </div>
  );
};
