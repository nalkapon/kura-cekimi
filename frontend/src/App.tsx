import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import './App.css';
// BracketPage (32-team legacy) removed

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-bold text-sm uppercase tracking-widest transition-colors app-link${isActive ? ' active' : ''}`;

const LANGUAGES: { code: string; label: string }[] = [
  // { code: 'tr', label: 'TR' },
  // { code: 'en', label: 'EN' },
  // { code: 'de', label: 'DE' },
];

function App() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <Router>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="app-nav">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
           
            </NavLink>

            <button
              className="app-nav-toggle"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>

            <div className={`flex gap-6 app-nav-links${mobileOpen ? ' open' : ''}`} style={{ alignItems: 'center' }}>
              <NavLink to="/" end className={navLinkClass} onClick={closeMobileMenu}>{t('nav.home')}</NavLink>
              <NavLink to="/sampiyonlar-ligi" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.championsLeague')}</NavLink>
              <NavLink to="/uefa-ligi" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.europaLeague')}</NavLink>
              <NavLink to="/konferans-ligi" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.conferenceLeague')}</NavLink>
              <NavLink to="/carkifelek" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.wheel')}</NavLink>
              <NavLink to="/kagit-cek" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.paperDraw')}</NavLink>
              <NavLink to="/zar-at" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.dice')}</NavLink>
              <NavLink to="/kart-karistir" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.cards')}</NavLink>
              <NavLink to="/tombala" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.tombala')}</NavLink>
              <NavLink to="/hali-saha" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.haliSaha')}</NavLink>
              <NavLink to="/vampir-koylu" className={navLinkClass} onClick={closeMobileMenu}>{t('nav.vampirKoylu')}</NavLink>
              {/*<NavLink to="/kazi-kazan" className={navLinkClass}>🪙 Kazi Kazan</NavLink> */}
              {/* Bracket/Dünya Kupası removed (legacy 32-team) */}

              <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => { i18n.changeLanguage(lng.code); closeMobileMenu(); }}
                    style={{
                      padding: '4px 10px', borderRadius: 9999, fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer',
                      border: i18n.language === lng.code ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.12)',
                      background: i18n.language === lng.code ? 'rgba(251,191,36,0.14)' : 'rgba(255,255,255,0.03)',
                      color: i18n.language === lng.code ? '#fbbf24' : '#94a3b8',
                    }}
                  >{lng.label}</button>
                ))}
              </div>
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