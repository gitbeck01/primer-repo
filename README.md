#  API de FRUTAS

## TAREA DE CONTENIDOS

- [x] Construcción del servidor web Express
- [x] Definición de las rutas y métodos HTTP
- [x] Integración con la base de datos MongoDB
- [x] Desarollo de la Lógica de cada Método HTTP
- [x] Control de errores al utilizar cada Método HTTP 


## \*Proyecto API REST FULL / MONGODB. \*

La mision de este __CRUD__ en el 
mundo de la programación es para describir las 
operaciones básicas que se pueden realizar sobre 
una base de datos. De esta manera poder leer, crear, modificar y eliminar productos de la base de datos en mongodb.

### http://localhost:3008/api/v1/fruit


### Construcción del servidor web Express

const express = require("express");
const { connectToMongoDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;


### Construcción conexión y desconexión a MongoDB
---------------------
const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require("mongodb");

const URI = process.env.MONGODB_URLSTRING;
const client = new MongoClient(URI);

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log("Conectado a MongoDB")
        return client
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        return null;
    }
};

const disconnectFromMongoDB = async () => {
    try {
        await client.close();
        console.log("Desconectado de MongoDB")
    } catch (error) {
        console.error("Error al desconectar de MongoDB:", error);
        return null;
    }
};

module.exports = { connectToMongoDB, disconnectFromMongoDB };

### Dependencias

{
  "name": "mongodb",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "start": "node --watch server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongodb": "^5.7.0"
  }
}


### Métodos a utilizar:
* GET: consulta información de un recurso.
    * __Obtener todas la frutas__

    app.get("/fruit", async (req, res) => {
    try {
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }
        const db = client.db("fruit");
        const frutas = await db.collection("fruit").find().toArray();
        res.json(frutas);
    } catch (error) {
        res.status(500).send("Error al obtener las frutas de la base de datos");
    } finally {
        await disconnectFromMongoDB();
    }
});


    * __Obtener las frutas por su Id__ 

    app.get("/fruit/id/:id", async (req, res) => {
    const frutaId = parseInt(req.params.id);
    try {
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }
        const db = client.db("fruit");
        const frutas = await db.collection("fruit").findOne({ id: frutaId });
        if (frutas) {
            res.json(frutas);
        } else {
            res.status(404).send("Fruta no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al obtener la fruta de la base de datos");
    } finally {
        await disconnectFromMongoDB();
    }
});


    * __Obtener frutas por su precio__

    app.get("/fruit/precio/:precio", async (req, res) => {
    const precioFruta = parseInt(req.params.precio);
    try {
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }
        const db = client.db("fruit");
        const frutas = await db
        .collection("fruit")
        .find({ importe: {$gte: precioFruta }})
        .toArray();
        if (frutas. length > 0) {
            res.json(frutas);
        } else {
            res.status(404).send("Fruta no encontrada");
        }
    } catch (error) {
        res.status(500).send("Error al obtener la fruta de la base de datos");
    } finally {
        await disconnectFromMongoDB();
    }
});


    * __Obtener las frutas por su nombre__

    app.get("/fruit/nombre/:nombre", async (req, res) => {
        try {
            const consultaNombre = req.params.nombre.trim().toLowerCase();
        
            const client = await connectToMongoDB();
            if (!client) {
              return res.status(500).send("Error al conectarse a MongoDB");
            }
            const db = client.db("fruit");
            const frutas = await db
              .collection("fruit")
              .find({ nombre: { $regex: new RegExp(consultaNombre, "i") } })
              .toArray();
            if (frutas.length > 0) {
              res.json(frutas);
            } else {
              res.status(404).send("No se encontraron productos con el nombre solicidado");
            }
          } catch (error) {
            console.error("Error al obtener el nombre de la base de datos:", error);
            res.status(500).send("Error al obtener el nombre de la base de datos");
          } finally {
            await disconnectFromMongoDB();
          }
        });


* POST: crea un recurso nuevo.
    * Agregar fruta

    app.post("/fruit", async (req, res) => {
    const nuevaFruta = req.body;
    try {
        if (nuevaFruta === undefined) {
            res.status(400).send("Error en el formato de datos a crear.");
        }
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse con MongoDB");
        }
        const db =client.db("fruit");
        const collection = db.collection("fruit");
        await collection.insertOne(nuevaFruta);
        console.log("Nueva fruta creada");
        res.status(201).send(nuevaFruta);
    } catch (error) {
        res.status(500).send("Error al intentar agregar una nueva fruta");    
    } finally {
        await disconnectFromMongoDB();
    }
});
    
* PUT: modifica un recurso existente.
    * Actualiza por su Id

    app.put("/fruit/id/:id", async (req, res) => {
    const idFruta = parseInt(req.params.id);
    const nuevosDatos = req.body;
    try {
        if (!nuevosDatos) {
            res.status(400).send("Error en el formato de datos a crear.");
        }
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
        }
        const db = client.db("fruit");
        const collection = db.collection("fruit");
        await collection.updateOne({ id: idFruta }, { $set: nuevosDatos });
        console.log("Fruta Modificada");
        res.status(200).send(nuevosDatos);   
    } catch (error) {
        res.status(500).send("Error al modificar la fruta");
    } finally {
        await disconnectFromMongoDB();
    }
});

* DELETE: elimina un recurso determinado. 
    * Borra la fruta por su Id

    app.delete("/fruit/id/:id", async (req, res) => {
    const idFruta = parseInt(req.params.id);
    try {
        if (!idFruta) {
            res.status(400).send("Error en el formato de datos a crear.");
            return;
        }
        const client = await connectToMongoDB();
        if (!client) {
            res.status(500).send("Error al conectarse a MongoDB");
            return;
        }
        const db = client.db("fruit");
        const collection = db.collection("fruit");
        const resultado = await collection.deleteOne({ id: idFruta });
        if (resultado.deletedCount === 0) {
            res.status(404).send("No se encontro ninguna fruta con el id seleccionado.");
        } else {
            console.log("Fruta Eliminada");
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).send("Error al eliminar la fruta");
    } finally {
        await disconnectFromMongoDB();
    }
});


### Codigo del cuerpo del mensaje para los metodos

* POST:
    * status(400).send("Error en el formato de datos a crear.")
    * status(500).send("Error al conectarse con MongoDB");
    * console.log("Nueva fruta creada"); res.status(201).send(nuevaFruta);
    * status(500).send("Error al intentar agregar una nueva fruta")

* PUT:
    * status(400).send("Error en el formato de datos a crear.");
    * status(500).send("Error al conectarse a MongoDB");
    * console.log("Fruta Modificada"); res.status(200).send(nuevosDatos);
    * status(500).send("Error al modificar la fruta");

### Conexion con mongodb a traves de cloud.mongodb

PORT = 3008
MONGODB_URLSTRING=mongodb+srv://beckleandro:g6UJCKCUNXhuFSPq@sqldatabase.o6i3zsd.mongodb.net/?retryWrites=true&w=majority

### Formato JSON 

Ej:  
  {
  "id": 1,
  "imagen": "🍌",
  "nombre": "Banana",
  "importe": 500,
  "stock": 100
}


### Peticiones

| PETICIÓN |       URL       |       DESCRIPCION       |
|:--------:|-----------------|-------------------------|
|  GET     | [/fruit]        | Obtener todas la frutas |
|  POST    | [/fruit]        | Grabar nueva fruta      |
|  PUT     | [/fruit/id/:id] | Modifica por su id      |
|  DELETE  | [/fruit/id/:id] | Elimina por su id       |


### DIAGRAMA DE FLUJO

```mermaid
graph TD;
  HTTP-->REQUEST;
  REQUEST-->WEBSERVER;
  WEBSERVER-->MongoDB;
  MongoDB-->JASON;
  JSON-->WEBSERVER;
  WEBSERVER-->RESPONSE;
  RESPONSE-->HTTP;
```