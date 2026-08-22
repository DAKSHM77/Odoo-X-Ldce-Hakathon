import { Globe, Map, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Navbar
 * Top navigation bar shared across the application.
 * Uses Tailwind CSS for all styling.
 * No routing dependencies added yet (links are plain anchors).
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Dashboard',  href: '#dashboard'  },
    { label: 'My Trips',   href: '#trips'       },
    { label: 'Itinerary',  href: '#itinerary', active: true },
    { label: 'Budget',     href: '#budget'      },
    { label: 'Calendar',   href: '#calendar'    },
  ]

  return (
    <header id="main-navbar" className="sticky top-0 z-50 w-full">
      {/* Glass-morphism bar */}
      <div className="
        bg-white/80 backdrop-blur-md
        border-b border-gray-200/70
        shadow-sm
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Brand ── */}
            <a
              href="#"
              id="navbar-brand"
              className="flex items-center gap-2 group"
              aria-label="GlobeTrotter home"
            >
              <div className="
                w-9 h-9 rounded-xl
                bg-gradient-to-br from-indigo-500 to-cyan-500
                flex items-center justify-center shadow-md
                group-hover:scale-105 transition-transform duration-200
              ">
                <Globe size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg tracking-tight">
                Globe<span className="text-indigo-600">Trotter</span>
              </span>
            </a>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${link.active
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }
                  `}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* ── Desktop Right Actions ── */}
            <div className="hidden md:flex items-center gap-3">
              <button
                id="navbar-new-trip-btn"
                type="button"
                className="
                  flex items-center gap-1.5
                  px-4 py-2 rounded-xl
                  bg-gradient-to-r from-indigo-500 to-cyan-500
                  text-white text-sm font-semibold shadow
                  hover:shadow-md hover:opacity-90
                  transition-all duration-200
                "
              >
                <Map size={15} />
                New Trip
              </button>
              <button
                id="navbar-profile-btn"
                type="button"
                className="
                  w-9 h-9 rounded-full
                  bg-gray-100 hover:bg-indigo-100
                  flex items-center justify-center
                  text-gray-600 hover:text-indigo-600
                  transition-colors duration-200
                "
                aria-label="User profile"
              >
                <User size={17} />
              </button>
            </div>

            {/* ── Mobile Menu Toggle ── */}
            <button
              id="navbar-mobile-menu-btn"
              type="button"
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown ── */}
        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
          >
            <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    px-4 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${link.active
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }
                  `}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-1">
                <button
                  type="button"
                  className="
                    w-full flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-indigo-500 to-cyan-500
                    text-white text-sm font-semibold
                  "
                >
                  <Map size={15} /> New Trip
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
