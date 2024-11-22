import noteSvg from "@/assets/note.svg";
import Button from "@/components/UI-kit/buttons/BigButton/BigButton.jsx";
import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";

function HomePage() {


    return (
        <div>
            <HabitTrackerList/>
            <AddHabitButton/>

        </div>
    );
}

export default HomePage;