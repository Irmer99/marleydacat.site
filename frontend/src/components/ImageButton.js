import '../stylesheets/imagebutton.css'

const ImageButton = ({ onClick, imageSrc, alt = 'Click me', buttonText = 'Button Text' }) => (
    <span className="image-button" onClick={onClick} role="button" tabIndex={0}>
      <img src={imageSrc} alt={alt} className="button-image"/>
      <div className="button-text">{buttonText}</div>
    </span>
  );

export default ImageButton;