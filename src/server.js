import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import { join } from "path";
import cors from "cors";

const server = Express();
const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

// ************ MIDDLEWARES ************

server.use(Express.static(publicFolderPath));
server.use(cors());
server.use(Express.json());

// ************ ROUTES ************

server.use("/products", productsRouter);
server.use("/products", reviewsRouter);

// ************ ERROR MIDDLEWARES ************

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.table(listEndpoints(server));
});
