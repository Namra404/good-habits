
import Layout from "@/components/UI-kit/layout/layout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HabitTracker from "@/components/UI-kit/habit-tracker/habit-tracker.jsx";
import {useState} from "react";
import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import HabitAddedPage from "@/pages/HabitAddPage/HabitAddedPage.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";
import HomePage from "@/pages/HomePage/HomePage.jsx";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;