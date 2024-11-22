import Footer from "@/components/UI-kit/footer/Footer.jsx";
import add_button from '@/assets/add_button.svg'
import './AddHabitButton.css'

function AddHabitButton() {

    const handleClick = () => {
        alert("Кнопка нажата!");
    };

    return (
        <div className="add_habit">
            <img src={add_button} alt="Add Habit" onClick={handleClick} />
        </div>
    );
}

export default AddHabitButton