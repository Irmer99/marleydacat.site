import './App.css';
import DraftPost from './components/DraftPost';
import Login from './components/Login';
import CatProfile from './components/CatProfile';
import CatScroll from './components/CatScroll'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import React, { useState, useEffect } from 'react';

function App() {

  const [username, setUsername] = useState(null);

  async function getUsername() {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/users/whoami`, {
      method: 'GET',
      credentials: 'include',
    });
    const resJson = await response.json();
    if (resJson !== null)
      setUsername(resJson.username);
  };
  
  function NavigationButtons() {
    const navigate = useNavigate();
  
    const onProfile = async () => {
      if (username)
        return navigate(`/profile/${username}`);
      else
        return navigate('/login/');
    };
  
    useEffect(() => {
      getUsername()
    }, []);
  
    const getProfileButtonText = () => {
      if (username != null)
        return "Profile";
      else
        return "Login";
    };
  
    return (
      <div className="button-container">
        <button onClick={() => navigate('/post')}>Create Post</button>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={onProfile}>{getProfileButtonText()}</button>
      </div>
    );
  }

  return (
    <Router>
        <div className='header'>
          <h3>marleydacat.site</h3>
        </div>
        <Routes>
          <Route path="/" element={<CatScroll />} />
          <Route path="/login" element={<Login setUsernameFunc={setUsername}/>} />
          <Route path="/post" element={<DraftPost />} />
          <Route path="/scroll" element={<CatScroll />} />
          <Route path="/profile/:username" element={<CatProfile />} />
        </Routes>
        <NavigationButtons />
    </Router>
  );
}

export default App;
