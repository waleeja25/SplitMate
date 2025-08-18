import { useRef } from 'react';
import { FaWallet, FaMoneyBillTrendUp, FaArrowTrendDown  } from "react-icons/fa6";

const DashboardCards = ({ totalBalance, totalYouOwe, totalOwedToYou, owes, owed }) => {
  const owesDialogRef = useRef(null);
  const owedDialogRef = useRef(null);

  return (

<div className="flex flex-wrap gap-6 px-4 sm:px-6 lg:px-8 mt-7 mb-6">

  <div className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white border border-[#d9f0ea] shadow-md rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-lg duration-300">
    <div className="p-3 rounded-full bg-[#2A806D]">
      <FaWallet className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">Total Balance</p>
      <h2 className={`text-xl font-bold ${totalBalance >= 0 ? 'text-[#2A806D]' : 'text-[#e75151]'}`}>
        Rs {totalBalance.toFixed(2)}
      </h2>
    </div>
  </div>

  <div
    onClick={() => owesDialogRef.current?.showModal()}
    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white border border-[#f5d1bc] shadow-md rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all hover:shadow-lg duration-300"
  >
    <div className="p-3 rounded-full bg-[#e75151]">
      <FaArrowTrendDown className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">You Owe</p>
      <h2 className="text-xl font-bold text-[#e75151]">
        Rs {totalYouOwe.toFixed(2)}
      </h2>
    </div>
  </div>

  <div
    onClick={() => owedDialogRef.current?.showModal()}
    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white border border-[#b2e2d2] shadow-md rounded-2xl p-6 flex items-center gap-4 cursor-pointer transition-all hover:shadow-lg duration-300"
  >
    <div className="p-3 rounded-full bg-[#2A806D]">
      <FaMoneyBillTrendUp className="text-2xl text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">You Are Owed</p>
      <h2 className="text-xl font-bold text-[#2A806D]">
        Rs {totalOwedToYou.toFixed(2)}
      </h2>
    </div>
  </div>

  <dialog ref={owesDialogRef} className="modal">
    <div className="modal-box max-w-md bg-white shadow-lg border border-[#f5d1bc]">
      <h3 className="font-bold text-lg text-[#e75151] mb-4">You Owe</h3>
      {owes.length > 0 ? (
        <ul className="list-disc pl-5 text-sm space-y-2 text-black">
          {owes.map((line, i) => (
            <li key={i}>
              You owe <span className="font-semibold">{line.name}</span> Rs {line.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">You owe nothing.</p>
      )}
      <div className="modal-action">
        <form method="dialog">
          <button className="btn btn-sm text-white bg-[#e75151]">Close</button>
        </form>
      </div>
    </div>
  </dialog>

  <dialog ref={owedDialogRef} className="modal">
    <div className="modal-box max-w-md bg-white shadow-lg border border-[#b2e2d2]">
      <h3 className="font-bold text-lg text-[#2A806D] mb-4">You Are Owed</h3>
      {owed.length > 0 ? (
        <ul className="list-disc pl-5 text-sm space-y-2 text-black">
          {owed.map((line, i) => (
            <li key={i}>
              <span className="font-semibold">{line.name}</span> owes you Rs {line.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No one owes you anything.</p>
      )}
      <div className="modal-action">
        <form method="dialog">
          <button className="btn btn-sm bg-[#2A806D] text-white">Close</button>
        </form>
      </div>
    </div>
  </dialog>

</div>

  );
};

export default DashboardCards;
