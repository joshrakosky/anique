import React from 'react';
import { Route, Routes } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { Projects } from './Projects';

const App: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/dashboard/projects" 
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App; 