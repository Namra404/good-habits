
import Layout from "@/components/UI-kit/layout/layout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import {useState} from "react";
import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import HabitAddedPage from "@/pages/HabitAddPage/HabitAddedPage.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";
import HomePage from "@/pages/HomePage/HomePage.jsx";
import DeleteUserHabitPage from "@/pages/DeleteUserHabitPage/DeleteUserHabitPage.jsx";
import LinkHabitToUser from "@/components/ChoseHabit/LinkHabitToUser.jsx";
import CreateCustomHabit from "@/components/CreateCustomHabit/CreateCustomHabit.jsx";
import DefaultHabits from "@/components/DefaultHabits/DefaultHabits.jsx";

const hideRoutes = ['/']
function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/goal-added"
                    element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    }
                />
                <Route
                    path="/goal"
                    element={
                        <Layout>
                            <HabitAddedPage/>
                        </Layout>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Layout>
                            <AddHabitButton/>
                        </Layout>
                    }
                />
                <Route
                    path="/delete"
                    element={
                        <Layout>
                            <DefaultHabits/>
                            <LinkHabitToUser/>
                            <DeleteUserHabitPage/>
                            <CreateCustomHabit/>

                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;