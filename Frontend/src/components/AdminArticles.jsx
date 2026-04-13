import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common";

function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/admin-api/articles", { withCredentials: true });
        if (res.status === 200) {
          setArticles(res.data.payload);
        }
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const navigateToArticleByID = (articleObj) => {
    navigate(`/article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) return <p className={loadingClass}>Loading articles...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">All Articles</h3>
      
      {articles.length === 0 ? (
        <p className="text-[#a1a1a6] text-sm py-10 text-center">No articles found.</p>
      ) : (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                {/* TOP */}
                <div>
                  <div className="flex justify-between items-start">
                    <p className={articleTitle}>{articleObj.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium ml-2 shrink-0">
                       {articleObj.category}
                    </span>
                  </div>
                  <p className="text-sm text-[#6e6e73] mt-2 leading-relaxed">{articleObj.content.slice(0, 100)}...</p>
                  <p className={`${timestampClass} mt-3 flex justify-between`}>
                     <span>{formatDateIST(articleObj.createdAt)}</span>
                     <span className={`${articleObj.isArticleActive ? "text-green-500" : "text-red-500"} font-medium`}>
                        {articleObj.isArticleActive ? "Active" : "Inactive"}
                     </span>
                  </p>
                </div>

                {/* ACTION */}
                <button
                  className={`${ghostBtn} mt-auto pt-5`}
                  onClick={() => navigateToArticleByID(articleObj)}
                >
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminArticles;
