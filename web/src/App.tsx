import React from 'react';
import './App.css';
import { CssBaseline } from '@mui/material';
import LeaderboardList from './LeaderboardList';
import ResponsiveAppBar from './ResponsiveAppBar';

function App() {
  return (
    <div className="App">
      <CssBaseline/>

      <ResponsiveAppBar/>

      <LeaderboardList/>
    </div>
  );
}

export default App;
