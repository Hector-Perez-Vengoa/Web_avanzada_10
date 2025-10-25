import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { RMCharacter, RMListResponse } from '@/types/rick-and-morty';

export const revalidate = 864000; // ISR: 10 días (valor literal requerido por Next)

interface PageProps {
  params: { slug: string } | Promise<{ slug: string }>;
}

async function getCharacterById(id: string): Promise<RMCharacter | null> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { cache: 'force-cache' });
  if (!res.ok) return null;
  return res.json();
}

async function getCharacterByName(name: string): Promise<RMCharacter | null> {
  const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`, { cache: 'force-cache' });
  if (!res.ok) return null;
  const data: RMListResponse = await res.json();
  const exact = (data.results || []).find(c => c.name.toLowerCase() === name.toLowerCase());
  return exact ?? data.results?.[0] ?? null;
}

async function getAllCharacters(): Promise<RMCharacter[]> {
  const first = await fetch('https://rickandmortyapi.com/api/character', { cache: 'force-cache' });
  if (!first.ok) return [];
  const firstData: RMListResponse = await first.json();
  const pages = firstData.info.pages;
  const all: RMCharacter[] = [...firstData.results];

  // Cargar el resto de páginas en paralelo
  const promises: Promise<Response>[] = [];
  for (let p = 2; p <= pages; p++) {
    promises.push(fetch(`https://rickandmortyapi.com/api/character?page=${p}`, { cache: 'force-cache' }));
  }
  const responses = await Promise.all(promises);
  for (const res of responses) {
    if (!res.ok) continue;
    const data: RMListResponse = await res.json();
    all.push(...data.results);
  }
  return all;
}

export async function generateStaticParams() {
  // Genera rutas estáticas tanto por id como por nombre para todos los personajes
  const all = await getAllCharacters();
  const byId = all.map((c) => ({ slug: String(c.id) }));
  const byName = all.map((c) => ({ slug: c.name }));
  return [...byId, ...byName];
}

export async function generateMetadata({ params }: Readonly<PageProps>): Promise<Metadata> {
  const { slug } = await params;
  const char = /^(\d+)$/.test(slug)
    ? await getCharacterById(slug)
    : await getCharacterByName(slug);

  if (!char) return { title: 'Personaje no encontrado' };

  return {
    title: `${char.name} - Rick & Morty`,
    description: `${char.name} • ${char.species} • ${char.status}`,
    openGraph: { images: [char.image] },
  };
}

export default async function CharacterDetailPage({ params }: Readonly<PageProps>) {
  const { slug } = await params;
  const character = /^(\d+)$/.test(slug)
    ? await getCharacterById(slug)
    : await getCharacterByName(slug);

  if (!character) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
          <p className="text-slate-300 mb-6">{character.species} • {character.status} • {character.gender}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">ID</p>
              <p>{character.id}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Species</p>
              <p>{character.species || '—'}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Type</p>
              <p>{character.type || '—'}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Status</p>
              <p>{character.status}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Gender</p>
              <p>{character.gender}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Origin</p>
              <p>{character.origin?.name || '—'}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Location</p>
              <p>{character.location?.name || '—'}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow">
              <p className="font-semibold">Created</p>
              <p>{new Date(character.created).toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow sm:col-span-2">
              <p className="font-semibold mb-2">Episodes</p>
              <div className="flex flex-wrap gap-2">
                {character.episode.map((ep) => (
                  <span key={ep} className="text-xs rounded-full bg-slate-100 px-2 py-1">{ep.split('/').pop()}</span>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-white text-slate-800 p-4 shadow sm:col-span-2">
              <p className="font-semibold">API URL</p>
              <a className="text-emerald-700 underline break-all" href={character.url} target="_blank" rel="noopener noreferrer">{character.url}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
