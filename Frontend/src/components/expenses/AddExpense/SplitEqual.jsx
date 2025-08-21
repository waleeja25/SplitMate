import React from "react";

const SplitEqual = ({ selectedGroup, amount }) => {
  if (!selectedGroup) return null;

  const perHead =
    selectedGroup.members.length > 0
      ? (parseFloat(amount || 0) / selectedGroup.members.length).toFixed(2)
      : "0.00";

  return (
    <div className="mb-6 p-5 rounded-2xl bg-white shadow border border-[#d9f0ea]">
      <h4 className="text-2xl font-bold text-[#2a806d] mb-6">Split Equally</h4>

      <h4 className="text-xl font-bold text-[#2a806d] mb-4">
        Each member owes: <span className="text-[#1c4f45]">Rs {perHead}</span>
      </h4>

      <div className="grid gap-3">
        {selectedGroup.members.map((member, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                       bg-white rounded-lg px-4 py-2 shadow-sm border border-[#e5f6f3]"
          >
            <span className="text-[#333] font-medium mb-2 sm:mb-0">
              {member.name}
            </span>
            <span className="px-3 py-1 text-[#2a806d] rounded-full text-sm font-semibold bg-[rgb(245_252_250)]">
              Rs {perHead}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitEqual;
