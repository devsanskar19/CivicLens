import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ContentList from "./pages/ContentList";
import Article from "./pages/Article";
import Politicians from "./pages/Politicians";
import Statements from "./pages/Statements";
import About from "./pages/About";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ContentEditor from "./pages/admin/ContentEditor";
import PoliticianManager from "./pages/admin/PoliticianManager";
import StatementManager from "./pages/admin/StatementManager";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/fact-checks" element={<ContentList type="factcheck" title="Fact Checks" />} />
        <Route path="/media-analysis" element={<ContentList type="media-analysis" title="Satire vs News" />} />
        <Route path="/research" element={<ContentList type="research" title="Research Reports" />} />
        <Route path="/article/:slug" element={<Article />} />
        <Route path="/politicians" element={<Politicians />} />
        <Route path="/statements" element={<Statements />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/content/new" element={<ProtectedRoute><ContentEditor /></ProtectedRoute>} />
        <Route path="/admin/content/:id" element={<ProtectedRoute><ContentEditor /></ProtectedRoute>} />
        <Route path="/admin/politicians" element={<ProtectedRoute><PoliticianManager /></ProtectedRoute>} />
        <Route path="/admin/statements" element={<ProtectedRoute><StatementManager /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
