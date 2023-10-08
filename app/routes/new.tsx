import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

const prisma = new PrismaClient();

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = {
    displayName: String(formData.get("displayName")),
    email: String(formData.get("email")),
  };
  // Aquí podemos validar con zod @TODO
  const id = formData.get("id");
  if (id) {
    await prisma.user.update({
      where: { id: String(id) },
      data,
    });
  } else {
    await prisma.user.create({ data }); // podríamos capturar un error con try
  }
  return { ok: true }; // Siempre devuelve por lo menos null en un action
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) return { email: "", displayName: "", id: null };
  const user = await prisma.user.findUnique({ where: { email } });
  // @TODO Validar que el usuario exista o 404
  return user ?? { email: "", displayName: "", id: null };
};

export default function Index() {
  const { email, displayName, id } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200">
      <Form
        method="post"
        className="min-w-[320px] bg-white shadow rounded-xl pt-8 pb-6 px-6"
      >
        <input type="hidden" name="id" value={id ?? undefined} />
        <TextField
          placeholder="Tu nombre"
          name="displayName"
          label="Nombre de usuario"
          defaultValue={displayName ?? ""}
        />
        <TextField
          placeholder="Tu correo"
          name="email"
          label="Correo"
          defaultValue={email}
        />
        <button
          className="mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 rounded-lg w-full hover:from-indigo-600 hover:to-blue-600"
          type="submit"
        >
          Actualizar
        </button>
      </Form>

      {/* Toast */}
      {actionData?.ok && (
        <div className="bg-green-200/50 py-4 px-8 rounded-xl absolute bottom-8 text-lg text-green-700">
          <p>✅ El usuario se ha guardado con éxito.</p>
        </div>
      )}
    </main>
  );
}

const TextField = ({
  name,
  placeholder,
  label,
  defaultValue,
}: {
  defaultValue?: string;
  name: string;
  placeholder?: string;
  label: string;
}) => {
  return (
    <p className="grid gap-2 py-2">
      <label htmlFor={name}>{label}</label>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        type="text"
        name={name}
        className="border rounded-lg py-2 px-4"
      />
    </p>
  );
};
