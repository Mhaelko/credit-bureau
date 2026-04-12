import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/backend";
import "./Login.css";

export default function Login({ setLogin }) {
  const [login, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(login.trim().toLowerCase(), password);

      localStorage.setItem("login", data.login);

      if (data.login === "admin") {
        setLogin("admin");
        return;
      }

      if (data.login === "manager") {
        setLogin("manager");
        return;
      }

      if (data.customer_id) {
        localStorage.setItem("customer_id", data.customer_id);
        setLogin(data.login);
        return;
      }

      setError("Помилка: немає customer_id");
    } catch (err) {
      setError(err.message || "Помилка входу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-brand">
          <span className="login-brand-icon">🏦</span>
          <span className="login-brand-name">КредитБюро</span>
        </div>
        <h2>Вхід до системи</h2>

        <form onSubmit={submit} className="login-form">
          <label>Логін</label>
          <input
            type="text"
            placeholder="Введіть логін"
            value={login}
            onChange={(e) => setLoginInput(e.target.value)}
            required
          />

          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введіть пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Вхід…" : "Увійти"}
          </button>
        </form>

        <p className="login-register-link">
          Немає акаунту? <Link to="/register">Зареєструватись</Link>
        </p>
      </div>
    </div>
  );
}
