import * as restify from 'restify';
import { Review } from './reviews.model';
import { ModelRouter } from '../common/model-router';
import * as mongoose from 'mongoose';

class ReviewsRouter extends ModelRouter<Review> {
    constructor(){
        super(Review)
    }

    applyRoutes(application: restify.Server) {
        application.get('/reviews', this.findAll)
        application.get('/reviews/:id', [this.validateId, this.findById])
        application.post('/reviews', this.save)
      }
}

export const reviewsRouter = new ReviewsRouter()