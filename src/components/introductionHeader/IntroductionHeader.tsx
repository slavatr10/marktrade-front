import { ArrowLeft } from '@/assets/icons';
import { SmallPagination } from '@/components';
import cn from 'classnames';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { ROUTES } from '@/constants';
import { Title } from '../typography';

interface IntroductionHeaderProps {
  type?: 'pagination' | 'text';
  title?: string;
  isFirstPage?: boolean;
  isSecondPage?: boolean;
  isThirdPage?: boolean;
  categoryId?: string;
  testsLabel?: string;
  moduleLabel?: string;
}

export const IntroductionHeader = ({
  isFirstPage = false,
  isSecondPage = false,
  isThirdPage = false,
  type = 'pagination',
  title,
  testsLabel,
  moduleLabel,
}: IntroductionHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseIdDeposit = searchParams.get('courseId');

  const handleBackClick = () => {
    const { pathname } = location;

    if (pathname.startsWith('/welcome-second')) {
      navigate({ to: '/welcome-first' });
      return;
    } else if (pathname.startsWith('/registration')) {
      navigate({ to: '/welcome-second' });
      return;
    } else if (pathname.startsWith('/deposit')) {
      navigate({
        to: `/materials?id=${courseIdDeposit}`,
        replace: true,
      });
      return;
    }

    // if (pathname.startsWith('/lesson') || pathname.startsWith('/test')) {
    //   if (courseId) {
    //     const materialsUrl = categoryId
    //       ? `/materials?id=${courseId}&openCategory=${categoryId}`
    //       : `/materials?id=${courseId}`;
    //     navigate({ to: materialsUrl });
    //   } else {
    //     navigate({ to: ROUTES.HOME });
    //   }
    //   return;
    // }

    if (
      pathname.startsWith('/materials') ||
      pathname.startsWith('/deposit') ||
      //add here 2 lines
      pathname.startsWith('/lesson') ||
      pathname.startsWith('/test')
    ) {
      navigate({ to: ROUTES.HOME });
      return;
    }

    navigate({ to: '..' });
  };

  return (
    <div className={cn('flex w-full flex-row mb-[42px]')}>
      <div className="flex w-full justify-between items-center gap-2 ">
        <button
          onClick={handleBackClick}
          className={cn({
            invisible: isFirstPage,
          })}
        >
          <ArrowLeft svgColor="black" />
        </button>
        <div>
          {type === 'pagination' ? (
            <SmallPagination
              activeFirst={isFirstPage}
              activeSecond={isSecondPage}
              activeThird={isThirdPage}
            />
          ) : (
            <div className="flex items-center gap-2 ">
              <Title variant="h3" className="text-[#181717] leading-none">
                {title}
              </Title>

              <span className=" text-[#181717] border-[1.5px] h-3 "></span>
              {testsLabel ? (
                <Title variant="h4" className="text-light leading-none">
                  {testsLabel}
                </Title>
              ) : (
                <Title variant="h4" className="text-light leading-none">
                  {moduleLabel}
                </Title>
              )}
            </div>
          )}
        </div>
        {/* <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className={cn(
            'size-10 flex justify-center items-center rounded-full cursor-pointer border border-natural-0 bg-natural-0 hover:bg-natural-100 transition-colors duration-300',
            {
              invisible:
                isThirdPage || isFirstPage || isSecondPage || type === 'text',
            }
          )}
        >
          <TelegramIcon />
        </button> */}
        <div className="w-[18px]"></div>
      </div>
      {/* <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="ЗВʼЯЗОК З САШОЮ"
        text1="Якщо у вас виникли питання або щось незрозуміло - напишіть мені у приватні повідомлення 🚀"
        href="https://t.me/SashaPT_CEO"
        linkText="НАПИСАТИ САШІ"
      /> */}
    </div>
  );
};
