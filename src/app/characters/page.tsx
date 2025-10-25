import Image from "next/image";
import Link from "next/link";
import type { RMListResponse, RMCharacter } from "@/types/rick-and-morty";

// Forzamos que la ruta sea dinámica (SSR), pero la data principal se obtiene con cache: 'force-cache' (SSG-like)
export const dynamic = "force-dynamic";

async function getCharactersPage(page = 1): Promise<RMListResponse> {
  const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`,
    { cache: "force-cache" } // fuerza cache de Next (SSG para esta petición)
  );
  if (!res.ok) throw new Error("Error al cargar personajes");
  return res.json();
}

export default async function CharactersPage() {
  const data = await getCharactersPage(1); // primera página (20 personajes)
  const characters: RMCharacter[] = data.results;

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Personajes (SSR + fetch cacheado)</h1>
      <p className="text-slate-300 mb-8">La página se renderiza en el servidor, pero la llamada de datos usa cache forzada para demostrar SSG a nivel de fetch.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((ch) => (
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
                <div className="mt-3 flex gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-2 py-1">ID: {ch.id}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{ch.gender}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Link href="/characters/search" className="underline hover:text-emerald-400">Ir a búsqueda en tiempo real (CSR)</Link>
        <Link href="/characters" className="opacity-70 pointer-events-none">Página 1 de {data.info.pages}</Link>
      </div>
    </div>
  );
}
