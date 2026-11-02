
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { getImageUrl } from "../api";

export default function Article() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/content/${slug}`)
      .then(({ data }) => setItem(data.item))
      .catch(() => setError("This article could not be found."));
  }, [slug]);

  if (error) {
    return (
      <section className="section page-section">
        <div className="notice error">{error}</div>
        <Link to="/">Return home</Link>
      </section>
    );
  }

  if (!item) {
    return (
      <section className="section page-section">
        <div className="notice">Loading article…</div>
      </section>
    );
  }

  return (
    <article className="article-page">
      <Link className="back-link" to="/">
        ← Back to CivicLens
      </Link>

      <div className="article-topline">
        {item.type.replace("-", " ").toUpperCase()} · {item.category}
      </div>

      <h1>{item.title}</h1>

      <p className="article-summary">{item.summary}</p>

      <div className="article-meta">
        By {item.author || "CivicLens Editorial Desk"} ·{" "}
        {item.publishedAt
          ? new Date(item.publishedAt).toLocaleDateString()
          : ""}
      </div>

      {item.verdict && (
        <div className={`article-verdict verdict-${item.verdict.toLowerCase()}`}>
          <small>OUR VERDICT</small>
          <strong>{item.verdict}</strong>
        </div>
      )}

      {item.imageUrl && (
        <img
          className="article-image"
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
        />
      )}

      {item.claim && (
        <div className="claim-box">
          <span>THE CLAIM</span>
          <p>{item.claim}</p>
        </div>
      )}

      <div className="article-body">
        {item.body.split("\n").filter(Boolean).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {item.sources?.length > 0 && (
        <section className="sources">
          <h2>Sources & evidence</h2>
          <ol>
            {item.sources.map((s, i) => (
              <li key={i}>
                {s.title || s.url}{" "}
                {s.url && (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    Open source ↗
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="method-note">
        This report reflects the evidence available at the time of publication.
        Contact the editorial desk to suggest a correction or provide additional evidence.
      </p>
    </article>
  );
}
