import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicImageFolderPath = join(process.cwd(), "./public/img");
const productsJSONPath = join(dataFolderPath, "products.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export const getProducts = () => readJSON(productsJSONPath);
export const writeProducts = (products) =>
  writeJSON(productsJSONPath, products);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviews) => writeJSON(reviewsJSONPath, reviews);
export const writeProductsPicture = (fileName, content) =>
  writeFile(join(publicImageFolderPath, fileName), content);
