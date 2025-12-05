import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCreditProduct, updateCreditProduct } from "../../api/backend";
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

      {/* === CARD === */}
      <div className="product-card">

        <div className="form-group">
          <label>Назва</label>
          <input
            className="form-input"
            type="text"
            value={product.product_name}
            onChange={(e) =>
              setProduct({ ...product, product_name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Опис</label>
          <textarea
            className="form-textarea"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Відсоткова ставка (%)</label>
          <input
            className="form-input"
            type="number"
            value={product.interest_rate}
            onChange={(e) =>
              setProduct({ ...product, interest_rate: e.target.value })
            }
          />
        </div>

        <div className="row-2">
          <div className="form-group">
            <label>Мін. термін (міс)</label>
            <input
              className="form-input"
              type="number"
              value={product.min_term}
              onChange={(e) =>
                setProduct({ ...product, min_term: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Макс. термін (міс)</label>
            <input
              className="form-input"
              type="number"
              value={product.max_term}
              onChange={(e) =>
                setProduct({ ...product, max_term: e.target.value })
              }
            />
          </div>
        </div>

        <div className="row-2">
          <div className="form-group">
            <label>Мін. сума</label>
            <input
              className="form-input"
              type="number"
              value={product.min_amount}
              onChange={(e) =>
                setProduct({ ...product, min_amount: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Макс. сума</label>
            <input
              className="form-input"
              type="number"
              value={product.max_amount}
              onChange={(e) =>
                setProduct({ ...product, max_amount: e.target.value })
              }
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="btn-block">
            <button
                className="btn success"
                disabled={saving}
                onClick={save}
            >
                {saving ? "Оновлення..." : "Оновити"}
            </button>

            <button
                className="btn-back"
                onClick={() => navigate(-1)}
            >
                Назад
            </button>
        </div>

      </div>
    </div>
  );
}
