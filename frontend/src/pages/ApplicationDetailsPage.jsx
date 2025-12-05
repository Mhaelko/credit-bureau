import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplicationFullDetails, createManagerDecision } from "../api/backend";
import "./ApplicationDetailsPage.css";

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPending = location.state?.fromPending === true;
  const isManager = localStorage.getItem("login") === "manager";

  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getApplicationFullDetails(id);
    setData(res);
  }

  if (!data) return <p>Завантаження…</p>;

  const app = data.application;
  const borrower = data.borrower;
  const otherApps = data.other_applications || [];   // ДОДАНО
  const BKIreports = data.bki_reports || [];   
  return (
    <div className="details-wrapper">

      <h1 className="page-title">Заявка #{id}</h1>

      {/* ==== ДВІ ВЕЛИКІ КАРТКИ ==== */}
      <div className="details-grid">

        {/* --- Дані заявки --- */}
        <div className="card">
          <h2>Дані по заявці</h2>

          <div className="row"><span>Статус:</span><strong>{app.status_name}</strong></div>
          <div className="row"><span>Сума:</span><strong>{app.amount_requested} грн.</strong></div>
          <div className="row"><span>Термін:</span><strong>{app.term_months} міс.</strong></div>
          <div className="row"><span>Ціль:</span><strong>{app.purpose}</strong></div>
          <div className="row">
            <span>Створено:</span>
            <strong>{new Date(app.created_at).toLocaleString("uk-UA")}</strong>
          </div>
        </div>

        {/* --- Дані позичальника --- */}
        <div className="card">
          <h2>Дані позичальника</h2>

          <div className="row"><span>ПІБ:</span><strong>{borrower.full_name}</strong></div>
          <div className="row">
            <span>Дата народження:</span>
            <strong>{new Date(borrower.birth_date).toLocaleDateString("uk-UA")}</strong>
          </div>
          <div className="row"><span>Громадянство:</span><strong>{borrower.citizenship_name}</strong></div>
          <div className="row"><span>Місячний дохід:</span><strong>{borrower.monthly_income} грн.</strong></div>
          <div className="row"><span>Тип зайнятості:</span><strong>{borrower.employment_type_name}</strong></div>
          <div className="row"><span>Стаж:</span><strong>{borrower.employment_term_months} міс.</strong></div>
        </div>

      </div>

      {/* ==== ТІЛЬКИ ДЛЯ МЕНЕДЖЕРА ==== */}
      {isManager && (
        <div className="details-grid">

          {/* BUSINESS RULES */}
          <div className="card">
            <h2>Перевірка бізнес-правил</h2>

            <div className="row"><span>Дохід:</span><strong>{data.business_rules.income_ok ? "Так" : "Ні"}</strong></div>
            <div className="row"><span>DTI:</span><strong>{data.business_rules.dti_ok ? "Так" : "Ні"}</strong></div>
            <div className="row"><span>Зайнятість:</span><strong>{data.business_rules.employment_ok ? "Так" : "Ні"}</strong></div>
            <div className="row">
              <span>Загальний результат:</span>
              <strong>{data.business_rules.overall_result ? "PASS" : "FAILED"}</strong>
            </div>
          </div>

          {/* SCORING */}
          <div className="card">
            <h2>Скоринг</h2>

            <div className="row"><span>Скоринговий бал:</span><strong>{data.scoring.scoring_score}</strong></div>
            <div className="row"><span>Рівень ризику:</span><strong>{data.scoring.risk_level_name}</strong></div>
            <div className="row"><span>Версія моделі:</span><strong>{data.scoring.model_version}</strong></div>
          </div>
        </div>
      )}
        {/* === БКІ === */}
        {isManager && (
          <div className="other-apps-wrapper">
            <h2>Бюро кредитних історій</h2>

          <table className="history-table">
            <thead>
              <tr>
                <th>Звіт №</th>
                <th>Дата звіту</th>
                <th>Всього кредитів</th>
                <th>Прострочених кредитів</th>
                <th>Максимальний термін прострочки</th>
                <th>БКІ Скорінг</th>
              </tr>
            </thead>

            <tbody>
              {BKIreports.map((a) => (
                <tr key={a.report_id}>
                  <td>{a.report_id}</td>
                  <td>{new Date(a.report_date).toLocaleDateString("uk-UA")}</td>
                  <td>{a.total_loans}</td>
                  <td>{a.overdue_loans}</td>
                  <td>{a.max_overdue_days}</td>
                  <td>{a.external_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === ІНШІ ЗАЯВКИ КЛІЄНТА === */}
      {isManager && otherApps.length > 0 && (
        <div className="other-apps-wrapper">
          <h2>Інші заявки цього клієнта</h2>

          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Статус</th>
                <th>Скоринговий бал</th>
                <th>Сума</th>
                <th>Дата</th>
              </tr>
            </thead>

            <tbody>
              {otherApps.map((a) => (
                <tr key={a.application_id}>
                  <td>
                    <span
                      className="link"
                      onClick={() => navigate(`/manager/application/${a.application_id}`)}
                    >
                      {a.application_id}
                    </span>
                  </td>
                  <td>{a.status_name}</td>
                  <td>{a.scoring_score}</td>
                  <td>{a.amount_requested} грн</td>
                  <td>{new Date(a.created_at).toLocaleString("uk-UA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==== КНОПКИ ==== */}
      <div className="btn-block">

        {isManager && fromPending && (
          <>
            <button
              className="btn success"
              onClick={() =>
                createManagerDecision(id, {
                  manager_id: 1,
                  final_decision: "approved",
                  comment: "",
                  corrected_amount: null,
                  corrected_term: null,
                }).then(() => navigate(-1))
              }
            >
              Схвалити
            </button>

            <button
              className="btn danger"
              onClick={() =>
                createManagerDecision(id, {
                  manager_id: 1,
                  final_decision: "rejected",
                  comment: "",
                  corrected_amount: null,
                  corrected_term: null,
                }).then(() => navigate(-1))
              }
            >
              Відхилити
            </button>
          </>
        )}

        <button className="btn primary" onClick={() => navigate(-1)}>
          Назад
        </button>

      </div>
    </div>
  );
}
