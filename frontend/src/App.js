import './App.css';
import DraftPost from './components/DraftPost';
import Login from './components/Login';
import Welcome from './components/Welcome';

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
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<DraftPost />} />
        </Routes>
    </Router>
  );
}

export default App;
