import type { Direction } from "@/types";
import { getRotation } from "@/utils";
import cn from "classnames";

interface ArrowLeftProps {
  svgColor?: string;
  direction?: Direction;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const ArrowLeft = ({
  svgColor = "white",
  direction = "left",
  className,
  width = 13,
  height = 13,
}: ArrowLeftProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(getRotation(direction), className)}
    >
      <path
        d="M6.96986 14.7802L0.219864 8.0302C0.150131 7.96055 0.0948101 7.87783 0.0570675 7.78678C0.0193249 7.69573 -0.000101422 7.59814 -0.000101417 7.49958C-0.000101413 7.40102 0.0193249 7.30342 0.0570676 7.21237C0.0948102 7.12132 0.150131 7.03861 0.219864 6.96895L6.96986 0.218952C7.11059 0.0782218 7.30147 -0.000839701 7.50049 -0.000839692C7.69951 -0.000839684 7.89038 0.0782218 8.03111 0.218952C8.17184 0.359683 8.25091 0.550554 8.25091 0.749577C8.25091 0.9486 8.17184 1.13947 8.03111 1.2802L2.5608 6.74958L17.2505 6.74958C17.4494 6.74958 17.6402 6.8286 17.7808 6.96925C17.9215 7.1099 18.0005 7.30067 18.0005 7.49958C18.0005 7.69849 17.9215 7.88926 17.7808 8.02991C17.6402 8.17056 17.4494 8.24958 17.2505 8.24958L2.5608 8.24958L8.03111 13.719C8.17184 13.8597 8.25091 14.0506 8.25091 14.2496C8.25091 14.4486 8.17184 14.6395 8.03111 14.7802C7.89038 14.9209 7.69951 15 7.50049 15C7.30146 15 7.11059 14.9209 6.96986 14.7802Z"
        fill={svgColor}
      />
    </svg>
  );
};

export default ArrowLeft;
