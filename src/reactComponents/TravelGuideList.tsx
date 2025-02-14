import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Guide = {
  id: string;
  title: string;
};

// しおり一覧コンポーネント
function TravelGuideList() {
  // しおり
  const [guides, setGuides] = useState<Guide[]>([]);
  const navigator = useNavigate();
  // しおり一覧取得
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${import.meta.env.VITE_API_PATH}/guides/search`, {
      method: "GET",
      headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized");
          }
        }
        return response.json();
      })
      .then((data) => {
        setGuides(data);
      })
      .catch((error) => {
        // 認証失敗時
        if (error.message === "Unauthorized") {
          navigator("/login");
        }
      });
  }, []);

  return (
    <ul className="list-disc p-1" style={{ margin: "0 25vw" }}>
      {guides.map((guide) => (
        <li key={guide.id} className="text-lg mt-3">
          <Link to={`/travel-guide/${guide.id}`}>{guide.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default TravelGuideList;
