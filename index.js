import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Inicializado ${process.env.PORT}`);
})

app.use(express.json());
app.use("/alquiler", routes);