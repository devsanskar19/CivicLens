export default function About() {
  return <section className="section page-section about-page">
    <span className="section-kicker">WHO WE ARE</span><h1 className="page-title">A clearer view of public information.</h1>
    <p className="page-intro">CivicLens is a student-led platform concept focused on political fact-checking, media literacy and analysis of public political communication.</p>
    <div className="about-columns"><div><h2>Our mission</h2><p>Help readers examine political claims carefully, understand the difference between satire and factual reporting, and explore how public representatives communicate.</p></div><div><h2>Our standards</h2><ul><li>Show the original claim and link to evidence.</li><li>Prefer primary documents and direct sources.</li><li>Separate fact, allegation, opinion and interpretation.</li><li>Explain uncertainty rather than hiding it.</li><li>Correct mistakes transparently.</li><li>Provide a fair opportunity to respond to serious allegations.</li></ul></div></div>
    <div className="notice">CivicLens is independent of political parties. A verdict is based on the evidence reviewed, not the identity or political position of the person making a claim.</div>
    <h2>How to read our verdicts</h2><div className="verdict-guide"><p><b>True:</b> Supported by the evidence reviewed.</p><p><b>False:</b> Contradicted by reliable evidence.</p><p><b>Misleading:</b> Omits important context or presents information in a distorted way.</p><p><b>Unverified:</b> Available evidence is insufficient to establish accuracy.</p><p><b>Satire:</b> Presented as humour or parody, not a factual report.</p></div>
  </section>;
}
