import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Participants from './pages/Participants';
import Partners from './pages/Partners';
import Projects from './pages/Projects';
import Groups from './pages/Groups';
import Knowledge from './pages/Knowledge';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';

// Admin Imports
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminAbout from './pages/admin/AdminAbout';
import AdminHome from './pages/admin/AdminHome';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminPartners from './pages/admin/AdminPartners';
import AdminProjects from './pages/admin/AdminProjects';
import AdminGroups from './pages/admin/AdminGroups';
import AdminKnowledge from './pages/admin/AdminKnowledge';
import AdminNews from './pages/admin/AdminNews';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for public pages (Navbar + Footer)
const PublicLayout = () => (
  <div className="app">
    <div className="glow-mesh"></div>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="participants" element={<AdminParticipants />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="groups" element={<AdminGroups />} />
            <Route path="knowledge" element={<AdminKnowledge />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
