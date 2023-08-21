## Consultas a la base de datos con mysql2

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

Por lo tanto, utilizaremos la primera alternativa cuando sea posible con el objetivo de simplificar el código.
<br></br>

---

## Crear un administrador

Existen rutas a las que sólo puede acceder el administrador. Estas rutas son precedidas por el middelware validateAdminToken. Por defecto los usuarios se crean con rol usuario. Para crear un usuario con rol administrador, al registrar el usuario se debe agregar en el body:

```
"root_key": "root_key"
```

Ejemplo con Postman:

(POST) http://localhost:3000/api/users/register

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
