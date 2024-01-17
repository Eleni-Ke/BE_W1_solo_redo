import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is required and needs to be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is required and needs to be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is required and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is required and needs to be a string!",
    },
  },
  price: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Price is required and needs to be a number!",
    },
  },
};

export const checkProductSchema = checkSchema(productSchema);

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "Comment is required and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isNumeric: {
      errorMessage: "Rate is required and needs to be a number!",
    },
    custom: {
      options: (value) => {
        if (value < 1 || value > 5) {
          throw new Error("Rate must be between 1 and 5");
        }
        return true;
      },
    },
  },
};

export const checkreviewSchema = checkSchema(reviewSchema);

export const triggerBadRequestError = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  } else {
    next(createHttpError(400, "Schema validation failed!"), {
      errorsList: errors.array(),
    });
  }
};
