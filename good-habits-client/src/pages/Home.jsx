import noteSvg from "../assets/note.svg";
import Button from "../components/UI-kit/buttons/BigButton.jsx";

function HomePage() {
    const handleClick = () => {
        alert('Кнопка нажата!');
    };
    return (
        <div style={{backgroundColor: 'white'}}>

            <img src={noteSvg} alt="Example SVG"/>

            <h1>Done!</h1>

            <div>
                New Habit Goal has added
                Let’s do the best to achieve your goal!
            </div>

            <Button text="OK" onClick={handleClick} />
        </div>
    );
}

export default HomePage