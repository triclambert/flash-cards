import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  ClipboardList,
  Home,
  User,
  GraduationCap,
  FileCheck,
  Sigma,
  CalendarCheck,
  Clock,
} from 'lucide-react';

export default function Layout() {
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <Layers size={28} />
          <h1>StudyDeck</h1>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/decks">
              <Layers size={20} />
              <span>Flash Cards</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/daily-review">
              <Clock size={20} />
              <span>Daily Review</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/guides">
              <BookOpen size={20} />
              <span>Study Guides</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tests">
              <ClipboardList size={20} />
              <span>Practice Tests</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subjects">
              <GraduationCap size={20} />
              <span>Subjects</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/past-papers">
              <FileCheck size={20} />
              <span>Past Papers</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/command-terms">
              <Sigma size={20} />
              <span>Command Terms</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks">
              <CalendarCheck size={20} />
              <span>Deadlines</span>
            </NavLink>
          </li>
        </ul>
        <div className="nav-bottom">
          <ul className="nav-links">
            <li>
              <NavLink to="/about">
                <User size={20} />
                <span>About</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
