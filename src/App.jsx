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
import IAHub from './pages/IAHub';
import EEHub from './pages/EEHub';
import TOKHub from './pages/TOKHub';
import CASHub from './pages/CASHub';
import TaskManager from './pages/TaskManager';
import SubjectList from './pages/SubjectList';
import SubjectPage from './pages/SubjectPage';
import PastPaperPractice from './pages/PastPaperPractice';
import CommandTerms from './pages/CommandTerms';
import DailyReview from './pages/DailyReview';
import StudyPlanner from './pages/StudyPlanner';
import ProgressAnalytics from './pages/ProgressAnalytics';
import Templates from './pages/Templates';
import CASProgress from './pages/CASProgress';
import Search from './pages/Search';
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
          <Route path="tasks" element={<TaskManager />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/:id" element={<SubjectPage />} />
          <Route path="past-papers" element={<PastPaperPractice />} />
          <Route path="command-terms" element={<CommandTerms />} />
          <Route path="daily-review" element={<DailyReview />} />
          <Route path="study-planner" element={<StudyPlanner />} />
          <Route path="analytics" element={<ProgressAnalytics />} />
          <Route path="templates" element={<Templates />} />
          <Route path="cas-progress" element={<CASProgress />} />
          <Route path="search" element={<Search />} />
          <Route path="ia" element={<IAHub />} />
          <Route path="ee" element={<EEHub />} />
          <Route path="tok" element={<TOKHub />} />
          <Route path="cas" element={<CASHub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
