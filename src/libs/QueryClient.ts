import { QueryClient } from "@tanstack/react-query";
import { CACHE_TIME, STALE_TIME } from "@/constants/query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: STALE_TIME,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

export const invalidateProgress = () => {
  queryClient.invalidateQueries({ queryKey: ["courseProgress"] });
  queryClient.invalidateQueries({ queryKey: ["exerciseProgress"] });
  queryClient.invalidateQueries({ queryKey: ["categoryLessons"] });
  queryClient.invalidateQueries({ queryKey: ["coursesProgress"] });
};

export const invalidateUser = () => {
  queryClient.invalidateQueries({ queryKey: ["user"] });
};

export const invalidateCourseData = (courseId?: string) => {
  if (courseId) {
    queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    queryClient.invalidateQueries({ queryKey: ["courseProgress", courseId] });
  } else {
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    queryClient.invalidateQueries({ queryKey: ["course"] });
  }
};
