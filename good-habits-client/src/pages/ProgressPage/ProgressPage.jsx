import React from "react";

import "./ProgressPage.css";
import GoalsDashboard from "@/components/GoalsDashboard/GoalsDashboard.jsx";

function ProgressPage() {
    return (
        <div className="progress_page">
            <GoalsDashboard/>
        </div>
    );
}

export default ProgressPage;