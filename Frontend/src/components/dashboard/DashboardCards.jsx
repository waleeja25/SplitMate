import { useRef } from 'react'

const DashboardCards = ({ totalBalance, totalYouOwe, totalOwedToYou, owes, owed }) => {
  const owesDialogRef = useRef(null);
  const owedDialogRef = useRef(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 mt-10">
      
      <div className="bg-white border border-[#d9f0ea] shadow-md rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
        <h2 className="text-2xl font-bold text-[#2A806D]">Rs {totalBalance.toFixed(2)}</h2>
      </div>

      <div
        onClick={() => owesDialogRef.current?.showModal()}
        className="bg-white border border-[#f5d1bc] shadow-md rounded-2xl p-6 text-center hover:cursor-pointer transition-all duration-300"
      >
        <p className="text-sm font-medium text-gray-500 mb-1">You Owe</p>
        <h2 className="text-2xl font-bold  text-[#ef4444]">Rs {totalYouOwe.toFixed(2)}</h2>
      </div>

      <div
        onClick={() => owedDialogRef.current?.showModal()}
        className="bg-white border border-[#b2e2d2] shadow-md rounded-2xl p-6 text-center hover:cursor-pointer transition-all duration-300"
      >
        <p className="text-sm font-medium text-gray-500 mb-1">You Are Owed</p>
        <h2 className="text-2xl font-bold text-[#2A806D]">Rs {totalOwedToYou.toFixed(2)}</h2>
      </div>

      <dialog ref={owesDialogRef} className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg  text-[#ef4444] mb-4">You Owe</h3>
          {owes.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-2 text-black">
              {owes.map((line, i) => (
                <li key={i}>
                  You owe <span className="font-semibold">{line.to}</span> Rs {line.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">You owe nothing.</p>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm text-white bg-[#ef4444]">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog ref={owedDialogRef} className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg text-[#2A806D] mb-4">You Are Owed</h3>
          {owed.length > 0 ? (
            <ul className="list-disc pl-5 text-sm space-y-2 text-black">
              {owed.map((line, i) => (
                <li key={i}>
                  <span className="font-semibold">{line.to}</span> owes you Rs {line.amount.toFixed(2)}
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
