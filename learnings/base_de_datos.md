# Creando una base de datos con Prisma

Es hora de agregar una base de datos al proyecto. 💾 Usaremos dos en realidad. 😎

En esta ocasión, para comenzar rápido, no quiero agregar complejidad conectando con una base de datos en la nube, aún. El propósito de este proyecto es que puedas comenzar a crear aplicaciones _Fullstack_ con **Remix** lo antes posible, así que dejaremos las bases de datos para después y crearemos una base de datos provisional directamente en un archivo dentro de nuestro proyecto, con **SQLite**.

**Si quieres saber más sobre bases de datos y Remix, te dejo un [enlace](https://youtu.be/22Lt9MCRwwc) a un video.**

## SQLite

**SQLite** es una solución de _storage_ de alto rendimiento que presume de no dar problemas, “it just works”. Incluso se dice que es tan confiable que aunque existen mejores opciones, podríamos usarla en producción [si quisiéramos](https://www.notion.so/Search-with-full-text-3d2794af6292438794b3f284c4362e04?pvs=21). 🤯

## Instalando e Inicializando Prisma

Vamos a ayudarnos de **Prisma** para crear nuestra base de datos y agregar un modelo para nuestros usuarios.

```jsx
npm i prisma @prisma/client
```

Una vez instalado, ejecutamos el comando `init`.

```jsx
npx prisma init --datasource-provider sqlite
```

Observa que le pasamos el valor `sqlite` al flag `—datasource-provider`.

Ahora, vamos al archivo `prisma/chema.prisma` en este archivo vamos a agregar nuestro modelo de usuario:

```jsx
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  displayName  String?
}
```

Tenemos entonces la forma de nuestra base de datos, **con una única tabla** **User**. Es momento de generarla.

## Corriendo una migración

Ahora que tenemos toda la configuración de **Prisma** lista, vamos a ejecutar la migración que **creará nuestro archivo** de base de datos y también la tabla `User` dentro de ella.

```jsx
npx prisma migrate dev --name init
```

Esto crea un archivo de migración en la carpeta `prisma/migrations`.

Prisma también **ejecutó la migración en la base de datos**. 💾

La base de datos se crea automáticamente dentro de la carpeta `prisma/` con el nombre: `dev.db`.

Bien. Estamos listos para crear un cliente con **PrismaClient** y consumir nuestra base de datos. 🔜

## Creando un usuario nuevo

Vamos a crear un usuario nuevo ya directamente en nuestra función `action`, **¡haciendo con esto, que el formulario ya funcione!**

Guardaremos un usuario nuevo con los datos que vienen del formulario:

```jsx
// app/routes/new.tsx

// ...

const prisma = new PrismaClient(); // En Netlify esto está bien.

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = {
    displayName: String(formData.get("displayName")),
    email: String(formData.get("email")),
  };
  // Aquí podemos validar con zod @TODO
  await prisma.user.create({ data }); // podríamos capturar un error con try
  return { ok: true }; // Siempre devuelve por lo menos null en un action
};

// ...
```

Primero creamos un cliente con la clase `PrismaClient()`.

De nuevo, utilizamos el _formData_ directamente para crear un objeto `data` y lo usamos en el método `.create()` del modelo `User` que ya creamos.

Para mantener el ejemplo simple, no estamos capturando el error, solo dejaremos que suceda. 🥶 Finalmente devolvemos un objeto con `ok:true` para que el cliente muestre el _toast_.

Muy bien, ve al navegador y agrega un nuevo usuario. ✅ 🤯

## Mirando la lista de usuarios con Prisma Studio

Ahora que has agregado un usuario nuevo, es importante tener a la mano una herramienta que nos permita leer y administrar nuestra base de datos.

```jsx
npx prisma studio
```

Este comando levantará un servidor en el puerto `:5555`. Cuando visitamos este puerto, nos encontramos con tablas que no permiten **administrar toda nuestra base de datos**.

Esta herramienta es muy útil, bien hecho **Prisma**. ✅

Puedes tener a **Prisma Studio** corriendo en una segunda terminal en **VSCode**.

Bueno, el formulario ya funciona, ya podemos crear nuevos usuarios, es hora de editarlos. 🔥

Abrazo.

Bliss. 🤓

## Enlaces relacionados

MongoDB y Remix

https://youtu.be/22Lt9MCRwwc

¿SQLite en producción?

[https://www.sqlite.org/whentouse.html#:~:text=Generally speaking%2C any site that,times that amount of traffic](https://www.sqlite.org/whentouse.html#:~:text=Generally%20speaking%2C%20any%20site%20that,times%20that%20amount%20of%20traffic).
