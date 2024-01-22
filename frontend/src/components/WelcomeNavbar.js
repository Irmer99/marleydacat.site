import { useNavigate } from "react-router-dom";

const WelcomeNavbar = ({newImgCallback}) => {

    const nav = useNavigate();

    const redirect_to_post = () => {
        nav('/post');
    };

    return (
        <div>
            <button onClick={newImgCallback}>Fetch a new MarMars pic</button>
            <button onClick={redirect_to_post}>Post a new MarMars pic</button>
        </div>
    );
};

export default WelcomeNavbar;
