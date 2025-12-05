import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCreditProduct, updateCreditProduct } from "../../api/backend";
import CreditProductCard from "../../components/CreditProductCard";
import "./ManagerProductPage.css";

export default function ManagerProductPage() {
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getCreditProduct();
    setProduct(res);
  }

  async function save() {
    setSaving(true);
    await updateCreditProduct(product.product_id, product);
    setSaving(false);
    alert("Продукт оновлено!");
  }

  if (!product) return <p>Завантаження…</p>;

  return (
    <div className="product-wrapper">
      <h1>Кредитний продукт</h1>

      <CreditProductCard
        product={product}
        setProduct={setProduct}
        onSave={save}
        saving={saving}
        readOnly={false}
      >
        <button className="btn-back" onClick={() => navigate(-1)}>
          Назад
        </button>
      </CreditProductCard>

    </div>
  );
}
