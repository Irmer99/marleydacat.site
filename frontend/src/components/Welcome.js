import IMG from '../IMG_3777.jpg';

function Welcome() {
    return (
    <div className='AppMain'>
        <h1>marleydacat.site</h1>
        <img src={IMG} alt='marley landing' className='landing'></img>
    </div>
    );
  }
  
  export default Welcome;
  