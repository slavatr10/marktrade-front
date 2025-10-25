import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/api/course";
import { CourseWithProgress } from "@/types";
import { CACHE_TIME, STALE_TIME } from "@/constants/query";

interface UseMainDataReturn {
  isLoading: boolean;
  error: Error | null;
  userName: string | null;
  processedCourses: CourseWithProgress[];
}

export const useMainData = (isTelegramAuthLoading: boolean): UseMainDataReturn => {
  const userName = localStorage.getItem("user_name");

  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    error: coursesError
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    enabled: !isTelegramAuthLoading,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  return {
    isLoading: isCoursesLoading,
    error: coursesError || null,
    userName,
    processedCourses: coursesData || []
  };
}; 
