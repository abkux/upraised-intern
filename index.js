import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import gadgetsRoute from "./routes/gadget.js";
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5600;

const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Gadgets API Documentation',
        version: '1.0.0',
        description: 'Gadgets API Documentation with examples.',
      },
    },
    apis: [path.join(__dirname, 'routes/*.js')],
  };

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", async(req, res) => {
    res.status(200).json({ message: "Hello from Abku API." });
})

app.use("/gadgets", verifyToken, gadgetsRoute);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Web Server is running on PORT: ", PORT);
})