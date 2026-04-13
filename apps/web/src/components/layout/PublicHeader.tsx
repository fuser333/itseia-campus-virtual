"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, Award, Building2, Users, Home, Menu, X, UserPlus, Rocket, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/carreras-info", label: "Carreras", icon: GraduationCap },
  { href: "/preuni-info", label: "Preuni", icon: Rocket },
  { href: "/cursos-pro-info", label: "Cursos Pro", icon: BookOpen },
  { href: "/certificaciones-info", label: "Certificaciones", icon: Award },
  { href: "/docentes-info", label: "Docentes", icon: Users },
  { href: "/empresas-info", label: "Empresas", icon: Building2 },
  { href: "/demo-info", label: "Demo", icon: Sparkles },
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
            {/* ITSEIA Logo real */}
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: "rgba(255,255,255,0.95)", padding: "4px 6px", borderRadius: "8px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo_itseia.svg"
                alt="ITSEIA"
                className="h-7 w-auto"
              />
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

          {/* Right: Register */}
          <div className="flex items-center gap-2">
            <a
              href="https://itseia.ai/meet/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#FBBC0C] hover:bg-[#E5AB00] text-[#0A1628] px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Charla Sábados</span>
            </a>

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
