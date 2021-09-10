# Curso de Next.js

## Lo básico

### Construir una web app con React no es fácil

Total cost ownership: ¿Cuánto le vale a tu empresa el tiempo que gastas en mantener el framework que tú mismo/a creaste?

Si en lo que inviertes la mayoría de tu tiempo no agrega valor a tus usuarios, tal vez no estés enfocado en lo correcto.

Next.JS es el framework de React para producción.

[Next JS in 100 seconds](https://www.youtube.com/watch?v=Sklc_fQBmcs)

[Página oficial de Next JS](https://nextjs.org/)

[Apuntes de alguna persona](https://www.notion.so/Curso-de-Next-js-a877c9b1fc4a4cc18573fb5cf2d675fe)

### Nuestro proyecto y lo que necesitaremos

Crearemos una página en Next JS, que contenga una lista de aguacates y al hacer click en ella veremos más detalles.

[Platzi Avo](https://platzi-avo.vercel.app/)

### Instalando Next JS

- Necesitas tener Node versión 12 o superior.
- Necesitas tener git
- Necesitas Browser con DevTools

Creamos la carpeta del proyecto y hacemos `npm init -y` y después `npm i next react react-dom`

En el archivo 'package.json' agregamos:

```json
"scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start"
  },
```

Y creamos el directorio 'pages' y con ello ya podemos hacer `npm run dev`

## Routing

### Rutas básicas

Existen 2 formas de hacer routing en Next.JS

- Estáticas -> '/about/'
- Dinámicas -> Cambian, son variables -> '/user/nombreUsuario/'

Next JS hace routing dependiendo de los archivos que tenemos en la carpeta 'pages'.

archivo 'pages/index.js':

```javascript
import React from 'react'

const Home = () => {
  return (
    <div>
      <h1>Hola Platzi desde Next JS</h1>
      <p>Esto es Hot Realoading y Fast Refresh</p>
      {/* Se actualiza muy rápido */}
    </div>
  )
}

export default Home;
```

Con esto ya tenemos la ruta '/'

archivo 'pages/about.js':

```javascript
import React from 'react'

const About = () => {
  return (
    <div>
      <p>Esta es la página de About</p>
    </div>
  )
}

export default About;

```

Con esto ya tenemos la ruta '/about'

### Rutas dinámicas

Solamente con escribir `[nombreDeVariable].js` ya tenemos una ruta dinámica.

Por ejemplo, para crear la ruta '/product/algo', creamos dentro de pages la carpeta 'product' y dentro de ella, un archivo `[id].js`:

```javascript
import React from 'react'
import { useRouter } from 'next/router'

const ProductItem = () => {
  const router = useRouter()
  return (
    <div>
      Esta es la página del producto: {router.query.id}
      {/* Esto funciona porque el archivo tiene 'id' dentro de los '[]' */}
    </div>
  )
}

export default ProductItem
```

### #UnderTheHood setup y páginas: optimizaciones ocultas

```json
"scripts": {
  "dev": "next",
  "build": "next build", // build para producción
  "start": "next start" // servidor en node para producción
},
```

Si ejecutamos `npm run build` con lo que tenemos hasta ahora:

```bash
Page                             Size     First Load JS
┌ ○ /                            323 B          67.3 kB
├ ○ /404                         194 B          67.2 kB
├ ○ /about                       288 B          67.3 kB
└ ○ /product/[id]                340 B          67.3 kB
+ First Load JS shared by all    67 kB
  ├ chunks/framework.b97a0e.js   42 kB
  ├ chunks/main.8d1561.js        23.3 kB
  ├ chunks/pages/_app.1a580d.js  979 B
  └ chunks/webpack.49d04e.js     690 B

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
```

Next prepara nuestro sitio para producción y le asigna a cada página su 'chunk' (su parte necesaria para que funcione correctamente).

Esto está bastante optimizado con code splitting.

### #UnderTheHood páginas: pre rendering de páginas

Next JS hace Server Side Rendering.

Nos damos cuenta de esto haciendo click derecho y Ver código fuente de la página, en donde tenemos esto:

```html
<div id="__next">
  <div>
    <h1>Hola Platzi desde Next JS</h1>
    <p>Esto es Hot Realoading y Fast Refresh</p>
  </div>
</div>
```

Esto nos ayuda con el SEO.

### Enlazando páginas

A diferencia de React Router, NextJS require que su etiqueta Link tenga adentro la etiqueta `<a></a>` para mejoras del SEO.

```javascript
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav>
      <menu>
        <Link href='/'>
          <a>Home</a>
        </Link>

        <Link href='/about'>
          <a>About</a>
        </Link>
      </menu>
    </nav>
  )
}

export default Navbar
```

### #UnderTheHood enlazando páginas: prefetching automático

Next JS intenta cargar la página antes de que el usuario la visite.

## API y Debugging

### ¿Cómo crear API con NextJS?

Clonamos el [repositorio](https://github.com/jonalvarezz/platzi-nextjs) y hacemos una branch de la tag 2.

Podemos hacer una API muy fácilmente con los archivos que tenemos en la carpeta 'database'.

Luego dentro en 'pages/api/avo' hacemos un archivo index.ts:

```typescript
import { IncomingMessage, ServerResponse } from "http";
import DB from '@database'

const allAvos = async (req: IncomingMessage, res: ServerResponse) => {
  const db = new DB()
  const allEntries = await db.getAll()
  const length = allEntries.length

  res.statusCode = 200
  res.setHeader('Content-type', 'application/json')
  res.end(JSON.stringify({ data: allEntries, length}))
}

export default allAvos
```

### Creando y consumiendo nuestra propia API

El archivo index.tsx nos muestra la lista de los aguacates:

```tsx
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'

const HomePage = () => {
  const [productList, setproductList] = useState<TProduct[]>([]);

  useEffect(() => {
    window.fetch('/api/avo')
    .then(res => res.json())
    .then(({data}) => {
      setproductList(data);
    })
  }, []);

  return (
    <div>
      <Navbar />
      <div>Platzi and Next.js!</div>
      {productList.map((product) => (
        <div>
          <h2>{product.name}</h2>
        </div>
      ))}
    </div>
  )
}

export default HomePage

```
