"use client"

import React, { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};

function setGlobalPokemonError(payload: Record<string, unknown>) {
    try {
      // usamos globalThis y un tipo genérico para evitar any
      (globalThis as unknown as Record<string, unknown>).__POKEMON_ROUTE_ERROR__ = payload;
    } catch (err) {
      // Mostrar aviso si no se puede escribir en el global (algunos entornos lo restringen)
      // usamos el valor de err para evitar 'defined but never used'
      console.warn("[pokemon] no se pudo setear __POKEMON_ROUTE_ERROR__", err);
    }
}

export default function PokemonRouteError({ error, reset }: Props) {
  useEffect(() => {
    const payload = {
      message: error?.message ?? "Error desconocido",
      stack: error?.stack ?? "",
      time: new Date().toISOString(),
    };

    setGlobalPokemonError(payload);

  console.error("[pokemon] route error captured:", payload);
  }, [error]);

  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" }}>
      <h1 style={{ marginBottom: 8 }}>Ha ocurrido un error en Pokémon</h1>
      <p style={{ marginTop: 0, color: "#b91c1c" }}>{error?.message ?? "Error desconocido"}</p>

      <details style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
        <summary>Detalles del error</summary>
        <pre style={{ marginTop: 8, fontSize: 12 }}>{error?.stack}</pre>
      </details>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => reset()}
          style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
        >
          Intentar de nuevo
        </button>

        <button
          onClick={() => {
            const text = JSON.stringify({ message: error?.message, stack: error?.stack }, null, 2);
            if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(text);
            }
          }}
          style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
        >
          Copiar detalles
        </button>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, color: "#6b7280" }}>
        Nota: el objeto <code>window.__POKEMON_ROUTE_ERROR__</code> contiene la información del error y
        puede consultarse desde la consola del navegador.
      </p>
    </div>
  );
}
