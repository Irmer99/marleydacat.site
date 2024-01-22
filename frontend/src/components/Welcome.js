import IMG from '../IMG_3777.jpg';
import WelcomeNavbar from './WelcomeNavbar';
import { useState } from 'react';

function Welcome() {
    const [catImage, setCatImage] = useState(IMG);
    
    const fetchNewImage = async () => {
        const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/post/random', {
            method: 'GET',
          });
        let res_json = await response.json();
        if (response.status === 200)
            setCatImage(`${process.env.REACT_APP_BACKEND_HOST}/post/image/${res_json.image_name}`);
    };

    return (
    <div className='AppMain'>
        <h1>marleydacat.site</h1>
        <WelcomeNavbar newImgCallback={fetchNewImage}/>
        <img src={catImage} alt='marley landing' className='landing'></img>
    </div>
    );
  }
  
  export default Welcome;
  