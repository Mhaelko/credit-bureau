import { useState, useEffect } from "react";
import { createApplication, getCreditProduct } from "../../api/backend";
import CreditProductCard from "../../components/CreditProductCard";
import "./ApplyPage.css";

export default function ApplyPage({ customerId }) {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");

  const [product, setProduct] = useState(null);
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    amount: false,
    term: false,
    purpose: false,
  });

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    const res = await getCreditProduct();
    setProduct(res);
  }

  // ---- Розрахунок місячного платежу ----
  useEffect(() => {
    if (!product) return;

    if (!amount || !term) {
      setMonthlyPayment(null);
      return;
    }

    const P = Number(amount);
    const n = Number(term);
    const r = Number(product.interest_rate) / 12 / 100;

    if (r === 0) {
      setMonthlyPayment((P / n).toFixed(2));
      return;
    }

    const M = P * (r / (1 - Math.pow(1 + r, -n)));
    setMonthlyPayment(M.toFixed(2));
  }, [amount, term, product]);

  // ============================
  //        SUBMIT + ВАЛІДАЦІЯ
  // ============================
  const submit = async () => {
    let hasError = false;
    let newErrors = { amount: false, term: false, purpose: false };
    setError("");

    // ---- Валідація суми ----
    if (Number(amount) < product.min_amount || Number(amount) > product.max_amount) {
      newErrors.amount = true;
      hasError = true;
      setError(
        `Сума повинна бути від ${product.min_amount} до ${product.max_amount} грн`
      );
    }

    // ---- Валідація терміну ----
    if (Number(term) < product.min_term || Number(term) > product.max_term) {
      newErrors.term = true;
      hasError = true;
      setError(
        `Строк повинен бути від ${product.min_term} до ${product.max_term} місяців`
      );
    }

    // ---- Валідація цілі ----
    if (!purpose.trim()) {
      newErrors.purpose = true;
      hasError = true;
      setError("Вкажіть ціль кредиту");
    }

    setErrors(newErrors);

    if (hasError) return;

    // ---- Якщо валідно ----
    await createApplication({
      customer_id: customerId,
      amount_requested: Number(amount),
      term_months: Number(term),
      purpose,
    });

    alert("Заявку створено!");

    // очистка
    setAmount("");
    setTerm("");
    setPurpose("");
    setMonthlyPayment(null);
    setErrors({ amount: false, term: false, purpose: false });
  };

  if (!product) return <p>Завантаження…</p>;

  return (
    <div className="apply-wrapper">
      <h2 className="apply-title">Подати заявку</h2>

      <h3 className="apply-subtitle">Кредитний продукт</h3>
      <CreditProductCard product={product} readOnly={true} />

      <h3 className="apply-subtitle">Запит користувача</h3>

      <div className="apply-grid">
        <label>Сума</label>
        <input
          className={errors.amount ? "input-error" : ""}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />

        <label>Строк (місяців)</label>
        <input
          className={errors.term ? "input-error" : ""}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          type="number"
        />

        <label>Ціль кредиту</label>
        <input
          className={errors.purpose ? "input-error" : ""}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          type="text"
        />
      </div>

      {monthlyPayment && (
        <div className="payment-box">
          Щомісячний платіж: <strong>{monthlyPayment} грн</strong>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <div className="apply-btn-wrapper">
        <button className="apply-btn" onClick={submit}>
          Створити
        </button>
      </div>
    </div>
  );
}
