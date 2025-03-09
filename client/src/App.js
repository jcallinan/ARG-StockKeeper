import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import WorkOrderScanner from './components/WorkOrderScanner';
import TestWorkOrder from './components/TestWorkOrder';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/scanner" element={<WorkOrderScanner />} />
      <Route path="/generate-test-workorder" element={<TestWorkOrder />} />
    </Routes>
  );
};

export default App;
