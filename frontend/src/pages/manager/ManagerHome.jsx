import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function ManagerHome({ setLogin }) {
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
        <h3 className="menu-title">Меню менеджера</h3>

        <Link to="applications/3" className={`menu-item ${isActive("applications/3") ? "active" : ""}`}>
          На розгляді
        </Link>

        <Link to="applications/5" className={`menu-item ${isActive("applications/5") ? "active" : ""}`}>
          Схвалені
        </Link>

        <Link to="applications/6" className={`menu-item ${isActive("applications/6") ? "active" : ""}`}>
          Відхилені
        </Link>

        <Link to="product" className={`menu-item ${isActive("product") ? "active" : ""}`}>
          Кредитний продукт
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
