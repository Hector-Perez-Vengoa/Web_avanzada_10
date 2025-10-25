import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rick & Morty - Personajes",
  description: "Listado y detalle de personajes usando SSR/SSG/ISR en Next.js",
};

export default function CharactersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur supports-backdrop-filter:bg-slate-900/60 bg-slate-900/80">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/characters" className="text-xl font-bold hover:text-emerald-400 transition-colors">
            Rick & Morty
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-emerald-400">Inicio</Link>
            <Link href="/characters" className="hover:text-emerald-400">Personajes</Link>
            <Link href="/characters/search" className="hover:text-emerald-400">Búsqueda (CSR)</Link>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
