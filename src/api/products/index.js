import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import {
  getProducts,
  writeProducts,
  writeProductsPicture,
} from "../../lib/fs-tools.js";
import {
  checkProductSchema,
  triggerBadRequestError,
} from "../../lib/validation.js";

const productsRouter = Express.Router();

productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequestError,
  async (req, res, next) => {
    try {
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uniqid(),
      };

      const products = await getProducts();
      products.push(newProduct);
      await writeProducts(products);

      res.status(201).send({ id: newProduct.id });
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    if (req.query && req.query.category) {
      const filteredProducts = products.filter(
        (product) => product.category === req.query.category
      );
      res.send(filteredProducts);
    } else {
      res.send(products);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const product = products.find(
      (product) => product.id === req.params.productId
    );
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const index = products.findIndex(
      (product) => product.id === req.params.productId
    );
    if (index !== -1) {
      const productToModify = products[index];
      const updatedProduct = {
        ...productToModify,
        ...req.body,
        updatedAt: new Date(),
      };
      products[index] = updatedProduct;
      await writeProducts(products);
      res.send(updatedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts();
    const remainingProducts = products.filter(
      (product) => product.id !== req.params.productId
    );
    if (products.length !== remainingProducts.length) {
      await writeProducts(remainingProducts);
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
