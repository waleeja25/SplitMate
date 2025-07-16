import React from 'react';

const SplitExact = ({ selectedGroup, exactAmounts, setExactAmounts }) => {
  if (!selectedGroup) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">Split by Exact Amount</h4>
      {selectedGroup.members.map((member, idx) => {
        const value = parseFloat(exactAmounts[member.name]) || 0;

        return (
          <div key={idx} className="flex flex-col gap-1 mb-3">
            <div className="flex gap-1 items-center">
              <span className="w-1/4">{member.name}</span>
              <input
                type="number"
                placeholder="e.g. 120"
                className="w-1/2 border p-1 rounded"
                value={exactAmounts[member.name] || ''}
                onChange={(e) =>
                  setExactAmounts({
                    ...exactAmounts,
                    [member.name]: e.target.value,
                  })
                }
              />
                <span className="ml-6">Rs {value.toFixed(2)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SplitExact;
