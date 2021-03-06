const ExpenseModel = require("../models/expense");
const moment = require("moment");

module.exports = {
  create: async (req, res) => {
    const { title, amount } = req.body;

    try {
      const newExpense = new ExpenseModel({
        userID: req.user._id,
        title,
        amount,
      });
      const savedExpense = await newExpense.save();

      return res.json(savedExpense);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  update: async (req, res) => {
    const { expenseId } = req.params;
    try {
      let updatedExpense = await ExpenseModel.findByIdAndUpdate(
        expenseId,
        {
          ...req.body,
          dateUpdated: Date.now(),
        },
        { new: true }
      ).exec();

      if (!updatedExpense) {
        return res.status(400).json({ message: "not found!" });
      }

      res.json(updatedExpense);
    } catch (err) {
      return res.status(400).json(err);
    }
  },

  delete: async (req, res) => {
    const { expenseId } = req.params;
    try {
      let deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);
      return res.json({ id: deletedExpense._id });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  find: async (req, res) => {
    const { dateFrom, dateTo } = req.body;
    try {
      const expenses = await ExpenseModel.find({ userID: req.user._id }).exec();

      if (
        dateFrom &&
        dateTo &&
        moment(dateFrom).isSameOrBefore(moment(dateTo), "day")
      ) {
        return res.json(
          expenses.filter((expense) => {
            return (
              moment(expense.dateUpdated).isSameOrAfter(
                moment(dateFrom),
                "day"
              ) &&
              moment(expense.dateUpdated).isSameOrBefore(moment(dateTo), "day")
            );
          })
        );
      }

      /*
       * Return expenses with on the same month by default
       */

      res.json(
        expenses.filter((expense) => {
          return moment(expense.dateUpdated).isSame(moment(), "month");
        })
      );
    } catch (err) {
      console.log(err);
    }
  },

  findById: async (req, res) => {
    const { expenseId } = req.params;
    try {
      const expense = await ExpenseModel.findOne({
        _id: expenseId,
        userID: req.user._id,
      });

      if (!expense) {
        return res.status(400).json({
          message: "Not found!",
        });
      }

      return res.json(expense);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },
};
