const UserModel = require('../models/user'); // Make sure this is correctly imported

// Add Expense
const addExpenses = async (req, res) => {
    const body = req.body;
    const { _id } = req.user;

    // Ensure date field is present and converted to Date object
    if (body.date) {
        body.date = new Date(body.date);
    } else {
        // If no date provided, set to current date
        body.date = new Date();
    }

    console.log("Body:", body);
    console.log("User ID:", _id);

    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: body } },
            { new: true }
        );

        console.log("Updated user:", userData);

        return res.status(200).json({
            message: "Expense added successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error
        });
    }
};

// Fetch Expenses
const fetchExpenses = async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findById(_id).select('expenses');

        return res.status(200).json({
            message: "Expenses fetched successfully",
            success: true,
            data: user.expenses || [] // this is what your frontend expects
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};

// Delete Expense
const deleteExpenses = async (req, res) => {
    const { _id } = req.user;
    
    const { expenseId } = req.body;

    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            {
                $pull: {
                    expenses: { _id: expenseId }
                }
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Expense deleted successfully",
            success: true,
            data: userData?.expenses
        });
    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    addExpenses,
    fetchExpenses,
    deleteExpenses
};
