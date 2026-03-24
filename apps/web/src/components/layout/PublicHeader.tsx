"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, FlaskConical, Home, Menu, X, LogIn, UserPlus } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/carreras", label: "Carreras", icon: GraduationCap },
  { href: "/catalogo", label: "Catalogo", icon: BookOpen },
  { href: "/ai-lab", label: "AI Lab", icon: FlaskConical },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A1628]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#FBBC0C] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <span className="text-[#0A1628] font-bold text-sm leading-none">IT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-base font-bold tracking-tight leading-none font-[family-name:var(--font-space-grotesk)]">
                ITSEIA
              </span>
              <span className="text-[#73B8E7] text-[10px] font-medium uppercase tracking-widest leading-none mt-0.5 hidden sm:block">
                Tecnologico
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#FBBC0C]/10 text-[#FBBC0C]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Login / Register */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Ingresar</span>
            </Link>
            <Link
              href="/register"
              className="hidden md:flex items-center gap-1.5 bg-[#FBBC0C] hover:bg-[#E5AB00] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Inscribirme</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1628]/95 border-b border-white/[0.08]">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#FBBC0C]/10 text-[#FBBC0C]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-white/[0.08] pt-3 mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#FBBC0C] text-[#0A1628] hover:bg-[#E5AB00] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Inscribirme</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
