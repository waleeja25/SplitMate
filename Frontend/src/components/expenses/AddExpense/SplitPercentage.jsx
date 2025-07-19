import React from 'react';

const SplitPercentage = ({ selectedGroup, amount, percentages, setPercentages }) => {
  if (!selectedGroup) return null;

  return (
    // <div className="mb-4">
    //   <h4 className="font-medium mb-2">Split by Percentage</h4>
    //   {selectedGroup.members.map((member, idx) => {
    //     const percent = parseFloat(percentages[member.name] || 0);
    //     const share = ((amount * percent) / 100).toFixed(2);

    //     return (
    //       <div key={idx} className="flex gap-2 items-center mb-2">
    //         <span className="w-1/3">{member.name}</span>
    //         <input
    //           type="number"
    //           placeholder="e.g. 25"
    //           className="w-1/3 border p-1 rounded"
    //           value={percentages[member.name] || ''}
    //           onChange={(e) =>
    //             setPercentages({
    //               ...percentages,
    //               [member.name]: e.target.value,
    //             })
    //           }
    //         />
    //         <span className="w-1/3 text-right text-green-700">
    //           Rs {isNaN(share) ? '0.00' : share}
    //         </span>
    //       </div>
    //     );
    //   })}
    // </div>
    <div className="mb-6 p-4 rounded-2xl bg-white border border-[#d9f0ea] shadow-sm">
   <h4 className="text-2xl font-bold text-[#2a806d] mb-6">Split by Percentage</h4>
  {selectedGroup.members.map((member, idx) => {
    const percent = parseFloat(percentages[member.name] || 0);
    const share = ((amount * percent) / 100).toFixed(2);

    return (
      <div
        key={idx}
        className="flex items-center gap-4 mb-3 px-4 py-2 bg-white rounded-xl border border-[#d9f0ea]"
      >
        <span className="w-1/3 font-medium text-gray-700">{member.name}</span>
        <input
          type="number"
          placeholder="e.g. 25"
          className="w-2/3 px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b2e4d7] bg-[rgb(245_252_250)]"
          value={percentages[member.name] || ''}
          onChange={(e) =>
            setPercentages({
              ...percentages,
              [member.name]: e.target.value,
            })
          }
        />
        <span className="w-1/3 text-right font-medium text-green-700">
          Rs {isNaN(share) ? '0.00' : share}
        </span>
      </div>
    );
  })}
</div>

  );
};

export default SplitPercentage;
