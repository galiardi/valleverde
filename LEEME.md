# Iniciar la app

1.  Para crear la base de datos, ejecutar en **MySQL** las queries disponibles en el archivo **schema.sql**, ubicado en la raiz del proyecto.

2.  En el archivo **.env** disponible en la raiz del proyecto, modificar las variables **DB_USER** y **DB_PASSWORD** con sus valores locales.

3.  Instalar las dependencias:

```
npm install
```

4. Levantar servidor:

```
npm run dev
```

5. Visitar http://localhost:3000
   <br></br>

# Crear/actualizar un administrador

Existen rutas a las que sólo puede acceder el administrador. Estas rutas son precedidas por el middelware validateAdminToken. Por defecto los usuarios se crean con rol 2 (user). Para crear o actualizar un usuario con rol 1 (admin), se debe proporcionar la propiedad root_key en el body:

```
"root_key": "root_key"
```

Ejemplo con Postman:

(POST)

```
http://localhost:3000/api/users/register
```

(Body/raw/json:)

```
{
"nombre": "Pablito",
"apellido": "Galiardi",
"rut": "11.111.111-1",
"correo": "galiardi.dev@gmail.com",
"contrasena": "asdf1234",
"root_key": "root_key"
}
```

Para acceder a rutas que solicitan token agregar en Headers, Authorization: Bearer token
<br></br>

# Consultas a la base de datos con mysql2

Como se comenta en https://github.com/sidorares/node-mysql2/issues/745,

```
await = pool.execute(query);
```

es equivalente a:

```
const conn = await pool.getConnection();
await conn.execute(query);
conn.release();
```

Considerando lo anterior, cuando sea posible se utilizara la primera alternativa con el objetivo de hacer el codigo mas facil de leer.
<br></br>

# CSS

Se utiliza bootstrap para utilizar los componentes de bootstrap como la barra de navegacion. Tambien se utiliza para dar estilo a los botones.

El layout de las paginas se realiza con CSS Flexbox y/o CSS Grid, ademas del uso de media queries.

Se han creado las clases **"container-column-row"** y **"container-column"**.
**La primera**, utiliza "flex-direction: column" hasta 576px y "flex-direcction: row" en pantallas mas grandes.
**La segunda** utiliza siempre "flex direction-column". Una de estas dos clases se utiliza para envolver el contenido de las distintas vistas, antes de ser envueltas por el layout.

El breakpoint utilizado(576px) coincide con el breakpoint **sm** de bootstrap.
<br></br>

# Aclaracion sobre la estructura del HTML

Las paginas presentan la siguiente organizacion general:

```
<nav></nav>
<main>
<header></header>
</main>
<footer></footer>
```

La barra de navegacion y el footer son renderizados en el layout, mientras que el main es renderizado por las vistas parciales. El header se ha incluido dentro del main, lo cual rompe con la estructura tradicional, pero nos resulta practico en este proyecto.

Las paginas de autenticacion no incluyen barra de navegacion.
<br></br>
