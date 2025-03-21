import BookModel from "../model/book.model.js";
import OrderModel from "../model/order.model.js";

export const postABook = async (req, res) => {
    try {
        const newBook = await BookModel(req.body);
        await newBook.save();
        res.status(200).send({message: "Book posted successfully", book: newBook})
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({message: "Failed to create book"})
    }
}

// get all books
export const getAllBooks =  async (req, res) => {
    try {
        const books = await BookModel.find().sort({ createdAt: -1});
        res.status(200).send(books)
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

export const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book =  await BookModel.findById(id);
        if(!book){
            res.status(404).send({message: "Book not Found!"})
        }
        res.status(200).send(book)
        
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({message: "Failed to fetch book"})
    }

}

// update book data
export const UpdateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedBook =  await BookModel.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

export const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook =  await BookModel.findByIdAndDelete(id);
        if(!deletedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

export const createAOrder = async (req, res) => {
    try {
      const newOrder =  await OrderModel(req.body);
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (error) {
      console.error("Error creating order", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  };
  
  
 export const getOrderByEmail = async (req, res) => {
    try {
      const {email} = req.params;
      console.log(email,"email")
      const orders = await OrderModel.find({email}).sort({createdAt: -1});
      if(!orders) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  }