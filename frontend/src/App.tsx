import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CompetitionHubPage from './pages/CompetitionHubPage';
import CompetitionTeamRoute from './pages/CompetitionTeamRoute';
import CompetitionFullRoute from './pages/CompetitionFullRoute';
import WheelPage from './pages/Wheelpage';
import PaperDrawPage from './pages/PaperDrawPage';
import DicePage from './pages/DicePage';
import CardDrawPage from './pages/CardDrawPage';
import TombalaPage from './pages/Tombalapage';
import HaliSahaTeamBuilderPage from './pages/HaliSahaTeamBuilderPage';
import VampirKoyluPage from './pages/VampirKoyluPage';
import KaziKazanPage from './pages/KaziKazanPage';
import './App.css';
// BracketPage (32-team legacy) removed

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-bold text-sm uppercase tracking-widest transition-colors app-link${isActive ? ' active' : ''}`;

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="app-nav">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
              <span className="text-3xl app-brand-ball">⚽</span>
              <h1 className="text-xl font-black tracking-wide app-brand-title">Kura Simülatörü</h1>
            
            </NavLink>
            <div className="flex gap-6 app-nav-links">
              <NavLink to="/" end className={navLinkClass}>🏠 Ana Sayfa</NavLink>
              <NavLink to="/sampiyonlar-ligi" className={navLinkClass}>🏆 Şampiyonlar Ligi</NavLink>
              <NavLink to="/uefa-ligi" className={navLinkClass}>🥈 UEFA Ligi</NavLink>
              <NavLink to="/konferans-ligi" className={navLinkClass}>🥉 Konferans Ligi</NavLink>
              <NavLink to="/carkifelek" className={navLinkClass}>🎡 Çarkıfelek</NavLink>
              <NavLink to="/kagit-cek" className={navLinkClass}>🎫 Kağıt Çek</NavLink>
              <NavLink to="/zar-at" className={navLinkClass}>🎲 Zar At</NavLink>
              <NavLink to="/kart-karistir" className={navLinkClass}>🃏 Kart Karıştır</NavLink>
              <NavLink to="/tombala" className={navLinkClass}>🎱 Tombala</NavLink>
              <NavLink to="/hali-saha" className={navLinkClass}>👥 Hali Saha</NavLink>
              <NavLink to="/vampir-koylu" className={navLinkClass}>🦇 Vampir Koylu</NavLink>
              {/*<NavLink to="/kazi-kazan" className={navLinkClass}>🪙 Kazi Kazan</NavLink> */}
              {/* Bracket/Dünya Kupası removed (legacy 32-team) */}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Lig hub sayfaları: /sampiyonlar-ligi, /uefa-ligi, /konferans-ligi */}
          <Route path="/:slug" element={<CompetitionHubPage />} />
          <Route path="/:slug/takim" element={<CompetitionTeamRoute />} />
          <Route path="/:slug/tum-kura" element={<CompetitionFullRoute />} />

          {/* Genel kura araçları */}
          <Route path="/carkifelek" element={<WheelPage />} />
          <Route path="/kagit-cek" element={<PaperDrawPage />} />
          <Route path="/zar-at" element={<DicePage />} />
          <Route path="/kart-karistir" element={<CardDrawPage />} />
          <Route path="/tombala" element={<TombalaPage />} />
          <Route path="/hali-saha" element={<HaliSahaTeamBuilderPage />} />
          <Route path="/vampir-koylu" element={<VampirKoyluPage />} />
          {/*<Route path="/kazi-kazan" element={<KaziKazanPage />} /> */}

          {/* Eski linkler kırılmasın diye yönlendirme */}
          <Route path="/draw" element={<Navigate to="/sampiyonlar-ligi/takim" replace />} />
          <Route path="/draw-all" element={<Navigate to="/sampiyonlar-ligi/tum-kura" replace />} />

          {/* Bracket route removed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;