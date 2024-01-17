import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { getReviews, writeReviews } from "../../lib/fs-tools.js";
import {
  checkreviewSchema,
  triggerBadRequestError,
} from "../../lib/validation.js";

const reviewsRouter = Express.Router();

reviewsRouter.post(
  "/:productId/reviews",
  checkreviewSchema,
  triggerBadRequestError,
  async (req, res, next) => {
    try {
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        productID: req.params.productId,
        id: uniqid(),
      };

      const reviews = await getReviews();
      reviews.push(newReview);
      await writeReviews(reviews);

      res.status(201).send({ id: newReview.id });
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const allReviews = await getReviews();
    const reviews = allReviews.filter(
      (review) => review.productId === req.params.productId
    );
    if (reviews) {
      res.send(reviews);
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

reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const review = reviews.find((review) => review.id === req.params.reviewId);
    if (review && review.productId === req.params.productId) {
      res.send(review);
    } else {
      next(
        createHttpError(
          404,
          `Review with id ${req.params.reviewId} not found for product with id ${req.params.productId}!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put(
  "/:reviewId",
  checkreviewSchema,
  triggerBadRequestError,
  async (req, res, next) => {
    try {
      const reviews = await getReviews();
      const index = reviews.findIndex(
        (review) => review.id === req.params.reviewId
      );
      if (index !== -1 && reviews[index].productId === req.params.productId) {
        const updatedReview = {
          ...reviews[index],
          ...req.body,
          updatedAt: new Date(),
          id: req.params.reviewId,
        };
        reviews[index] = updatedReview;
        await writeReviews(reviews);
        res.send(updatedReview);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found for product with id ${req.params.productId}!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    const remainingReviews = reviews.filter(
      (review) => review.id !== req.params.reviewId
    );
    if (
      reviews.length !== remainingReviews.length &&
      reviews[index].productId === req.params.productId
    ) {
      await writeReviews(remainingReviews);
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Review with id ${req.params.reviewId} not found for product with id ${req.params.productId}!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
