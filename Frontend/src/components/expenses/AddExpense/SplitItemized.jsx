import React from "react";
const SplitItemized = ({
  items,
  setItems,
  selectedGroup,
  taxPercent,
  setTaxPercent,
  tipPercent,
  setTipPercent,
  handleAddItem,
  memberTotals,
  subtotal,
  tax,
  tip,
  grandTotal,
}) => {
  if (!selectedGroup) return null;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow border border-[#d9f0ea]">
      <h4 className="text-xl sm:text-2xl font-bold text-[#2a806d] mb-4 sm:mb-6">
        Itemized Expenses
      </h4>

      {items.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Item"
            value={item.name}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].name = e.target.value;
              setItems(newItems);
            }}
            className="p-3 rounded border border-gray-300 shadow-sm w-full md:col-span-3"
          />
          <input
            type="number"
            placeholder="Cost"
            value={item.cost}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].cost = e.target.value;
              setItems(newItems);
            }}
            className="p-3 rounded border border-gray-300 shadow-sm w-full md:col-span-2"
          />
          <select
            value={item.assignedTo}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx].assignedTo = e.target.value;
              setItems(newItems);
            }}
            className="p-3 rounded border border-gray-300 shadow-sm w-full md:col-span-5"
          >
            <option value="">Assign to</option>
            {selectedGroup.members.map((member, mIdx) => (
              <option key={mIdx} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const newItems = [...items];
              newItems.splice(idx, 1);
              setItems(newItems);
            }}
            className="text-red-600 font-medium hover:underline w-full md:col-span-2"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddItem}
        className="px-4 sm:px-5 py-2 mt-2 rounded bg-[#2a806d] text-white font-semibold hover:bg-[#1c5c4f] transition w-full sm:w-auto"
      >
        + Add Item
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block text-sm font-medium text-[#2a806d] mb-1">
            Tax %
          </label>
          <input
            type="number"
            placeholder="e.g. 5"
            value={taxPercent}
            onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
            className="w-full p-3 rounded border border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2a806d] mb-1">
            Tip %
          </label>
          <input
            type="number"
            placeholder="e.g. 10"
            value={tipPercent}
            onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
            className="w-full p-3 rounded border border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <div className="mt-8 bg-white border border-[#d9f0ea] rounded-xl p-4 sm:p-6 text-sm">
        <h5 className="text-lg sm:text-xl font-semibold text-[#2a806d] mb-4">
          Split Summary
        </h5>
        {subtotal > 0 &&
          selectedGroup.members.map((member, idx) => {
            const rawSub = parseFloat(memberTotals?.[member.name] || 0);
            const sub = rawSub.toFixed(2);
            const share = subtotal ? rawSub / subtotal : 0;
            const taxShare = (tax * share).toFixed(2);
            const tipShare = (tip * share).toFixed(2);
            const total = (
              rawSub +
              parseFloat(taxShare) +
              parseFloat(tipShare)
            ).toFixed(2);

            return (
              <div
                key={idx}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span className="text-gray-700">{member.name}</span>
                <span className="text-gray-800">
                  Rs {sub} + Rs {taxShare} tax + Rs {tipShare} tip ={" "}
                  <strong className="text-[#2a806d]">Rs {total}</strong>
                </span>
              </div>
            );
          })}

        {grandTotal !== undefined && !isNaN(grandTotal) && (
          <div className="mt-6 pt-4 border-t font-bold text-lg text-[#1c4f45]">
            Grand Total: Rs {grandTotal.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitItemized;
