import noteSvg from "@/assets/note.svg";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import './HabitAddedPage.css'
import {useNavigate} from "react-router-dom";
function HabitAddedPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div className="homepage page">
            <img src={noteSvg} alt="Note" />
            <h1>Done!</h1>
            <div>
                New Habit Goal has added
                <br />
                Let’s do the best to achieve your goal!
            </div>
            <Button text="OK" onClick={handleClick} />
        </div>
    );
}

export default HabitAddedPage;