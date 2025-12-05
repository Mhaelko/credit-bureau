import { useState } from "react";
import { loginUser } from "../api/backend";
import "./Login.css";

export default function Login({ setLogin }) {
  const [login, setLoginInput] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const data = await loginUser(login);

    if (!data || !data.login) {
      alert("Помилка логіну");
      return;
    }

    localStorage.setItem("login", data.login);

    // Менеджер
    if (data.login === "manager") {
      setLogin("manager");
      return;
    }

    // Borrower
    if (data.customer_id) {
      localStorage.setItem("customer_id", data.customer_id);
      setLogin(data.login);
      return;
    }

    alert("Помилка: немає customer_id");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Вхід</h2>

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
            placeholder="Не використовується"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}
