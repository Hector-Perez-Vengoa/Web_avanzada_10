'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RMCharacter, RMListResponse } from '@/types/rick-and-morty';

interface Filters {
  name: string;
  status: '' | 'alive' | 'dead' | 'unknown';
  type: string;
  gender: '' | 'female' | 'male' | 'genderless' | 'unknown';
}

const initialFilters: Filters = { name: '', status: '', type: '', gender: '' };

function toQuery(f: Filters) {
  const params = new URLSearchParams();
  if (f.name) params.set('name', f.name);
  if (f.status) params.set('status', f.status);
  if (f.type) params.set('type', f.type);
  if (f.gender) params.set('gender', f.gender);
  return params.toString();
}

export default function CharactersSearchPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RMCharacter[]>([]);

  const query = useMemo(() => toQuery(filters), [filters]);

  // Debounce sencillo
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query
          ? `https://rickandmortyapi.com/api/character?${query}`
          : 'https://rickandmortyapi.com/api/character';
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se pudo obtener resultados');
        const data: RMListResponse = await res.json();
        if (!active) return;
        setResults(data.results ?? []);
      } catch {
        if (!active) return;
        setResults([]);
        setError('Sin resultados o error en la búsqueda');
      } finally {
        if (active) setLoading(false);
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Búsqueda en tiempo real (CSR)</h1>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Nombre..."
          className="rounded-md px-3 py-2 bg-white text-slate-800 shadow"
          value={filters.name}
          onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
        />
        <select
          className="rounded-md px-3 py-2 bg-white text-slate-800 shadow"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as Filters['status'] }))}
        >
          <option value="">Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
        <input
          type="text"
          placeholder="Type..."
          className="rounded-md px-3 py-2 bg-white text-slate-800 shadow"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        />
        <select
          className="rounded-md px-3 py-2 bg-white text-slate-800 shadow"
          value={filters.gender}
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value as Filters['gender'] }))}
        >
          <option value="">Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>
      </form>

      {loading && <p className="text-slate-300">Buscando...</p>}
      {error && !loading && <p className="text-rose-400">{error}</p>}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((ch) => (
          <Link key={ch.id} href={`/characters/${encodeURIComponent(String(ch.id))}`} className="group">
            <article className="rounded-xl bg-white text-slate-800 shadow hover:shadow-lg transition overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={ch.image}
                  alt={ch.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg group-hover:text-emerald-600 transition-colors">{ch.name}</h2>
                <p className="text-sm text-slate-600">{ch.species} • {ch.status}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
