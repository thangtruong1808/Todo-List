/**
 * App Component
 * 
 * Description: Main application component that serves as the root component.
 *              Includes NavBar, main content area, and Footer.
 *              Uses React Router for URL-based navigation.
 * 
 * Date Created: 2025-November-06
 * Author: thangtruong
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Tasks from './components/Tasks';
import ViewTasks from './components/ViewTasks';
import APITesting from './components/APITesting';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Bar */}
        <NavBar />

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/view-tasks" element={<ViewTasks />} />
            <Route path="/api-testing" element={<APITesting />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App

