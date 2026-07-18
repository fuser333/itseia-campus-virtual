"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types/database";
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  GraduationCap,
  Home,
} from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email || "" });

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
        }
      }

      setLoading(false);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
        });
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/login");
    router.refresh();
  }

  const authenticatedLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/courses",
      label: "Mis Cursos",
      icon: BookOpen,
    },
    {
      href: "/ai-lab",
      label: "AI Lab",
      icon: FlaskConical,
    },
    {
      href: "/profile",
      label: "Perfil",
      icon: User,
    },
  ];

  const publicLinks = [
    {
      href: "/",
      label: "Inicio",
      icon: Home,
    },
    {
      href: "/#programs",
      label: "Carreras",
      icon: GraduationCap,
    },
    {
      href: "/login",
      label: "Ingresar",
      icon: LogIn,
    },
  ];

  const navLinks = user ? authenticatedLinks : publicLinks;

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-lg bg-yellow flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Brain className="w-5 h-5 text-navy-dark" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-none font-[family-name:var(--font-space-grotesk)]">
                  ITSEIA
                </span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5 hidden sm:block">
                  Academy
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
                        ? "bg-yellow/10 text-yellow"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {!loading && user && (
                <div className="hidden md:flex items-center gap-3">
                  {/* User info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-semibold text-yellow font-[family-name:var(--font-space-grotesk)]">
                        {profile?.full_name
                          ? profile.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : user.email.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs font-medium leading-none truncate max-w-[120px]">
                        {profile?.full_name || user.email}
                      </p>
                      {profile?.role && (
                        <p className="text-[10px] text-muted-foreground leading-none mt-1 capitalize">
                          {profile.role.replace("_", " ")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Logout button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-coral hover:bg-coral/10"
                    aria-label="Cerrar sesion"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!loading && !user && (
                <Link href="/login" className="hidden md:block">
                  <Button className="h-9 px-4 bg-yellow hover:bg-yellow-hover text-navy-dark font-semibold text-sm">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Ingresar
                  </Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
                aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-white/[0.06] animate-fade-in">
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
                      ? "bg-yellow/10 text-yellow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {user && (
              <>
                <div className="border-t border-white/[0.06] my-2" />
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-semibold text-yellow font-[family-name:var(--font-space-grotesk)]">
                        {profile?.full_name
                          ? profile.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : user.email.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {profile?.full_name || user.email}
                      </p>
                      {profile?.role && (
                        <p className="text-xs text-muted-foreground capitalize">
                          {profile.role.replace("_", " ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-coral hover:bg-coral/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
