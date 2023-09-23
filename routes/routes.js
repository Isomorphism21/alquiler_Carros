import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import dotenv from "dotenv";
import generateJWT from "../helpers/generateToken.js";
import jwt from "jsonwebtoken";

dotenv.config();

const URI = process.env.MONGO_URI;
const nombreBase = "alquiler-carros";

const routes = express.Router();

routes.post("/login", async (req, res) => {
    const { dni_empleado, contraseña } = req.body
    console.log(req.body);
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("empleado");
        const existeDNI = await collection.findOne({ dni_empleado });
        console.log(existeDNI);
        if (!existeDNI) {
            return res.status(400).json({
                msg: "el email no existe"
            })
        }

        if (contraseña !== existeDNI.contraseña) {
            return res.json({ msg: "contraseña no valida" })
        } else if (contraseña === existeDNI.contraseña) {
            const token = await generateJWT(existeDNI._id);
            res.json({
                existeDNI,
                token,
                message: 'Usuario Validado'
            })
        }
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio2", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("cliente");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        console.log(uid);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        console.log(usuarioValido);
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find().toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
})

routes.get("/ejercicio3", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("alquiler");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({ estado: "Disponible" }).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio4", async (req, res) => {
    try {
        let datos = [];
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("alquiler");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.aggregate([{ $match: { estado: "Activo" } },
        {
            $lookup: {
                from: "cliente",
                localField: "id_cliente",
                foreignField: "_id",
                as: "clientes"
            }
        },
        {
            $unwind: "$clientes"
        }]).toArray();
        for (let i = 0; i < result.length; i++) {
            datos.push(result[i].clientes)
        }
        res.json(datos)
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio5", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("reserva");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.aggregate([{ $match: { estado: "Pendientes" } },
        {
            $lookup: {
                from: "cliente",
                localField: "id_cliente",
                foreignField: "_id",
                as: "clientes"
            }
        },
        {
            $lookup: {
                from: "automovil",
                localField: "id_automovil",
                foreignField: "_id",
                as: "automoviles"
            }
        }]).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio6", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("alquiler");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({id_alquiler: 2}).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio7", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({cargo_empleado: "Vendedor"}).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio8", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("sucursal_automovil");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.aggregate([{
            $lookup:{
                from:"sucursal",
                localField:"id_sucursal",
                foreignField:"_id",
                as:"sucursales"
            }
        }]).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio9", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("alquiler");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({id_alquiler: 1}).toArray();
        res.json(result[0].costo_total);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio10", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("cliente");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({dni_cliente: 2103456789}).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio11", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("automovil");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({capacidad_automovil: {$gte: 5}}).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

routes.get("/ejercicio12", async (req, res) => {
    try {
        const client = new MongoClient(URI);
        await client.connect();
        const db = client.db(nombreBase);
        const collection = db.collection("automovil");
        const collection2 = db.collection("empleado");
        const token = req.header("token");
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const usuarioValido = await collection2.findOne({ _id: new ObjectId(uid) });
        if (!usuarioValido) {
            return res.json({ msg: "usuario no validado" })
        }
        const result = await collection.find({capacidad_automovil: {$gte: 5}}).toArray();
        res.json(result);
        await client.close();
    } catch (error) {
        console.log(error);
    }
});

export default routes;