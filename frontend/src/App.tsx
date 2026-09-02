import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import CommandCenter from './pages/CommandCenter';
import AssetMonitoring from './pages/AssetMonitoring';
import AssetDetail from './pages/AssetDetail';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import GenerationForecast from './pages/GenerationForecast';
import WeatherIntelligence from './pages/WeatherIntelligence';
import GridOptimization from './pages/GridOptimization';
import AICopilot from './pages/AICopilot';
import AgentActivity from './pages/AgentActivity';
import AlertCenter from './pages/AlertCenter';
import RegionalMap from './pages/RegionalMap';
import Architecture from './pages/Architecture';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/command-center" element={<CommandCenter />} />
                <Route path="/assets" element={<AssetMonitoring />} />
                <Route path="/assets/:assetId" element={<AssetDetail />} />
                <Route path="/maintenance" element={<PredictiveMaintenance />} />
                <Route path="/forecast" element={<GenerationForecast />} />
                <Route path="/weather" element={<WeatherIntelligence />} />
                <Route path="/grid" element={<GridOptimization />} />
                <Route path="/copilot" element={<AICopilot />} />
                <Route path="/agents" element={<AgentActivity />} />
                <Route path="/alerts" element={<AlertCenter />} />
                <Route path="/map" element={<RegionalMap />} />
                <Route path="/architecture" element={<Architecture />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
