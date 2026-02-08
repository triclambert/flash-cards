import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeckList from './pages/DeckList';
import DeckEditor from './pages/DeckEditor';
import StudyMode from './pages/StudyMode';
import GuideList from './pages/GuideList';
import GuideEditor from './pages/GuideEditor';
import GuideViewer from './pages/GuideViewer';
import TestList from './pages/TestList';
import TestEditor from './pages/TestEditor';
import TestTaker from './pages/TestTaker';
import About from './pages/About';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="decks" element={<DeckList />} />
          <Route path="decks/:id" element={<DeckEditor />} />
          <Route path="decks/:id/study" element={<StudyMode />} />
          <Route path="guides" element={<GuideList />} />
          <Route path="guides/:id" element={<GuideEditor />} />
          <Route path="guides/:id/view" element={<GuideViewer />} />
          <Route path="tests" element={<TestList />} />
          <Route path="tests/:id" element={<TestEditor />} />
          <Route path="tests/:id/take" element={<TestTaker />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
