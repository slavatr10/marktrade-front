import { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Navigate,
  //redirect,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import MainPage from './pages/main-page/MainPage';
import WelcomeFirstPage from './pages/welcome-first-page/WelcomeFirstPage';
import WelcomeSecondPage from './pages/welcome-second-page/WelcomeSecondPage';
import RegistrationPage from './pages/registration/Registration';
import CheckSignUpPage from './pages/check-signup/CheckSignUpPage';
import MaterialsPage from './pages/materials/Materials';
import LessonPage from './pages/lesson/Lesson';
import TestPage from './pages/test/Test';
import DepositPage from './pages/deposit/Deposit';
import { refreshToken } from '@/api/auth';
import { queryClient } from '@/libs';
import { useTelegramFullscreen } from '@/hooks/useTelegramFullscreen';
import { useTelegramSafeArea } from '@/hooks/useTelegramSafeArea';
import WelcomePage from './pages/welcome/WelcomePage';
import StartPage from './pages/start/StartPage';

const rootRoute = createRootRoute();

const homeRoute = createRoute({ path: "/", component: MainPage, getParentRoute: () => rootRoute });
// const homeRoute = createRoute({
//   path: '/',
//   component: MainPage,
//   getParentRoute: () => rootRoute,
//   beforeLoad: () => {
//     if (!localStorage.getItem('user_id')) {
//       throw redirect({
//         to: '/start',
//         replace: true,
//       });
//     }
//   },
// });
// const homeRoute = createRoute({
//   path: '/',
//   component: MainPage,
//   getParentRoute: () => rootRoute,
//   beforeLoad: () => {
//     throw redirect({
//       to: '/start',
//       replace: true,
//     });
//   },
// });
// const homeRoute = createRoute({
//   path: '/',
//   component: MainPage,
//   getParentRoute: () => rootRoute,
//   beforeLoad: () => {
//     const userId = localStorage.getItem('user_id');
//     const isRegister = localStorage.getItem('isRegister');
//     if ((isRegister === 'true') || userId) {
//       throw redirect({
//         to: '/',
//         replace: true,
//       });
//     } else {
//       throw redirect({
//         to: '/start',
//         replace: true,
//       });
//     }
//   },
// });
const startRoute = createRoute({
  path: '/start',
  component: StartPage,
  getParentRoute: () => rootRoute,
});
const welcomeRoute = createRoute({
  path: '/welcome',
  component: WelcomePage,
  getParentRoute: () => rootRoute,
});
const welcomeFirstPageRoute = createRoute({
  path: '/welcome-first',
  component: WelcomeFirstPage,
  getParentRoute: () => rootRoute,
});
const welcomeSecondPageRoute = createRoute({
  path: '/welcome-second',
  component: WelcomeSecondPage,
  getParentRoute: () => rootRoute,
});
const RegistrationPageRoute = createRoute({
  path: '/registration',
  component: RegistrationPage,
  getParentRoute: () => rootRoute,
});

const CheckSignUpPageRoute = createRoute({
  path: '/check-sign-up',
  component: CheckSignUpPage,
  getParentRoute: () => rootRoute,
});
const MaterialsPageRoute = createRoute({
  path: '/materials',
  component: MaterialsPage,
  getParentRoute: () => rootRoute,
});
const LessonPageRoute = createRoute({
  path: '/lesson',
  component: LessonPage,
  getParentRoute: () => rootRoute,
});
const TestPageRoute = createRoute({
  path: '/test',
  component: TestPage,
  getParentRoute: () => rootRoute,
});
const DepositPageRoute = createRoute({
  path: '/deposit',
  component: DepositPage,
  getParentRoute: () => rootRoute,
});

const notFoundRoute = createRoute({
  path: '/$',
  component: () => <Navigate to="/" replace />,
  getParentRoute: () => rootRoute,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  startRoute,
  welcomeRoute,
  welcomeFirstPageRoute,
  welcomeSecondPageRoute,
  RegistrationPageRoute,
  CheckSignUpPageRoute,
  MaterialsPageRoute,
  LessonPageRoute,
  TestPageRoute,
  DepositPageRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

function App() {
  useTelegramFullscreen();
  useTelegramSafeArea();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Error refreshing tokens:', error);
      }
    }, 3 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
