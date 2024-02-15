import './App.css';
import DraftPost from './components/DraftPost';
import Login from './components/Login';
import CatProfile from './components/CatProfile';
import CatScroll from './components/CatScroll'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link
} from "react-router-dom";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<CatScroll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<DraftPost />} />
          <Route path="/scroll" element={<CatScroll />} />
          <Route path="/profile/:username" element={<CatProfile />} />
        </Routes>
    </Router>
  );
}

export default App;
