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
            <h1>Готово!</h1>
            <div>
                С этого момента вы начнете менять свою жизнь
                <br />
                Давайте сделаем все возможное для достижения вашей цели!
            </div>
            <Button text="OK" onClick={handleClick} />
        </div>
    );
}

export default HabitAddedPage;