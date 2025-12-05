import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function BorrowerHome({ setLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname.includes(path);

  const logout = () => {
    localStorage.clear();
    setLogin("");
    navigate("/"); // 🔥 Повертаємо користувача на Login
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <h3 className="menu-title">Меню</h3>

        <Link to="profile" className={`menu-item ${isActive("profile") ? "active" : ""}`}>
          Профіль
        </Link>

        <Link to="apply" className={`menu-item ${isActive("apply") ? "active" : ""}`}>
          Подати заявку
        </Link>

        <Link to="history" className={`menu-item ${isActive("history") ? "active" : ""}`}>
          Історія
        </Link>

        <button className="logout-btn" onClick={logout}>
          Вийти
        </button>
      </aside>

      <section className="content">
        <Outlet />
      </section>
    </div>
  );
}
