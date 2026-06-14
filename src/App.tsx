import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import NewSplit from './routes/NewSplit'
import SplitDetail from './routes/SplitDetail'
import { useApplyTheme, useThemeStore } from './store/useThemeStore'
import {
  CoffeeBeanBg,
} from './components/shared/Illustrations'
import { DesktopSidebar } from './components/shared/DesktopSidebar'
import { MobileHeader } from './components/shared/MobileHeader'

function Shell() {
  useApplyTheme()
  const isDark = useThemeStore((s) => s.isDark)

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: 'var(--bg-base)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Desktop ambient background */}
      <div className="hidden lg:block">
        <CoffeeBeanBg />
      </div>
      <div
        className="fixed inset-0 pointer-events-none hidden lg:block"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(212,163,115,0.05) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(139,90,60,0.04) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 50% at 20% 10%, rgba(139,90,60,0.05) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(160,82,45,0.04) 0%, transparent 70%)',
        }}
      />

      <DesktopSidebar />

      <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:py-8 min-h-screen">
        <div
          className="relative flex flex-col w-full lg:rounded-3xl lg:overflow-hidden"
          style={{ maxWidth: 480 }}
        >
          <div
            className="hidden lg:block absolute inset-0 rounded-3xl pointer-events-none z-10"
            style={{
              boxShadow: isDark
                ? '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,235,224,0.06)'
                : '0 32px 80px rgba(43,24,16,0.18), 0 0 0 1px rgba(43,24,16,0.08)',
            }}
          />

          <div
            className="relative flex flex-col w-full min-h-screen lg:min-h-0 lg:max-h-[860px] lg:rounded-3xl lg:overflow-hidden"
            style={{ backgroundColor: 'var(--bg-base)' }}
          >
            <MobileHeader />

            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new" element={<NewSplit />} />
                <Route path="/split/:id" element={<SplitDetail />} />
              </Routes>
            </main>
          </div>
        </div>

        <p className="hidden lg:block text-xs text-muted-foreground mt-5 opacity-50">
          SplitStruk · 100% client-side · No tracking
        </p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
