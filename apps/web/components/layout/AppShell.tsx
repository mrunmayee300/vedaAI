"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpen, Home, Library, Menu, Plus, Settings, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const nav = [
  { href: "/assignments", label: "Home", icon: Home },
  { href: "/groups", label: "My Groups", icon: Users },
  { href: "/assignments", label: "Assignments", icon: BookOpen },
  { href: "/toolkit", label: "AI Teacher's Toolkit", icon: Sparkles },
  { href: "/library", label: "My Library", icon: Library },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#eeeeee] p-0 text-foreground md:p-8">
      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-4 md:min-h-[calc(100vh-4rem)]">
        <aside className="hidden w-[245px] shrink-0 rounded-[1.35rem] bg-white p-5 shadow-soft md:flex md:flex-col">
          <Logo />
          <Button asChild variant="default" className="mt-10 border border-primary/60 shadow-glow">
            <Link href="/assignments/new">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Link>
          </Button>

          <nav className="mt-10 space-y-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition",
                    active && "bg-zinc-100 text-zinc-950",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.label === "Assignments" && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">32</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Link className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-zinc-500" href="/settings">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-zinc-100 p-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-sm font-black text-primary">
                DPS
              </div>
              <div>
                <p className="text-sm font-bold">Delhi Public School</p>
                <p className="text-xs text-zinc-500">Bokaro Steel City</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col pb-24 md:pb-0">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/70 bg-white/90 px-4 backdrop-blur md:static md:mb-4 md:rounded-2xl md:border md:px-5 md:shadow-sm">
            <div className="md:hidden">
              <Logo />
            </div>
            <div className="hidden items-center gap-2 text-sm text-zinc-500 md:flex">
              <span className="text-lg">←</span>
              <span className="grid h-5 w-5 place-items-center rounded bg-zinc-100 text-xs">⌘</span>
              <span>Assignment</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div className="h-8 w-8 rounded-full bg-[linear-gradient(135deg,#ffb26b,#1f2937)]" />
              <span className="hidden text-sm font-semibold md:inline">John Doe</span>
              <Menu className="h-5 w-5 md:hidden" />
            </div>
          </header>
          {children}
        </main>
      </div>

      <Link
        href="/assignments/new"
        className="fixed bottom-24 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-white text-primary shadow-soft md:hidden"
      >
        <Plus className="h-5 w-5" />
      </Link>

      <nav className="fixed bottom-3 left-3 right-3 z-40 grid grid-cols-4 rounded-[1.35rem] bg-zinc-950 px-3 py-3 text-[10px] font-semibold text-zinc-500 shadow-soft md:hidden">
        {nav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} className={cn("flex flex-col items-center gap-1", active && "text-white")}>
              <Icon className="h-4 w-4" />
              {item.label.replace("My ", "")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
