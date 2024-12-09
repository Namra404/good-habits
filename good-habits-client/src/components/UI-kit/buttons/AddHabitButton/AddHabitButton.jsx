import Footer from "@/components/UI-kit/footer/Footer.jsx";
import add_button from '@/assets/add_button.svg'
import './AddHabitButton.css'
import {useNavigate} from "react-router-dom";

function AddHabitButton() {

    const navigate = useNavigate();


    const handleClick = () => {
        navigate('/new-habit');
    };

    return (
        <div className="add_habit">
            <img src={add_button} alt="Add Habit" onClick={handleClick} />
        </div>
    );
}

export default AddHabitButton