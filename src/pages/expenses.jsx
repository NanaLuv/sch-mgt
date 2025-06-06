import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiLoader,
  FiPlus,
  FiTrash2,
  FiX,
  FiDownload,
} from "react-icons/fi";
import Swal from "sweetalert2";
import Notification from "../other-components/notification";
import Sidebar from "../other-components/sidebar";
import * as XLSX from "xlsx";

export default function Expenses() {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
  });
  const [expenses, setExpenses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [addExpenseForm, setAddExpenseForm] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [income, setIncome] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddExpenseForm(true);
    axios
      .post("http://localhost:3001/school/expenses", formData)
      .then((res) => {
        setNotification({
          type: "success",
          message: "Added Successfully",
        });
        getExpenses();
        totalIncome();
        getTotalExpenses();
        setFormData({
          name: "",
          amount: "",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        setAddExpenseForm(false);
      })
      .catch((error) => {
        console.log(error);
        setNotification({
          type: "error",
          message: "Cannot add Expense",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
    setAddExpenseForm(false);
  };

  //get expenses
  const getExpenses = () => {
    axios
      .get("http://localhost:3001/school/get-expenses")
      .then((res) => {
        setExpenses(res.data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getExpenses();
  }, []);

  //get total expenses
  const getTotalExpenses = () => {
    axios
      .get("http://localhost:3001/school/total-expenses")
      .then((res) => {
        setTotalExpenses(res.data);
        console.log(totalExpenses);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getTotalExpenses();
    console.log("all expense", totalExpenses);
  }, [totalExpenses]);

  //total income
  const totalIncome = () => {
    axios
      .get("http://localhost:3001/school/fees")
      .then((res) => {
        setIncome(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    totalIncome();
    console.log("income", income);
  }, [income]);

  //delete Expenses
  function handleExpenseDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/school/expense/${id}`)
          .then((result) => {
            Swal.fire("Deleted!", "The item has been deleted.", "success");
            getExpenses();
            totalIncome();
            getTotalExpenses();
          })
          .catch((error) => console.log(error));
        Swal.fire("Error!", "Failed to delete the item.", "error");
      }
    });
  }

  const balance = income - totalExpenses;

  // Function to export data to Excel
  const exportToExcel = () => {
    // Prepare financial summary data
    const summaryData = [
      ["Category", "Amount (GH₵)"],
      ["Total Income", income],
      ["Total Expenses", totalExpenses],
      ["Balance", balance],
      [], // Empty row for separation
      ["Expense Details", "", "", ""],
      ["Date", "Expense Name", "Amount (GH₵)", "Category"],
    ];

    // Prepare expenses data
    const expensesData = expenses.map((expense) => [
      expense.date ? new Date(expense.date).toLocaleDateString() : "N/A",
      expense.name,
      parseFloat(expense.amount).toFixed(2),
    ]);

    // Combine all data
    const exportData = [...summaryData, ...expensesData];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financial Report");

    // Generate Excel file
    XLSX.writeFile(
      wb,
      `Financial_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm lg:ml-64">
      <Sidebar />

      {/* header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center ml-16 md:ml-64">
            <FiDollarSign className="mr-2 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-800">Expenses</h1>
          </div>
        </div>
      </header>
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-16 ">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            GH₵{income.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600">
            GH₵{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            balance >= 0
              ? "bg-green-50 border-green-100"
              : "bg-amber-50 border-amber-100"
          }`}
        >
          <h3 className="text-sm font-medium mb-1">
            {balance >= 0 ? "Remaining Balance" : "Deficit"}
          </h3>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-green-600" : "text-amber-600"
            }`}
          >
            GH₵{balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
          disabled={addExpenseForm}
        >
          {addExpenseForm ? (
            <FiLoader className="animate-spin" size={20} />
          ) : (
            <>
              <FiPlus size={20} />
              Add Expense
            </>
          )}
        </button>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
        >
          <FiDownload size={20} />
          Export to Excel
        </button>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expense
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expense.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-semibold">GH₵</span>
                    {parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleExpenseDelete(expense._id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                      disabled={addExpenseForm}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No expenses recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Expense Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Notification notification={notification} />
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Expense
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-500"
                disabled={addExpenseForm}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expense Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Office supplies"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (GH₵)
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={addExpenseForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                  disabled={addExpenseForm}
                >
                  {addExpenseForm ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Expense"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
