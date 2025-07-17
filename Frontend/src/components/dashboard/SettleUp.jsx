import React, { useState } from 'react';
import { getUserBalances, settleUp } from "../expenses/AddExpense/helpers"

const SettleUp = () => {
  const currentUser = localStorage.getItem('username');
  const [selectedFriend, setSelectedFriend] = useState('');
  const [amount, setAmount] = useState('');
  const { owes, owed } = getUserBalances(currentUser);

  const handleSettle = () => {
    if (!selectedFriend || !amount) return;
    settleUp(currentUser, selectedFriend, parseFloat(amount));
    alert(`Settled Rs ${amount} with ${selectedFriend}`);
    setAmount('');
    setSelectedFriend('');
  };

  return (
    <div className="p-4 border rounded bg-gray-100 max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold mb-3">Settle Up</h2>

      <label className="block mb-1">Choose Friend</label>
      <select
        value={selectedFriend}
        onChange={(e) => setSelectedFriend(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">-- Select --</option>
        {[...owes, ...owed].map((entry, idx) => (
          <option key={idx} value={entry.to}>
            {entry.to}
          </option>
        ))}
      </select>

      <label className="block mb-1">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <button
        onClick={handleSettle}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        Settle Payment
      </button>

      <div className="mt-4">
        <h4 className="font-medium">You Owe</h4>
        {owes.length === 0 ? <p>None</p> :
          owes.map((entry, idx) => (
            <p key={idx}>
              {entry.to}: Rs {entry.amount.toFixed(2)}
            </p>
          ))}

        <h4 className="font-medium mt-3">Owed to You</h4>
        {owed.length === 0 ? <p>None</p> :
          owed.map((entry, idx) => (
            <p key={idx}>
              {entry.to}: Rs {entry.amount.toFixed(2)}
            </p>
          ))}
      </div>
    </div>
  );
};

export default SettleUp;
