import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplicationsByStatus } from "../../api/backend";

export default function ManagerApplicationsPage() {
  const { statusId } = useParams();
  const [apps, setApps] = useState([]);

  const titles = {
    3: "Заявки на розгляд",
    5: "Схвалені заявки",
    6: "Відхилені заявки"
  };

  useEffect(() => {
    load();
  }, [statusId]);

  async function load() {
    const res = await getApplicationsByStatus(statusId);
    setApps(res.applications || []);
  }

  return (
    <div>
      <h1>{titles[statusId] || "Заявки"}</h1>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ПІБ</th>
            <th>Сума</th>
            <th>Термін</th>
            <th>Дата</th>
          </tr>
        </thead>

        <tbody>
          {apps.map((a) => (
            <tr key={a.application_id}>
              <td>
                <Link
                    to={`/manager/application/${a.application_id}`}
                    state={{ fromPending: statusId === "3" }} 
                    >
                    {a.application_id}
                </Link>
              </td>
              <td>{a.full_name}</td>
              <td>{a.amount_requested}</td>
              <td>{a.term_months}</td>
              <td>{new Date(a.created_at).toLocaleString("uk-UA")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
