import { useEffect, useState } from "react";

function Departamentos() {
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = departamentos.filter((d) =>
  d.name.toLowerCase().includes(busqueda.toLowerCase())
);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch("https://api-colombia.com/api/v1/Department");
        if (!res.ok) throw new Error("Error al consultar la API");
        const data = await res.json();
        setDepartamentos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
  <div>
    <input
      placeholder="Buscar departamento..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
    <ul>
      {filtrados.map((d) => (
        <li key={d.id}>{d.name}</li>
      ))}
    </ul>
  </div>
);
}

export default Departamentos;