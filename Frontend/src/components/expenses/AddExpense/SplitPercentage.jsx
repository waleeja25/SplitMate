import React from 'react';

const SplitPercentage = ({ selectedGroup, amount, percentages, setPercentages }) => {
  if (!selectedGroup) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Split by Percentage</h4>
      {selectedGroup.members.map((member, idx) => {
        const percent = parseFloat(percentages[member.name] || 0);
        const share = ((amount * percent) / 100).toFixed(2);

        return (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <span className="w-1/3">{member.name}</span>
            <input
              type="number"
              placeholder="e.g. 25"
              className="w-1/3 border p-1 rounded"
              value={percentages[member.name] || ''}
              onChange={(e) =>
                setPercentages({
                  ...percentages,
                  [member.name]: e.target.value,
                })
              }
            />
            <span className="w-1/3 text-right text-green-700">
              Rs {isNaN(share) ? '0.00' : share}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SplitPercentage;
