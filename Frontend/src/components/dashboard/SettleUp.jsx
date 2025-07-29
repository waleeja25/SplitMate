import { useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import {  settleUp } from "../expenses/AddExpense/helpers";
import DatePickerComponent from '../ui/DatePickerComponent';
import UserAvatar from '../ui/UseAvatar';

const SettleUpPage = () => {
  const currentUser = localStorage.getItem('username');
  const [payer, setPayer] = useState(currentUser);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSettle = () => {
    if (!selectedFriend || !amount || !payer) return;
    const receiver = payer === currentUser ? selectedFriend : currentUser;
    settleUp(payer, receiver, parseFloat(amount));
    alert(`Settled Rs ${amount} from ${payer} to ${receiver}`);
    setAmount('');
    setSelectedFriend('');
    setPayer(currentUser);
  };

  const owes = [];
  const owed = [];
  // const allFriends = [...owes, ...owed]
  //   .map((entry) => entry.to)
  //   .filter((name, idx, arr) => name !== currentUser && arr.indexOf(name) === idx);
    const balances = JSON.parse(localStorage.getItem("balances") || "{}");

Object.keys(balances).forEach((user) => {
  if (user === currentUser) return;

  const fromOtherToMe = balances[user]?.[currentUser] || 0;
  const fromMeToOther = balances[currentUser]?.[user] || 0;

  if (fromMeToOther > 0) owes.push(user);
  if (fromOtherToMe > 0) owed.push(user);
});

const activeFriends = Array.from(new Set([...owes, ...owed])); 


  return (
        <div className="max-w-xl mx-auto p-6 bg-[rgb(245,252,250)] min-h-screen">
<div className="max-w-md mx-auto p-5 bg-white border border-[#B2E2D2] rounded-xl shadow text-[#4B4B4B] mt-8 ">
  <header className="border-b border-[#2A806D] px-7 py-6 text-center">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#185144] via-[#36a186] to-[#2A806D]">
              Settle Up
            </h1>
      </header>

      <div className="p-6 space-y-6 text-[#4B4B4B]">
        <div className="flex items-center justify-center gap-6">
         
          <div className="flex flex-col items-center">
              <UserAvatar name={payer} size={48}/>
           <select
    value={payer}
    onChange={(e) => setPayer(e.target.value)}
    className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
  >
    <option value={currentUser}>You ({currentUser})</option>
    {activeFriends
      .filter((f) => f !== currentUser)
      .map((friend, idx) => (
        <option key={idx} value={friend}>
          {friend}
        </option>
      ))}
  </select>
          </div>

 <FaExchangeAlt style={{ fontSize: "4rem" }} className="text-[#4B4B4B]" />


          {/* Receiver */}
          <div className="flex flex-col items-center">
            <UserAvatar name={selectedFriend} size={48}/>
            <select
    value={selectedFriend}
    onChange={(e) => setSelectedFriend(e.target.value)}
    className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
  >
    <option value="">Select</option>
    <option value={currentUser}>You ({currentUser})</option>
    {activeFriends
      .filter((f) => f !== payer)
      .map((friend, idx) => (
        <option key={idx} value={friend}>
          {friend === currentUser ? `You (${currentUser})` : friend}
        </option>
      ))}
  </select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-[#2A806D]">Amount</label>
          <div className="flex items-center border border-[#B2E2D2] rounded px-3 bg-white">
            <span className="text-lg text-[#4B4B4B] pr-2">Rs</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full py-2 text-[#4B4B4B] outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Date Picker */}
        <DatePickerComponent date={date} setDate={setDate} />
      </div>

      <footer className="flex justify-end gap-3 px-6 py-4">
        <button
          onClick={() => {
            setAmount('');
            setSelectedFriend('');
            setPayer(currentUser);
          }}
          className="btn px-5 py-2 text-sm bg-white border border-[#B2E2D2] text-[#4B4B4B] hover:bg-[#f0f0f0]"
        >
          Reset
        </button>
        <button
          onClick={handleSettle}
          className="btn px-5 py-2 text-sm bg-[#2A806D] text-white hover:bg-[#246f5f]"
        >
          Save
        </button>
      </footer>
    </div>
    </div>
  );
};

export default SettleUpPage;
