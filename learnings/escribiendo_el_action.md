# Escribiendo el action de la ruta

¿Cómo entendemos la función `action`? En realidad es simple, la función `action` se encarga de recibir todos los métodos **HTTP** para mutaciones. 🤯

Es decir, “_post_”, “_put_”, “_patch_” y “_delete_” a excepción de “_get_”, pues del **GET** se encarga la función `loader`. 🚦

```jsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("DisplayName", formData.get("displayName"));
  console.log("email", formData.get("email"));
  return { ok: true }; // always return something, null at least
};
```

La función `action` nos provee del `Request` que contiene muchas herramientas utilísimas para crear aplicaciones muy versátiles, pues en **Remix** tenemos acceso directo a la **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)**. En este caso utilizamos _formData_ directamente, ya que es el formato por _default_ que el formulario entrega, esto es nativo de la plataforma, así que, ¿por qué no usarlo? 🤓

> **_#useThePlatform_**

Obtenemos los datos con `formData.get(name)` y por ahora solo los imprimimos en la consola:

```jsx
[1] GET / 200 - - 3.594 ms
[1] DisplayName BlisSito
[1] email fixtergeek@gmail.com
[1] POST /new 200 - - 5.741 ms
```

## Añadiendo feedback para el usuario

En la siguiente lección, crearemos una base de datos y la usaremos para guardar nuestro nuevo usuario pero antes, vamos a crear un _toast_, para anunciar que el nuevo usuario se ha creado, esto es, cuando la función `action` ya ha respondido con `{ ok: true }`.

```jsx
// ...

const actionData = useActionData();

// agregamos un toast
return (
// ...
{actionData?.ok && (
  <div className="bg-green-200/50 py-4 px-8 rounded-xl absolute bottom-8 text-lg text-green-700">
    <p>✅ El usuario ha sido creado con éxito.</p>
  </div>
)}
);
// ...
```

¡Genial! Ahora tenemos un toast bonito que mostrar una vez que hemos recibido los datos. 🎉

> 😎 Reto: Si eres tan bueno(a) con **JS**, ¿Podrías hacer que el _toast_ desaparezca después de 5 segundos?

Abrazo.

Bliss. 🤓

## Enlaces relacionados

Fetch API Docs

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
