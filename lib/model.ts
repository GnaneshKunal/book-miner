import * as mongoose from 'mongoose';

interface IBookReview extends mongoose.Document {
    title: String;
    author: String;
    rating: Number;
    ratingsCount: Number;
    reviewsCount: Number;
    bookID: Number;

    reviewerName: String;
    review: String;
}

const BookReviewSchema: mongoose.Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bookID: {
        type: Number,
        required: true,
        unique: true
    },
    author: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    ratingsCount: {
        type: Number,
        required: true
    },
    reviewsCount: {
        type: Number,
        required: true
    },
    reviewerName: {
        type: String
    },
    review: {
        type: String
    }
});

const BookReview = mongoose.model<IBookReview>('BookReview', BookReviewSchema);

export default BookReview;
