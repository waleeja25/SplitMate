import React, { useState } from 'react';
import { FaUsers, FaUser } from 'react-icons/fa';

const MyGroups = ({ groups }) => {
  const [openGroupIndex, setOpenGroupIndex] = useState(null);

  const toggleGroup = (index) => {
    setOpenGroupIndex(openGroupIndex === index ? null : index);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-[rgb(245,252,250)] min-h-screen">
<div className="text-center mb-8 p-7 ">
  <h1 className="text-4xl font-bold text-[#2A806D] tracking-wide">My Groups</h1>
  <p className="text-[#4B4B4B] mt-1">Welcome to your SplitMate circle.</p>
  <div className="mt-2 border-b-2 border-[#2A806D] w-2/3 mx-auto" />
</div>

      {groups.length === 0 ? (
        <p className="text-center text-[#4B4B4B]">No groups created yet.</p>
      ) : (
        groups.map((group, index) => (
          <div
            key={index}
            className="border border-[#B2E2D2] rounded-xl mb-6 shadow-md bg-white"
          >
            <button
              onClick={() => toggleGroup(index)}
              className="w-full text-left px-4 py-3 bg-[#2A806D] text-white font-semibold rounded-t-xl hover:bg-[#246f5f] transition-colors flex items-center gap-3"
            >
              <FaUsers className="text-white" />
              {group.name}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openGroupIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-[#E7F9F6] px-4 py-4 text-[#4B4B4B] rounded-b-xl">
                <h4 className="font-semibold mb-2 text-[#2A806D]">Members:</h4>
                {group.members.length === 0 ? (
                  <p>No members in this group.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {group.members.map((member, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaUser className="text-[#2A806D]" />
                        {member.name} ({member.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyGroups;
