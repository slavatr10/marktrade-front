import binaryTradingImg from '@/assets/images/binary-trading-img.png';
import LockIcon from '@/assets/icons/LockIcon';
import { Body, Title } from '../typography';

interface MaterialBlockProps {
  title: string;
  lessons: number;
  time: number;
  rating: number;
  completedLessons: number;
  blocked: boolean;

  onClick?: () => void;
}

export const MaterialBlock: React.FC<MaterialBlockProps> = ({
  title,
  lessons,
  completedLessons = 0,
  blocked,

  onClick,
}) => {
  const total = Math.max(lessons, 1);
  const percent = Math.round((completedLessons / total) * 100);

  const content = (
    <>
      <div className="flex justify-between items-center mb-5 h-[4rem]">
        <div className="min-w-0 flex flex-col">
          <Title
            variant="h2" // h5
            title={title}
            // className="text-[#181717] truncate whitespace-nowrap overflow-hidden"
            className="text-[#181717]"
          >
            {title}
          </Title>

          {/* <div className="flex items-center">
            <Badge type="time" value={time} icon={<WatchIcon />} />
          </div> */}
        </div>

        <img className="w-[65px] h-[65px]" src={binaryTradingImg} alt="" />
      </div>

      <div className="flex items-center">
        <div className="h-1 w-full rounded-full bg-[#E6EEFF] overflow-hidden mr-2">
          <div
            className="h-full rounded-full bg-[#005EFF] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className=" flex justify-end">
          <Body variant="smRegular" className="text-[#0049C7]">
            {percent}%
          </Body>
        </div>
      </div>
    </>
  );

  return blocked ? (
    <div className="relative p-4 rounded-[20px] border border-[#DFE2E6] bg-[#F4F4F4]">
      <div className="pointer-events-none relative z-10 opacity-60">
        {content}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LockIcon />
      </div>
    </div>
  ) : (
    <div
      onClick={onClick}
      className="block relative p-4 rounded-3xl bg-white bg-no-repeat bg-contain transition-transform duration-300 border-[2px] border-[#DFE2E6]"
    >
      {content}
    </div>
  );
};
