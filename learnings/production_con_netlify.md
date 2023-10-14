# Production ready con Netlify

Para llevar nuestro proyecto a producción es necesario: **utilizar una base de datos en la nube**. ☁️

Puedes utilizar la base de datos que prefieras, dependiendo de tu presupuesto, pero como aquí intentamos aprender y no gastar dinero aún, cambiaremos nuestra **SQLite** por una base de datos no relacional con **MongoDB Atlas** en la nube. 🌱🌩️

Una vez que tengamos nuestra base de datos nueva, vamos a actualizar nuestro `schema.prisma` y así, poder **utilizarla en desarrollo y producción**. 💪🏻

## Creando la base de datos en Mongo Atlas

Vamos a **MongoDB** **Atlas** para crear una nueva base de datos.

Sigue todas las instrucciones que te ofrece su **wizard**. ✅

![](https://i.imgur.com/qG5xwbx.png)

Puedes agregar esta **IP** `0.0.0.0/0` para hacer tu base de datos públicamente accesible.

Para luego copiar el enlace de conexión.

![](https://i.imgur.com/DyBGsKE.png)

No olvides tener a la mano los datos de tu usuario para el acceso (_username_ y _password_). Si no tienes uno, puedes crearlo en la sección “_Database Access_”.

## Actualizando `.env` y `prisma.schema`

Vamos entonces a agregar nuestra variable de entorno que contendrá nuestro link de conexión en el archivo `.env`.

```jsx
DATABASE_URL =
  "mongodb+srv://workshop:YUOMuIY8KkJxDo6K@workshops-oct-2023.9unq45i.mongodb.net/workshop?retryWrites=true&w=majority";
```

**No olvides** agregar el nombre de la base de datos después del `/` , en mi caso he seleccionado `workshop`.

Ahora vamos a actualizar el archivo de la configuración de **Prisma**.

```jsx
generator client {
  provider = "prisma-client-js"
}

datasource db {
  // provider = "sqlite"
  // url      = "file:dev.db"
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  // id          Int     @id @default(autoincrement())
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  email       String  @unique
  displayName String?
}
```

Hay dos cambios aquí.

1. actualizamos el `provider=”mongodb”` y `url=env(”DATABASE_URL”)` para poder conectarnos a nuestra **DB** en la nube.
2. Actualizamos el tipo del atributo id de nuestro modelo, esto porque **MongoDB** no usa números enteros, sino **ObjectIds**.

## Probando la actualización

Vamos a ejecutar el comando para generar nuestro cliente de **Prisma** y poder probar nuestra nueva base de datos.

```jsx
npx prisma generate
```

Esto genera los archivos necesarios en nuestro proyecto y podemos levantar nuestro servidor para ver que todo sigue funcionando.

```jsx
npm run dev
```

## Finalmente conectamos nuestro repo con Netlify

**Si haz “forkeado” este proyecto**, subir a producción es muy simple con **Netlify**, solo necesitamos crear una cuenta con **Github** y seleccionar el repo dando los permisos correspondientes.

![](https://i.imgur.com/y9D6s6w.png)

Es importante que el comando para crear el build sea `npm run build` pues este comando incluye la generación de **Prisma** y **Tailwind**.

```jsx
npm run build && cp _app_redirects public/_redirects
```

El comando extra es uno que **Netlify** necesita para rutear correctamente.

![](https://i.imgur.com/gcDWZos.png)

Ahora vamos a agregar la única variable de entorno necesaria: `DATABASE_URL`.

¡Vamos a publicar ya! 🚀

Todo está en su lugar y ha sido muy fácil con **Remix**, **MongoDB** y **Netlify.**

**Ya podemos agregar nuestro propio dominio.** ⛅️

## Agregando un dominio personalizado.

Para este ejemplo, yo usaré uno de mis dominios que ya tengo en **Google** **Domains**, pero puedes usar tu dominio desde donde lo tengas, ya que solo necesitaremos agregar un registro **ALIAS** o **CNAME** a la configuración **DNS** de tu proveedor de dominios. 🗺️

Vamos pues a la sección “_Domain management_” de nuestro proyecto en **Netlify** y agregamos un domino nuevo, además del que ya nos regalaron.

Para después copiar los registros y agregarlos en nuestro proveedor **DNS:**

![](https://i.imgur.com/MdZvT3F.png)

Los nuevos registros **ALIAS** nos permiten configurar nuestro dominio fácilmente. Una vez que el registro se ha propagado, **nuestro dominio está listo**. 🔥

> ⚠️ No olvides que el tipo del `id` de nuestro modelo cambió, asegúrate de actualizar tu código para usar _String_ en vez de _Number_. `where: { id: *String*(id) }` en la función `action` de la ruta `new.tsx`.

### 🤩 Ahora puedes visitar tu aplicación directamente en tu domino 🥳

**¡Ya eres todo un webmaster!**, sí, un **Fullstack** webmaster en 2023. 😎

¿Qué increíble no? ☺️

Abrazo.

Bliss. 🤓
