import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Category, Transaction, TransactionsByMonth } from "@/types";

/**
 * Custom hook for managing expenses and transactions.
 * @returns An object containing the categories, transactions, transactionsByMonth, deleteTransaction, and insertTransaction functions.
 */
export default function useExpenseController() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsByMonth, setTransactionsByMonth] =
        useState<TransactionsByMonth>({
            totalExpenses: 0,
            totalIncome: 0,
        });

    const db = useSQLiteContext();

    /**
     * Fetches data from the database and updates the state.
     */
    useEffect(() => {
        db.withTransactionAsync(async () => {
            await getData();
        });
    }, [db]);

    /**
     * Retrieves transactions and categories from the database and updates the state.
     */
    async function getData() {
        const result = await db.getAllAsync<Transaction>(
            `SELECT * FROM Transactions ORDER BY date DESC;`
        );
        setTransactions(result);

        const categoriesResult = await db.getAllAsync<Category>(
            `SELECT * FROM Categories;`
        );
        setCategories(categoriesResult);

        const now = new Date();
        // Set to the first day of the current month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Get the first day of the next month, then subtract one millisecond to get the end of the current month
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

        // Convert to Unix timestamps (seconds)
        const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
        const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

        const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
            `
            SELECT
                COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
                COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
            FROM Transactions
            WHERE date >= ? AND date <= ?;
        `,
            [startOfMonthTimestamp, endOfMonthTimestamp]
        );
        setTransactionsByMonth(transactionsByMonth[0]);
    }

    /**
     * Deletes a transaction from the database and updates the state.
     * @param id - The ID of the transaction to delete.
     */
    async function deleteTransaction(id: number) {
        db.withTransactionAsync(async () => {
            await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
            await getData();
        });
    }

    /**
     * Inserts a new transaction into the database and updates the state.
     * @param transaction - The transaction object to insert.
     */
    async function insertTransaction(transaction: Transaction) {
        db.withTransactionAsync(async () => {
            await db.runAsync(
                `
                INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (?, ?, ?, ?, ?);
            `,
                [
                    transaction.category_id,
                    transaction.amount,
                    transaction.date,
                    transaction.description,
                    transaction.type,
                ]
            );
            await getData();
        });
    }

    /**
     * Inserts a new category into the database.
     * @param {Category} category - The category object to be inserted.
     * @returns {Promise<void>} - A promise that resolves when the category is successfully inserted.
     */
    async function insertCategory(category: Category): Promise<void> {
        db.withTransactionAsync(async () => {
            await db.runAsync(
                `
                INSERT INTO Categories (name, type) VALUES (?, ?);
            `,
                [category.name, category.type]
            );
            await getData();
        });
    }

    /**
     * Deletes a category with the specified ID from the database.
     * @param {number} id - The ID of the category to delete.
     * @returns {Promise<void>} - A promise that resolves when the category is deleted.
     */
    async function deleteCategory(id: number): Promise<void> {
        db.withTransactionAsync(async () => {
            await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
            await getData();
        });
    }

    return {
        categories,
        transactions,
        transactionsByMonth,
        deleteTransaction,
        insertTransaction,
    };
};