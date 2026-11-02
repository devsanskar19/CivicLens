
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const empty = {
  type: "factcheck",
  title: "",
  summary: "",
  body: "",
  category: "General",
  imageUrl: "",
  verdict: "Unverified",
  claim: "",
  sourcesText: "",
  status: "draft"
};

export default function ContentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    api.get("/content/admin/all")
      .then(({ data }) => {
        const item = data.items.find(x => x._id === id);

        if (!item) {
          setError("Content not found.");
          return;
        }

        setForm({
          ...item,
          sourcesText: (item.sources || [])
            .map(s => `${s.title || ""}|${s.url || ""}`)
            .join("\n")
        });
      })
      .catch(e => {
        setError(e.response?.data?.message || "Could not load content.");
      });
  }, [id]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  function update(key, value) {
    setForm(old => ({ ...old, [key]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, WEBP or GIF image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const sources = (form.sourcesText || "")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [title, ...rest] = line.split("|");

        return {
          title: title.trim(),
          url: rest.join("|").trim()
        };
      });

    const payload = new FormData();

    payload.append("type", form.type);
    payload.append("title", form.title);
    payload.append("summary", form.summary);
    payload.append("body", form.body);
    payload.append("category", form.category || "General");
    payload.append("verdict", form.verdict || "");
    payload.append("claim", form.claim || "");
    payload.append("status", form.status);
    payload.append("sources", JSON.stringify(sources));

    if (selectedImage) {
      payload.append("image", selectedImage);
    }

    try {
      if (id) {
        await api.put(`/content/${id}`, payload);
      } else {
        await api.post("/content", payload);
      }

      navigate("/admin");
    } catch (e) {
      setError(
        e.response?.data?.message || "Could not save content."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-section narrow-admin">
      <Link to="/admin" className="back-link">
        ← Dashboard
      </Link>

      <span className="section-kicker">EDITORIAL DESK</span>

      <h1>{id ? "Edit content" : "Create content"}</h1>

      <form className="editor-form" onSubmit={submit}>
        {error && <div className="notice error">{error}</div>}

        <label>
          Content type
          <select
            value={form.type}
            onChange={e => update("type", e.target.value)}
          >
            <option value="factcheck">Fact Check</option>
            <option value="media-analysis">
              Satire vs News / Media Analysis
            </option>
            <option value="research">Research Report</option>
          </select>
        </label>

        <label>
          Headline
          <input
            value={form.title}
            onChange={e => update("title", e.target.value)}
            maxLength="180"
            required
          />
        </label>

        <label>
          Short summary
          <textarea
            rows="2"
            value={form.summary}
            onChange={e => update("summary", e.target.value)}
            maxLength="500"
            required
          />
        </label>

        {form.type === "factcheck" && (
          <>
            <label>
              Claim being checked
              <textarea
                rows="3"
                value={form.claim || ""}
                onChange={e => update("claim", e.target.value)}
                placeholder="Write the exact claim and identify where it appeared."
              />
            </label>

            <label>
              Verdict
              <select
                value={form.verdict}
                onChange={e => update("verdict", e.target.value)}
              >
                <option>True</option>
                <option>False</option>
                <option>Misleading</option>
                <option>Unverified</option>
                <option>Satire</option>
              </select>
            </label>
          </>
        )}

        <label>
          Full article / investigation
          <textarea
            rows="12"
            value={form.body}
            onChange={e => update("body", e.target.value)}
            placeholder="Write your investigation. Separate paragraphs with a blank line."
            required
          />
        </label>

        <label>
          Category
          <input
            value={form.category || ""}
            onChange={e => update("category", e.target.value)}
            placeholder="Politics, Education, Media…"
          />
        </label>

        <label>
          Featured image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
          />
          <small>Choose JPG, PNG, WEBP or GIF. Maximum size: 5 MB.</small>
        </label>

        {previewUrl && (
          <div className="image-preview">
            <p>New image preview</p>
            <img
              src={previewUrl}
              alt="Selected image preview"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
          </div>
        )}

        {!previewUrl && form.imageUrl && (
          <div className="image-preview">
            <p>Current article image</p>
            <img
              src={
                form.imageUrl.startsWith("http")
                  ? form.imageUrl
                  : `http://localhost:8000${form.imageUrl}`
              }
              alt="Current article"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "10px"
              }}
            />
            <small>Select another image above to replace it.</small>
          </div>
        )}

        <label>
          Sources and evidence (one per line: title | URL)
          <textarea
            rows="5"
            value={form.sourcesText || ""}
            onChange={e => update("sourcesText", e.target.value)}
            placeholder={"Official notification | https://example.gov.in/document\nOriginal post | https://example.com/post"}
          />
        </label>

        <label>
          Publishing status
          <select
            value={form.status}
            onChange={e => update("status", e.target.value)}
          >
            <option value="draft">Save as draft</option>
            <option value="published">Publish now</option>
          </select>
        </label>

        <div className="form-actions">
          <button className="button" disabled={saving}>
            {saving
              ? "Saving…"
              : id
                ? "Save changes"
                : "Save content"}
          </button>

          <Link className="button button-outline" to="/admin">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
