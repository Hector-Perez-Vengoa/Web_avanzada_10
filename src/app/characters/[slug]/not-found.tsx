import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-3xl font-semibold mb-2">Personaje no encontrado</h2>
      <p className="text-slate-300 mb-6">No pudimos encontrar el personaje solicitado.</p>
      <Link href="/characters" className="underline hover:text-emerald-400">Volver al listado</Link>
    </div>
  );
}
