import { Schema, model } from "mongoose";

const BookSchema=new Schema({
    title: {
        type: String,
        required: true,
    },
    description:  {
        type: String,
        required: true,
    },
    category:  {
        type: String,
        required: true,
    },
    trending: {
        type: Boolean,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    newPrice: {
        type: Number,
        required: true,
    }
  }, {
    timestamps: true,
  });

const BookModel = model("Book", BookSchema);

export default BookModel;