import GoalHabitsList from "@/components/GoalHabitsList/GoalHabitsList.jsx";

const AllGoals = () =>{
    const mockHabits = [
        {
            created_at: "2024-11-30T09:40:20.466955Z",
            updated_at: "2024-11-30T09:40:20.466955Z",
            id: "f7b22157-b4b9-4b6f-944b-6e53822c0b84",
            user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            title: "Finish 5 Philosophy Books",
            description: "Read and finish 5 philosophy books in 7 days.",
            duration_days: 7,
            goal: "5 books",
        },
    ];

    const mockProgress = [
        {
            id: "f480bccb-6caf-43ce-8245-8d5a7289ff0e",
            habit_id: "f7b22157-b4b9-4b6f-944b-6e53822c0b84",
            user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            start_date: "2024-11-22T07:27:15.092000Z",
            last_check_in_date: null,
            checkin_amount_per_day: 2,
            status: "in_progress",
            reward_coins: 5,
            completed_days: 6,
            check_ins: [],
        },
    ];
  return(
      <div>
          <GoalHabitsList habits={mockHabits} progress={mockProgress} />
      </div>
  );
};

export default AllGoals;