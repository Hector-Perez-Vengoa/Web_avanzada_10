import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" }}>
      <h1>No encontrado</h1>
      <p>No se encontró contenido para esta ruta de Pokémon.</p>
      <p>Prueba volver al listado de Pokémon:</p>
      <Link href="/pokemon" style={{ color: "#0369a1", textDecoration: "underline" }}>
        Volver a Pokémon
      </Link>
    </div>
  );
}
