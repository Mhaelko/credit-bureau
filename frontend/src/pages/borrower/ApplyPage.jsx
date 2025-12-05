import { useState, useEffect } from "react";
import { createApplication, getCreditProduct } from "../../api/backend";
import CreditProductCard from "../../components/CreditProductCard";
import "./ApplyPage.css";

export default function ApplyPage({ customerId }) {
  const [product, setProduct] = useState(null);
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const res = await getCreditProduct();
    setProduct(res);
  }

  const submit = async () => {
    if (!amount || !term || !purpose) {
      alert("Заповніть всі поля");
      return;
    }

    await createApplication({
      customer_id: customerId,
      amount_requested: Number(amount),
      term_months: Number(term),
      purpose,
    });

    alert("Заявку створено!");
    setAmount("");
    setTerm("");
    setPurpose("");
  };

  return (
    <div className="apply-wrapper">

      <h2 className="apply-title">Подати заявку</h2>

      {/* ============ CREDIT PRODUCT (READ ONLY) ============ */}
      <div style={{ marginBottom: "20px" }}>
        <h3 className="apply-subtitle">Кредитний продукт</h3>
        <CreditProductCard
          product={product}
          readOnly={true}
        />
      </div>

      {/* ============ APPLICATION FORM ============ */}
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
