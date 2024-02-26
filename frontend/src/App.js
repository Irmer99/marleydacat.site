import './App.css';
import DraftPost from './components/DraftPost';
import Login from './components/Login';
import CatProfile from './components/CatProfile';
import CatScroll from './components/CatScroll'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

function NavigationButtons() {
  const navigate = useNavigate();

  const onProfile = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/users/whoami`, {
      method: 'GET',
      credentials: 'include',
    });
    const resJson = await response.json();
    if (resJson !== null) navigate(`/profile/${resJson.username}`);
  };

  return (
    <div className="button-container">
      <button onClick={() => navigate('/post')}>Create Post</button>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={onProfile}>Profile</button>
    </div>
  );
}


function App() {
  return (
    <Router>
        <div className='header'>
          <h3>marleydacat.site</h3>
        </div>
        <Routes>
          <Route path="/" element={<CatScroll />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<DraftPost />} />
          <Route path="/scroll" element={<CatScroll />} />
          <Route path="/profile/:username" element={<CatProfile />} />
        </Routes>
        <NavigationButtons />
    </Router>
  );
}

export default App;
