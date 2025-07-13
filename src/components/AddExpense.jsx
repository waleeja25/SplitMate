import React, { useState } from 'react';

const categories = [
  'Food & Drink', 'Coffee', 'Groceries', 'Shopping', 'Transportation',
  'Utilities', 'Travel', 'Entertainment', 'Health', 'Education',
  'Maintenance', 'Gifts', 'Mobile',
];

const AddExpense = ({ groups }) => {
  const sessionUser = localStorage.getItem('username');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [groupSelected, setGroupSelected] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!amount || !category || !date || !groupSelected || !paidBy) {
      alert('Please fill out all fields.');
      return;
    }

    const expense = {
      amount: parseFloat(amount),
      category,
      date,
      group: groupSelected,
      paidBy,
    };

    console.log("Expense submitted:", expense);

    // Reset form
    setAmount('');
    setCategory('');
    setDate('');
    setGroupSelected('');
    setPaidBy('');
  };

  const selectedGroup = groups.find((group) => group.name === groupSelected);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
        {sessionUser}
      <h1 className="text-2xl font-bold mb-2">Add a New Expense</h1>
      <h6 className="text-gray-500 mb-4">Relieve your stress</h6>

      <label className="block mb-1 font-medium">Amount</label>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-1 font-medium">Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="" disabled>-- Select Category --</option>
        {categories.map((label, idx) => (
          <option key={idx} value={label}>{label}</option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-1 font-medium">Group</label>
      <select
        value={groupSelected}
        onChange={(e) => setGroupSelected(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="" disabled>Select Group</option>
        {groups.map((group, index) => (
          <option key={index} value={group.name}>
            {group.name} ({group.members.length} Members)
          </option>
        ))}
      </select>

      <label className="block mb-1 font-medium">Paid By</label>
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        disabled={!selectedGroup}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="" disabled>Select who paid</option>
        {selectedGroup?.members.map((member, idx) => (
          <option key={idx} value={member.name}>
            {member.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded"
      >
        Add Expense
      </button>
    </form>
  );
};

export default AddExpense;
