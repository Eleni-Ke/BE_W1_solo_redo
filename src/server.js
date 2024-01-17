import Express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";

const server = Express();
const port = 3001;

// ************ MIDDLEWARES ************

// ************ ROUTES ************

server.use("/products", productsRouter);

// ************ ERROR MIDDLEWARES ************

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.table(listEndpoints(server));
});
