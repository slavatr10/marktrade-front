import React from "react";

interface CheckboxProps {
  checked: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  className = "",
}) => {
  return (
    <div
      className={`relative flex items-center justify-center size-6 rounded border bg-transparent ${
        checked
          ? "border-green-500"
          : "border-natural-700"
      } ${className}`}
    >
      {checked && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.6667 3.5L5.25 9.91667L2.33333 7"
            stroke="#03FE67"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};
