import React from 'react';
import { useNavigate } from "react-router-dom";
import ImageButton from './ImageButton';

import loginCat from '../images/BE_Cat72.png'
import loginCatHome from '../images/BE_Cat72_home.png'
import loginCatCreate from '../images/BE_Cat72_create.png'

function NavigationButtons({ username }) {
  const navigate = useNavigate();

  const onProfile = async () => {
    if (username)
      return navigate(`/profile/${username}`);
    else
      return navigate('/login/');
  };

  const getProfileButtonText = () => {
    if (username != null)
      return "Profile";
    else
      return "Login";
  };

  return (
    <div className="button-container">
      <ImageButton onClick={() => navigate('/post')} imageSrc={loginCatCreate} buttonText='Post' alt="Image Button" />
      <ImageButton onClick={() => navigate('/')} imageSrc={loginCatHome} buttonText='Home' alt="Image Button" />
      <ImageButton onClick={onProfile} imageSrc={loginCat} buttonText={getProfileButtonText()} alt="Image Button" />
    </div>
  );
}

export default NavigationButtons;
