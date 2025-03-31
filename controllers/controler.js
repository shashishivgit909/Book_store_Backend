import BookModel from "../model/book.model.js";
import OrderModel from "../model/order.model.js";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

export const postABook = async (req, res) => {
    try {
        const newBook = await BookModel(req.body);
        await newBook.save();
        res.status(200).send({ message: "Book posted successfully", book: newBook })
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({ message: "Failed to create book" })
    }
}

// get all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await BookModel.find().sort({ createdAt: -1 });
        res.status(200).send(books)

    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({ message: "Failed to fetch books" })
    }
}

export const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await BookModel.findById(id);
        if (!book) {
            res.status(404).send({ message: "Book not Found!" })
        }
        res.status(200).send(book)

    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({ message: "Failed to fetch book" })
    }

}

// update book data
export const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await BookModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            res.status(404).send({ message: "Book is not Found!" })
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({ message: "Failed to update a book" })
    }
}

export const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await BookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            res.status(404).send({ message: "Book is not Found!" })
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({ message: "Failed to delete a book" })
    }
};

export const createAOrder = async (req, res) => {
    try {
        const newOrder = await OrderModel(req.body);
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        console.error("Error creating order", error);
        res.status(500).json({ message: "Failed to create order" });
    }
};


export const getOrderByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(email, "email")
        const orders = await OrderModel.find({ email }).sort({ createdAt: -1 });
        if (!orders) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders", error);
        res.status(500).json({ message: "Failed to fetch order" });
    }
}

export const createuser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate input
        if (!username || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if role is valid
        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const newUser = new userModel({ username, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {


        const admin = await userModel.findOne({ username });
        console.log(admin,"backend admin %%%%%%%%")
        if (!admin) {
            return res.status(404).send({ message: "Admin not found!" })
        }
        const match = await bcrypt.compare(password, admin.password);
        if (!match) {
            console.log("inside pass")
            return res.status(401).send({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
             process.env.JWTSECRET||"SHASHI",
            // { expiresIn: "1h" }
        )
        console.log(token , "token   $$$$$$$$$$$$$$$$$$")

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        })

    } catch (error) {
        console.error("Failed to login as admin", error)
        return res.status(401).send({ message: "Failed to login as admin" })
    }
}


//stats:
export const adminstatistics = async (req, res) => {
    try {
        // 1. Total number of orders
        const totalOrders = await OrderModel.countDocuments();

        // 2. Total sales (sum of all totalPrice from orders)
        const totalSales = await OrderModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalPrice" },
                }
            }
        ]);

        // 4. Trending books statistics: 
        const trendingBooksCount = await BookModel.aggregate([
            { $match: { trending: true } },  // Match only trending books
            { $count: "trendingBooksCount" }  // Return the count of trending books
        ]);

        // If you want just the count as a number, you can extract it like this:
        const trendingBooks = trendingBooksCount.length > 0 ? trendingBooksCount[0].trendingBooksCount : 0;

        // 5. Total number of books
        const totalBooks = await BookModel.countDocuments();

        // 6. Monthly sales (group by month and sum total sales for each month)
        const monthlySales = await OrderModel.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },  // Group by year and month
                    totalSales: { $sum: "$totalPrice" },  // Sum totalPrice for each month
                    totalOrders: { $sum: 1 }  // Count total orders for each month
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Result summary
        res.status(200).json({
            totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingBooks,
            totalBooks,
            monthlySales,
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
}