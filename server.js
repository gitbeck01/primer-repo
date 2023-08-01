const express = require("express");
const { connectToMongoDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next()
});

app.get("/", (req, res) => {
    res.status(200).end("Bienvenido a la API de Frutas")
});

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


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});