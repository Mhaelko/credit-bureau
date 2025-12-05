import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import BorrowerHome from "./pages/borrower/BorrowerHome";
import ProfilePage from "./pages/borrower/ProfilePage";
import ApplyPage from "./pages/borrower/ApplyPage";
import HistoryPage from "./pages/borrower/HistoryPage";

import ManagerHome from "./pages/manager/ManagerHome";
import ManagerApplicationsPage from "./pages/manager/ManagerApplicationsPage";
import ManagerProductPage from "./pages/manager/ManagerProductPage";
import ApplicationDetailsPage from "./pages/ApplicationDetailsPage";

function App() {
  const [login, setLogin] = useState(localStorage.getItem("login") || "");
  const isManager = login.toLowerCase() === "manager";

  if (!login) {
    return (
      <Router>
        <Login setLogin={setLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <Routes>

        {/* ===== DEFAULT REDIRECT ===== */}
        <Route path="/" element={
          isManager ? <Navigate to="/manager" /> : <Navigate to="/borrower" />
        } />

       {/* ===== BORROWER ROUTES ===== */}
        <Route path="/borrower" element={<BorrowerHome setLogin={setLogin} />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<ProfilePage customerId={localStorage.getItem("customer_id")} />} />
          <Route path="apply" element={<ApplyPage customerId={localStorage.getItem("customer_id")} />} />
          <Route path="history" element={<HistoryPage customerId={localStorage.getItem("customer_id")} />} />
          <Route path="application/:id" element={<ApplicationDetailsPage />} />
        </Route>


        {/* ДЕТАЛІ ЗАЯВКИ */}
        <Route path="/borrower/application/:id" element={<ApplicationDetailsPage />} />

        {/* ===== MANAGER ROUTES ===== */}
        <Route path="/manager" element={<ManagerHome setLogin={setLogin} />}>
          <Route index element={<Navigate to="applications/3" replace />} />
          <Route path="applications/:statusId" element={<ManagerApplicationsPage />} />
          <Route path="application/:id" element={<ApplicationDetailsPage />} />
          <Route path="/manager/product" element={<ManagerProductPage />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
