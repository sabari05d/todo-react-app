import React, { useEffect, useState } from 'react'
import Layout from './pages/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Settings from './pages/Settings'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from './services/profileService'

const App = () => {
  const [theme, setTheme] = useState("Light");

  // Load theme from localStorage on mount (first render only)
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
  });

  // Whenever profile?.theme updates from query, sync it
  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme);
    }
  }, [profile?.theme]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === "Dark" ? "theme-dark" : "theme-light";
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout theme={theme} setTheme={setTheme} />}>
            {/* Default route → dashboard */}
            <Route index element={<Dashboard theme={theme} setTheme={setTheme} />} />
            <Route path="dashboard" element={<Dashboard theme={theme} setTheme={setTheme} />} />
            <Route path="tasks" element={<Tasks theme={theme} setTheme={setTheme} />} />
            <Route path="settings" element={<Settings theme={theme} setTheme={setTheme} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
