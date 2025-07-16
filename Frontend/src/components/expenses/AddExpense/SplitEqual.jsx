import React from 'react';

const SplitEqual = ({ selectedGroup, amount }) => {
  if (!selectedGroup) return null;

  const perHead =
    selectedGroup.members.length > 0
      ? (parseFloat(amount || 0) / selectedGroup.members.length).toFixed(2)
      : '0.00';

  return (
    <div className="mb-4 text-green-700">
      <h4 className="font-semibold mb-2">Each member owes: Rs {perHead}</h4>
      {selectedGroup.members.map((member, idx) => (
        <div key={idx}>
          {member.name}: <strong>Rs {perHead}</strong>
        </div>
      ))}
    </div>
  );
};


export default SplitEqual;
