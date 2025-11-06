/**
 * App Component
 * 
 * Description: Main application component that serves as the root component.
 *              Includes NavBar, main content area, and Footer.
 * 
* Date Created: 2025-November-06
 * Author: thangtruong
 */

import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Hello, This is a Todo List App
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

