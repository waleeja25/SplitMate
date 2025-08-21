import React from "react";

const SplitExact = ({ selectedGroup, exactAmounts, setExactAmounts }) => {
  if (!selectedGroup) return null;
  return (
    <div className="mb-6 p-4 rounded-2xl bg-white border border-[#d9f0ea] shadow-sm">
      <h4 className="text-2xl font-bold text-[#2a806d] mb-6">
        Split by Exact Amount
      </h4>
      {selectedGroup.members.map((member, idx) => {
        const value = parseFloat(exactAmounts[member.name]) || 0;

        return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 px-4 py-2 bg-white rounded-xl border border-[#d9f0ea]"
          >
            <span className="sm:w-1/4 font-medium text-gray-700">
              {member.name}
            </span>
            <input
              type="number"
              placeholder="e.g. 120"
              className="w-full sm:w-1/2 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b2e4d7] bg-[rgb(245_252_250)]"
              value={exactAmounts[member.name] || ""}
              onChange={(e) =>
                setExactAmounts({
                  ...exactAmounts,
                  [member.name]: e.target.value,
                })
              }
            />
            <span className="sm:w-1/4 text-right font-medium text-green-700">
              Rs {value.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SplitExact;
