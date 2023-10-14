# Escribiendo el componente de la ruta

Abrimos el proyecto en nuestro editor de código favorito, por el momento yo me siento cómodo usando **VSCode**.

```jsx
$ code .
```

Nuestro proyecto posee varias carpetas, incluyendo `app` y dentro de esta: `routes`, aquí es donde está el componente de la ruta _home_ en el archivo `_index.tsx`.

```jsx
// app/routes/_index.tsx

export default function Index() {
  return <>Blissmo</>;
}
```

Borraremos el contenido de este archivo y agregaremos solo nuestro nombre por ahora.

Vamos a correr nuestro servidor desde **VSCode** abriendo la terminal y ejecutando de nuevo `npm run dev`.

Veremos nuestro nombre en el navegador. 🤯

## Maquetando un formulario

Nuestra página mostrará un formulario de edición, editaremos un usuario que vivirá en nuestra base de datos. Para eso creamos una nueva ruta llamada `new.tsx`.

```jsx
// app/routes/new.tsx

export default function Index() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200">
      <form
        method="post"
        className="min-w-[320px] bg-white shadow rounded-lg pt-8 pb-6 px-6"
      >
        <TextField
          placeholder="Tu nombre"
          name="displayName"
          label="Nombre de usuario"
        />
        <TextField placeholder="Tu correo" name="email" label="Correo" />
        <button
          className="mt-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 rounded-lg w-full hover:from-indigo-600 hover:to-blue-600"
          type="submit"
        >
          Actualizar
        </button>
      </form>
    </main>
  );
}

const TextField = ({
  name,
  placeholder,
  label,
  defaultValue,
}: {
  defaultValue?: string,
  name: string,
  placeholder?: string,
  label: string,
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
```

He construido un componente `<TextField>` para no repetir tanto código.

Toma nota del _name_ de cada _input_, este atributo es el más importante, pues **son las llaves del objeto que mandaremos** al servidor.

> 🤖 No dejes de notar que el formulario posee el atributo `method` con un valor de `post`: `<form method="post"`

## **405 Method Not Allowed**

**Esto es todo el maquetado de nuestra app.**

Si ahora mismo hacemos _submit_ del formulario, veremos un error `405`, pues aún no hemos implementado la función del servidor que se encargará de recibir los datos del formulario.

Para recibir los datos que el formulario recolectó, escribiremos en este mismo archivo una función con el nombre `action`.

Vamos a crearla en la siguiente lección. 🚀🪐

## El componente <Form> de Remix

Has visto que hemos usado una simple etiqueta `<form>` de **HTML** para enviar nuestro formulario, esto crea un refresh de la página, podemos evitar este _refresh_ sustituyendo esta etiqueta `<form>` por el componente `<Form>` de **Remix**.

```jsx
import { Form } from "@remix-run/react";

<Form
  method="post"
  className="min-w-[320px] bg-white shadow rounded-xl pt-8 pb-6 px-6"
>
```

Ahora este componente se encargará de evitar que la página se refresque, **convirtiendo el submit del form en asíncrono**. ¿No es genial? 🤩

Abrazo.

Bliss. 🤓

## Enlaces relacionados

Rutas Remix Docs

https://remix.run/docs/en/main/guides/api-routes#routes-are-their-own-api
