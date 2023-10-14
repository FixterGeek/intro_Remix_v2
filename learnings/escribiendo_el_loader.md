# Escribiendo el loader de la ruta

Es momento de escribir el `loader`. 🥳

Regularmente en un tutorial de **Remix** se comienza con el `loader` porque es más fácil de entender, pues carga los datos para que el componente los utilice.

Pero yo quise comenzar con la función `action`, por eso hemos generado primero los datos que, ahora, podemos consumir en el `loader`. 🤭

```jsx
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url); // se parsean los searchParams
  const email = url.searchParams.get("email"); // conseguimos la variable
  if (!email) return { email: "", displayName: "" }; // default
  const user = await prisma.user.findUnique({ where: { email } }); // conseguimos al usuario desde la DB
  // @TODO Validar que el usuario exista o 404
  return user ?? { email: "", displayName: "" }; // user o el default
};
```

Lo que hacemos en el loader es verificar si existe una variable en la `url` que se llame `email`, en caso de que no, devolvemos un objeto con vacíos, pero si el _email_ está presente, entonces **buscamos al usuario en la base de datos y lo entregamos al cliente**.

De esta forma, **estamos usando la base de datos desde el servidor como un estado para nuestra aplicación;** _State Management_ dirigido 100% por el servidor. 🤯 Ahora usemos los datos que loader ha conseguido en nuestro componente del cliente.

## Consiguiendo los datos con useLoaderData

En el componente podemos tener acceso a los datos que el `loader` ha conseguido (o creado) a través del _Hook_ `useLoaderData()`.

```jsx
//...

const { email, displayName, id } = useLoaderData<typeof loader>();

// ...
```

Por favor pasa el mouse sobre la variable `email` y la variable `displayName`, te darás cuenta de que tienes los tipos perfectamente alineados, los mismos tipos que genera el servidor, los utiliza el cliente. _End to end type safety._ **Esto es difícil de conseguir en otros frameworks pero en Remix es automático**.

Ahora vamos a usar estos datos que vienen del servidor como valores por _default_ en nuestro formulario:

```jsx
// app/routes/new.tsx

// ...

const { email, displayName } = useLoaderData<typeof loader>();

// ...

<TextField
  placeholder="Tu nombre"
  name="displayName"
  label="Nombre de usuario"
  defaultValue={displayName ?? ''}
/>
<TextField
  placeholder="Tu correo"
  name="email"
  label="Correo"
  defaultValue={email}
/>

// ...
```

Vamos a probarlo.

## Probando el loader

Yo he creado un usuario con el correo [fixtergeek@gmail.com](mailto:fixtergeek@gmail.com), así que lo usaré en la variable de la ruta:

```jsx
http://localhost:3000/new?email=fixtergeek@gmail.com
```

Deberías ver el formulario pre rellenado con todos los datos del usuario. 🤯

![](https://i.imgur.com/Pgw8HC5.png)

**Esta es una gran manera de explotar el ruteo natural del navegador y usar el servidor web de forma inteligente en lugar de ignorarlo creando el app en el cliente únicamente. 🧠**

## Ultimos retoques

Vamos a terminar nuestra mini aplicación, asegurándonos de verdaderamente editar a un usuario existente y **no crear duplicados**. 🫧

```jsx
// ...

const { email, displayName, id } = useLoaderData<typeof loader>();

// ...

<form
	method="post"
	className="min-w-[320px] bg-white shadow rounded-lg pt-8 pb-6 px-6"
>
<input type="hidden" name="id" value={id} />

// ...
```

Vamos a agregar un _input_ invisible con el `id` que el `loader` nos entregó dentro del formulario, así lo estamos añadiendo también al _formData_ que recibirá el `action`. 🤯

Ahora el action buscará el `id` y si no es `null` o `undefined`, **actualizará un usuario existente**, de lo contrario se creará uno nuevo. 🤖

## Escribiendo el código del servidor

Modificaremos nuestra función `action` para que decida a partir del `id`, si se debe actualizar un usuario o crear uno nuevo: 🚏

```jsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = {
    displayName: String(formData.get("displayName")),
    email: String(formData.get("email")),
  };
  // Aquí podemos validar con zod @TODO
  const id = formData.get("id");
  if (id) {
    // Aquí está el algoritmo 🤭
    await prisma.user.update({
      where: { id: Number(id) },
      data,
    });
  } else {
    await prisma.user.create({ data }); // @TODO: Podríamos capturar un error con try
  }
  return { ok: true }; // Siempre devuelve por lo menos null en un action
};
```

¡Mira nomás que chulada! ¿Apoco no se divierte uno? ¡Anda ve a probarlo!

Ahora ya podemos editar a nuestros usuarios y crear nuevos, **¡en la misma ruta!** Gracias a los **searchParams**. 🤯

> 😎 Reto: ¿Podrías **crear una nueva ruta y colocar una _table_ con todos los usuarios** con enlaces que lleven a esta ruta para **editarlos**?

### Has conseguido crear una mini aplicación _Fullstack_ utilizando las herramientas fundamentales de **Remix 💽**

Y te has dado cuenta lo rápido que puedes crear aplicaciones completas, veloces, eficientes, utilizando ¡herramientas nativas del navegador! 🔥

Pero esto no es todo, ahora que nuestra aplicación está lista, es hora de convertirla en **un solo archivo js**, para colocarlo en producción con **Netlify** y de paso, crear una base de datos en la nube. ¡Vamos! 🚀

Abrazo.

Bliss. 🤓
