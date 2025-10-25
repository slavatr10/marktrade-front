import type { Direction } from "@/types";

export const getRotation = (angle: Direction) => {
  switch (angle) {
    case "top":
      return "rotate-90";
    case "right":
      return "rotate-180";
    case "bottom":
      return "rotate-270";
    default:
      return "rotate-0";
  }
};
