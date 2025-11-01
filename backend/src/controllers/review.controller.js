import Reviews from '../models/review.models.js'
import Product from '../models/product.models.js'

// create a review
export const createReview = async (req, res, next) => {
  try {
      const {rating, comment, isRecommended} = req.body;
      const productId = req.params.productId;
      const userId = req.user._id;
  
      if (!rating || !comment) {
        return res.status(404).json({message : 'rating and comment is empty '})
      }
      const product = await Product.findById(productId);
  
      if (!product) {
          return res.status(404).json({message: 'Product not found'})
      }
  
      // check if user is already reviewed this product
      const alreadyReviewed = await Reviews.findOne({
          user : userId,
          product : productId
      });
  
      if (alreadyReviewed) {
          return res.status(400).json({message : 'Product already reviewed'})
      }
  
      // create review
      const review = new Reviews({
          user : req.userId,
          product : productId,
          rating : Number(rating),
          comment ,
          isRecommended
      });
  
      const createdReviews = await review.save();
  
      // updated product reviews and ratings
      product.reviews.push(createdReviews._id);
      product.numofReviews = product.reviews.length;
  
      // calculate new average rating
      const allReviews = await Reviews.find({product : productId});
      product.ratings = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
  
      await product.save();
  
      res.status(201).json(createReview);
  } catch (error) {
    next(error);
  }
}

export const getProductReviews = async (req, res, next) => {
    try {
        const productId = req.params.productId;

        const reviews = await Reviews.find({product : productId}).populate('user', 'name').sort({createdAt: -1});

        res.json(reviews);
    } catch (error) {
        next(error);
    }
}

// get top rated products using aggregation pipeline
export const getTopRatedProducts = async (req, res, next) => {
    try {
        const product = await Product.aggregate([
            {
                $match: {
                    numofReviews: {$gt: 0}
                }
            },
            {
                $addFields : {
                    averageRating: {$round: ["$ratings", 1]}
                }
            },
            {
                $sort: {averageRating: -1, numofReviews: -1}
            },
            {
                $limit: 10
            },
            {
                $project:{
                    name: 1,
                    price: 1,
                    images: 1,
                    ratings: 1,
                    numofReviews : 1,
                    averageRating: 1
                }
            }
        ]);

        res.json(product);
    } catch (error) {
        next(error);
    }
}