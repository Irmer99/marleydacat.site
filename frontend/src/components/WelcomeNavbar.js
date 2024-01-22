import { useNavigate } from "react-router-dom";

const WelcomeNavbar = () => {

    const nav = useNavigate();

    const redirect_to_post = () => {
        nav('/post');
    };

    return (
        <div>
            <button onClick={redirect_to_post}>Make Post</button>
        </div>
    );
};

export default WelcomeNavbar;
