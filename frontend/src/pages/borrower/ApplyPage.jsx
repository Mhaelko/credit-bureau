import { useState } from "react";
import { createApplication } from "../../api/backend";
import "./ApplyPage.css";

export default function ApplyPage({ customerId }) {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");

  const submit = async () => {
    if (!amount || !term || !purpose) {
      alert("Заповніть всі поля");
      return;
    }

    await createApplication({
        customer_id: customerId,
        amount_requested: Number(amount),
        term_months: Number(term),
        purpose
    });
      

    alert("Заявку створено!");
    setAmount("");
    setTerm("");
    setPurpose("");
  };

  return (
    <div className="apply-wrapper">

      <h2 className="apply-title">Подати заявку</h2>

      <div className="apply-grid">

        <label>Сума</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />

        <label>Строк (місяців)</label>
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          type="number"
        />

        <label>Ціль кредиту</label>
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          type="text"
        />
      </div>

      <div className="apply-btn-wrapper">
        <button className="apply-btn" onClick={submit}>
          Створити
        </button>
      </div>
    </div>
  );
}
