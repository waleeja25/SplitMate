import React, { useState, useRef } from 'react';
import { FaUser, FaExchangeAlt } from 'react-icons/fa';
import { getUserBalances, settleUp } from "../expenses/AddExpense/helpers";
import DatePickerComponent from '../ui/DatePickerComponent'

const SettleUp = () => {
  const currentUser = localStorage.getItem('username');
  const [payer, setPayer] = useState(currentUser);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [amount, setAmount] = useState('');
  const { owes, owed } = getUserBalances(currentUser);
  const [date, setDate] = useState('');

  const dialogRef = useRef();

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleSettle = () => {
    if (!selectedFriend || !amount || !payer) return;
    const receiver = payer === currentUser ? selectedFriend : currentUser;
    settleUp(payer, receiver, parseFloat(amount));
    alert(`Settled Rs ${amount} from ${payer} to ${receiver}`);
    setAmount('');
    setSelectedFriend('');
    setPayer(currentUser);
    dialogRef.current?.close();
  };

  const allFriends = [...owes, ...owed]
    .map((entry) => entry.to)
    .filter((name, idx, arr) => name !== currentUser && arr.indexOf(name) === idx);

  return (
    <>
      <button onClick={openDialog} className="btn bg-[#2A806D] text-white hover:bg-[#246f5f]">
        Settle Up
      </button>

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box p-0 rounded-2xl overflow-hidden shadow-lg border border-[#B2E2D2] bg-[#F6F9F8]">

          <header className="border-b-2 border-[#2A806D] px-5 py-4 flex justify-center relative">
            <h2 className="text-3xl font-bold text-[#2A806D]">Settle Up</h2>
            <form method="dialog" className="absolute right-4 top-1/2 -translate-y-1/2">
              <button className="text-2xl font-bold text-[#4B4B4B] hover:text-[#2A806D]">×</button>
            </form>
          </header>

          <div className="p-6 space-y-5 text-[#4B4B4B]">
            <div className="flex items-center justify-center gap-6">

              <div className="flex flex-col items-center">
                <FaUser className="text-2xl text-[#2A806D]" />
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
                >
                  <option value={currentUser}>You ({currentUser})</option>
                  {allFriends.map((friend, idx) => (
                    <option key={idx} value={friend}>
                      {friend}
                    </option>
                  ))}
                </select>
              </div>

              <FaExchangeAlt className="text-3xl text-[#4B4B4B]" />

              <div className="flex flex-col items-center">
                <FaUser className="text-2xl text-[#2A806D]" />
                <select
                  value={selectedFriend}
                  onChange={(e) => setSelectedFriend(e.target.value)}
                  className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
                >
                  <option value="">Select</option>
                  {allFriends
                    .filter((f) => f !== payer)
                    .map((friend, idx) => (
                      <option key={idx} value={friend}>
                        {friend}
                      </option>
                    ))}
                  {payer !== currentUser && (
                    <option value={currentUser}>You ({currentUser})</option>
                  )}
                </select>
              </div>
            </div>

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

            <DatePickerComponent date={date} setDate={setDate} />
          </div>

          <footer className="flex justify-end gap-3 bg-[#EAF7F3] px-6 py-4">
            <form method="dialog">
              <button className="btn px-5 py-2 text-sm bg-white border border-[#B2E2D2] text-[#4B4B4B] hover:bg-[#f0f0f0]">
                Cancel
              </button>
            </form>
            <button
              onClick={handleSettle}
              className="btn px-5 py-2 text-sm bg-[#2A806D] text-white hover:bg-[#246f5f]"
            >
              Save
            </button>
          </footer>
        </div>
      </dialog>
    </>
  );
};

export default SettleUp;
