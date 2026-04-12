import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getApplicationsByStatus } from "../../api/backend";
import "./ManagerDashboard.css";

export default function ManagerDashboard() {
  const login = localStorage.getItem("login") || "Менеджер";

  const [counts, setCounts] = useState({ pending: "…", approved: "…", rejected: "…" });

  useEffect(() => {
    Promise.all([
      getApplicationsByStatus(3).catch(() => []),
      getApplicationsByStatus(5).catch(() => []),
      getApplicationsByStatus(6).catch(() => []),
    ]).then(([pending, approved, rejected]) => {
      setCounts({
        pending:  Array.isArray(pending)  ? pending.length  : 0,
        approved: Array.isArray(approved) ? approved.length : 0,
        rejected: Array.isArray(rejected) ? rejected.length : 0,
      });
    });
  }, []);

  const cards = [
    { icon: "📄", title: "На розгляді",    desc: "Заявки, що очікують рішення",   to: "applications/3" },
    { icon: "✅", title: "Схвалені",       desc: "Схвалені заявки",               to: "applications/5" },
    { icon: "❌", title: "Відхилені",      desc: "Відхилені заявки",              to: "applications/6" },
    { icon: "💳", title: "Активні кредити", desc: "Кредити в погашенні",          to: "active-credits" },
    { icon: "🚫", title: "Чорний список",  desc: "Заблоковані клієнти",           to: "blacklist" },
  ];

  return (
    <div className="mgr-dashboard-wrapper">
      <div className="mgr-dashboard-header">
        <div>
          <h1 className="mgr-dashboard-title">Вітаємо, {login}! 👋</h1>
          <p className="mgr-dashboard-subtitle">Панель менеджера кредитного бюро</p>
        </div>
        <div className="mgr-dashboard-stats">
          <div className="mgr-stat-item">
            <span className="mgr-stat-value pending">{counts.pending}</span>
            <span className="mgr-stat-label">На розгляді</span>
          </div>
          <div className="mgr-stat-item">
            <span className="mgr-stat-value approved">{counts.approved}</span>
            <span className="mgr-stat-label">Схвалено</span>
          </div>
          <div className="mgr-stat-item">
            <span className="mgr-stat-value rejected">{counts.rejected}</span>
            <span className="mgr-stat-label">Відхилено</span>
          </div>
        </div>
      </div>

      <div className="mgr-dashboard-grid">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="mgr-dash-card">
            <span className="mgr-dash-icon">{c.icon}</span>
            <div>
              <div className="mgr-dash-title">{c.title}</div>
              <div className="mgr-dash-desc">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
