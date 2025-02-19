import Layout from "@/components/UI-kit/layout/layout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HabitAddedPage from "@/pages/HabitAddPage/HabitAddedPage.jsx";
import AddHabitButton from "@/components/UI-kit/buttons/AddHabitButton/AddHabitButton.jsx";
import HomePage from "@/pages/HomePage/HomePage.jsx";
import DeleteUserHabitPage from "@/pages/DeleteUserHabitPage/DeleteUserHabitPage.jsx";
import LinkHabitToUser from "@/components/ChoseHabit/LinkHabitToUser.jsx";
import CreateCustomHabit from "@/components/CreateCustomHabit/CreateCustomHabit.jsx";
import DefaultHabits from "@/components/DefaultHabits/DefaultHabits.jsx";
import SettingsPage from "@/pages/SettingsPage/SettingsPage.jsx";
import ProgressPage from "@/pages/ProgressPage/ProgressPage.jsx";
import DateSelector from "@/components/DateSelector/DateSelector.jsx";
import HabitTrackerList from "@/components/UI-kit/habit-tracker-list/HabitTrackerList.jsx";
import DailyHabits from "@/pages/DailyHabits/DailyHabits.jsx";
import AllGoals from "@/pages/AllGoals/AllGoals.jsx";
import ComicsStore from "@/pages/ComicsStore/ComicsStore.jsx";
import UserProfile from "@/pages/UserProfile/UserProfile.jsx";
import PurchasedComicsPage from "@/pages/PurchasedComicsPage/PurchasedComicsPage.jsx";
import HabitHistory from "@/pages/HabitHistory/HabitHistory.jsx";
import TelegramIntegration from "@/lib/TelegramIntegration.jsx";
import {useUser} from "@/store/user-provider.jsx";


const hideRoutes = ['/']

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Layout>
                            <HomePage/>
                        </Layout>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <Layout>
                            <ProgressPage/>
                        </Layout>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Layout>
                            <SettingsPage/>
                        </Layout>
                    }
                />
                <Route
                    path="/success"
                    element={
                        <Layout>
                            <HabitAddedPage/>
                        </Layout>
                    }
                />
                <Route
                    path="/new-habit"
                    element={
                        <Layout>
                            <div className='page'>
                                <DefaultHabits/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/new-goal"
                    element={
                        <Layout>
                            <div className='page'>
                                <LinkHabitToUser/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/custom-habit"
                    element={
                        <Layout>
                            <div className='page'>
                                <CreateCustomHabit/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/daily-habits"
                    element={
                        <Layout>
                            <div className='page'>
                                <DailyHabits/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/all-goals"
                    element={
                        <Layout>
                            <div className='page'>
                                <AllGoals/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/store"
                    element={
                        <Layout>
                            <div className='page'>
                                <ComicsStore/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/profile"
                    element={
                        <Layout>
                            <div className='page'>
                                <UserProfile/>
                            </div>
                        </Layout>
                    }

                />
                <Route
                    path="/purchased-comics"
                    element={
                        <Layout>
                            <div className='page'>
                                <PurchasedComicsPage/>
                            </div>
                        </Layout>
                    }
                />
                <Route
                    path="/habit-history"
                    element={
                        <Layout>
                            <div className='page'>
                                <HabitHistory/>
                            </div>
                        </Layout>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;