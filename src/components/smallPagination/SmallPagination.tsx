import cn from "classnames";

interface SmallPaginationProps {
  activeFirst: boolean;
  activeSecond: boolean;
  activeThird: boolean;
}

export const SmallPagination: React.FC<SmallPaginationProps> = ({
  activeFirst,
  activeSecond,
  activeThird,
}) => {
  const baseDotClass = "block h-[6px] rounded-[4px]";
  const activeClass = "w-10 bg-white";
  const inactiveClass = "w-[20px] bg-[rgba(255,255,255,0.2)]";

  return (
    <div className="flex flex-row items-center gap-1">
      <span
        className={cn(
          baseDotClass,
          (activeThird ? activeFirst : activeFirst)
            ? activeClass
            : inactiveClass
        )}
      />
      <span
        className={cn(
          baseDotClass,
          (activeThird ? activeSecond : activeSecond)
            ? activeClass
            : inactiveClass
        )}
      />
      <span
        className={cn(
          baseDotClass,
          (activeThird ? activeThird : activeThird)
            ? activeClass
            : inactiveClass
        )}
      />
    </div>
  );
};
