
import { Link } from "react-router-dom";
import { getImageUrl } from "../api";

export default function ContentCard({ item }) {
  const typeLabel =
    item.type === "factcheck"
      ? "FACT CHECK"
      : item.type === "media-analysis"
        ? "MEDIA ANALYSIS"
        : "RESEARCH";

  return (
    <article className="content-card">
      {item.imageUrl ? (
        <img
          className="card-image"
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="image-placeholder">
          CIVICLENS / {typeLabel}
        </div>
      )}

      <div className="card-content">
        <div className="eyebrow-row">
          <span className="eyebrow">{typeLabel}</span>

          {item.verdict && (
            <span className={`verdict verdict-${item.verdict.toLowerCase()}`}>
              {item.verdict}
            </span>
          )}
        </div>

        <h3>
          <Link to={`/article/${item.slug}`}>
            {item.title}
          </Link>
        </h3>

        <p>{item.summary}</p>

        <div className="card-meta">
          {item.category || "General"} ·{" "}
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString()
            : "Recently published"}
        </div>

        <Link className="read-link" to={`/article/${item.slug}`}>
          Read investigation →
        </Link>
      </div>
    </article>
  );
}
