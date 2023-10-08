import { Link } from "@remix-run/react";

export default () => (
  <main className="flex min-h-screen items-center justify-center">
    <Link to="/new" className="underline">
      <h1>Nuevo usuario</h1>
    </Link>
  </main>
);
