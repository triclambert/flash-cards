import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Layers, ClipboardList, Home, User } from 'lucide-react';

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
