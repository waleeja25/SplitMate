"use client";
import React from "react";

const MemberManager = ({
  isGroup,
  sessionUser,
  friends = [],
  members,
  setMembers,
  memberName,
  setMemberName,
  memberEmail,
  setMemberEmail,
  paidBy,
  setPaidBy,
  handleAddMember,
}) => {
  if (isGroup) return null;

  const handleSelectFriend = (e) => {
    const selectedFriend = friends.find(f => f.name === e.target.value);
    if (selectedFriend && !members.some(m => m.name === selectedFriend.name)) {
      setMembers(prev => [...prev, selectedFriend]);
    }
    e.target.value = ""; // Reset dropdown
  };

  const handleRemoveMember = (idx, name) => {
    setMembers(prev => prev.filter((_, i) => i !== idx));
    if (paidBy === name) setPaidBy("");
  };

  return (
    <>
      {/* Select from Friends */}
      {friends.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium text-[#333]">Add from Friends</label>
          <select
            className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
            onChange={handleSelectFriend}
          >
            <option value="">Select a friend</option>
            {friends
              .filter(friend => !members.some(m => m.name === friend.name))
              .map((friend, idx) => (
                <option key={idx} value={friend.name}>
                  {friend.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Manual Add Member Inputs */}
      <label className="block mb-1 font-medium text-[#333]">Add Member</label>
      <div className="rounded mb-6">
        <input
          type="text"
          placeholder="Member Name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
          className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
        />
        <input
          type="email"
          placeholder="Member Email"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
        />
        <button
          onClick={handleAddMember}
          className="w-full btn bg-[#2a806d] text-white rounded py-2"
        >
          Add Member
        </button>
      </div>

      {/* Member Pills */}
      {members.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {members.map((member, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1 rounded-full bg-[#e6f4f1] text-[#2a806d] border border-[#2a806d] text-sm"
            >
              {member.name}
              {member.name === sessionUser && ' (You)'}
              <button
                onClick={() => handleRemoveMember(idx, member.name)}
                className="ml-2 text-[#2a806d] hover:text-red-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Paid By Selector */}
      <label className="block mb-1 font-medium text-[#333]">Paid By</label>
      <select
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
        disabled={members.length === 0}
        className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
      >
        <option value="">Select who paid</option>
        {members.map((member, idx) => (
          <option key={idx} value={member.name}>
            {member.name} {member.name === sessionUser ? "(You)" : ""}
          </option>
        ))}
      </select>
    </>
  );
};

export default MemberManager;
