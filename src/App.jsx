import React, { Suspense, useEffect, useState } from 'react';
import Layout from './pages/Layout';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useIsFetching, useIsMutating, useQuery } from '@tanstack/react-query';
import { getProfile } from './services/profileService';
import { getTasks } from './services/taskService';
import TaskReminder from './components/TaskReminder';
import { OnboardingSlides } from './pages/OnboardingSlides';
import LoadingSpinner from './components/LoadingSpinner';
import { AppDataProvider } from './context/AppDataContext';
import { getCategories } from "./services/categories";

// lazy-loaded routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Settings = React.lazy(() => import('./pages/Settings'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const SignIn = React.lazy(() => import('./pages/SignIn'));
const SignUp = React.lazy(() => import('./pages/SignUp'));

const App = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  // const isLoading = isFetching > 0 || isMutating > 0;
  const isLoading = isFetching > 0;

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted");
    if (!completed) setShowOnboarding(true);
  }, []);

  const [theme, setTheme] = useState("Light");

  // Load theme from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (savedProfile?.theme) {
      setTheme(savedProfile.theme);
    }
  }, []);

  // React Query: fetch profile
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // keep in cache for 10 mins
  });

  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme]);

  // Apply theme class
  useEffect(() => {
    document.body.className = theme === "Dark" ? "theme-dark" : "theme-light";
  }, [theme]);

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: !!localStorage.getItem("token"),
    staleTime: 30 * 1000, // prevent instant refetches
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      {showOnboarding ? (
        <OnboardingSlides onFinish={() => setShowOnboarding(false)} />
      ) : (
        <>
          {/* global query loading overlay */}
          {isLoading && <LoadingSpinner text="Loading data..." />}

          {/* ✅ Provide tasks and profile globally */}
          <AppDataProvider tasks={tasks} profile={profile} categories={categories}>
            <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
              <Routes>
                <Route path="sign-up" element={<SignUp theme={theme} setTheme={setTheme} />} />
                <Route path="sign-in" element={<SignIn theme={theme} setTheme={setTheme} />} />
                <Route
                  path="/"
                  element={isLoggedIn ? (
                    <Layout theme={theme} setTheme={setTheme} />
                  ) : (
                    <Navigate to="/sign-in" replace />
                  )}
                >
                  <Route index element={<Dashboard theme={theme} setTheme={setTheme} />} />
                  <Route path="dashboard" element={<Dashboard theme={theme} setTheme={setTheme} />} />
                  <Route path="tasks" element={<Tasks theme={theme} setTheme={setTheme} />} />
                  <Route path="reports" element={<ReportsPage theme={theme} setTheme={setTheme} />} />
                  <Route path="profile" element={<Settings theme={theme} setTheme={setTheme} />} />
                </Route>
              </Routes>
            </Suspense>
          </AppDataProvider>

          {isLoggedIn && <TaskReminder tasks={tasks} />}
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
