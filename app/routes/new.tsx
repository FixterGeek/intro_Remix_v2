import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { twMerge } from "tailwind-merge";

const prisma = new PrismaClient(); // 🤖 Agrega el cliente de la base de datos

export const action = async ({ request }: ActionFunctionArgs) => {
  // De donde sacamos los datos
  const formData = await request.formData(); // Sacamos el FormData del request ✅
  // @TODO: Validar
  const dataObject = {
    email: formData.get("email") as string,
    displayName: String(formData.get("displayName")),
  };

  // 🤖 Editando el usuario
  if (formData.get("id")) {
    await prisma.user.update({
      where: { id: String(formData.get("id")) },
      data: dataObject,
    });
    // validar que el usuario exista
    return { ok: true, message: "Usuario actualizado con exito 🥳" };
  }
  // 🤖 Guarda el usuario aquí <= your job 🔥
  try {
    await prisma.user.create({
      data: dataObject,
    });
    return { ok: true, message: undefined };
  } catch (error: unknown) {
    return { ok: false, message: undefined }; // Siempre devuelve por lo menos null en un action
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email)
    return { id: undefined, email: undefined, displayName: undefined }; // Negative first
  // 🤖 Consigue al usuario a partir de los Search Params
  const user = await prisma.user.findUnique({
    where: { email: String(email) },
  });
  if (!user) return { id: undefined, email: undefined, displayName: undefined };
  return user;
};

export default function Index() {
  // 🤖 Consigue los datos del loader
  const { email, displayName, id } = useLoaderData<typeof loader>();
  // 🤖 Consigue los datos del action (feedback)
  const actionData = useActionData<typeof action>(); // undefined | {ok:boolean}
  const navigation = useNavigation();

  // states
  const isDisabled = navigation.state !== "idle";
  //🤖 Agrega el id para la edición
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
          defaultValue={displayName} // 🤖 Agrega los valores por default
        />
        <TextField
          placeholder="Tu correo"
          name="email"
          label="Correo"
          defaultValue={email} // 🤖 Agrega los valores por default
        />
        <button
          disabled={isDisabled}
          className={twMerge(
            "mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 rounded-lg w-full hover:from-indigo-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-800"
          )}
          type="submit" // 👀 Esto es muy importante
        >
          {navigation.state !== "idle" ? "Cargando..." : "Guardar"}
        </button>
      </Form>

      {/* 🤖 Agrega el Toast aquí */}
      {actionData?.ok && (
        <p className="fixed bottom-4 rounded-lg p-4 bg-green-500 text-green-700">
          {actionData.message
            ? actionData.message
            : " ¡Usuario creado con exito! ✅"}
        </p>
      )}
      {actionData?.ok === false && (
        <p className="fixed top-8 rounded-lg p-4 bg-red-300 text-red-900">
          Este correo ya está en uso, 😵‍💫 prueba con otro
        </p>
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
