import React, { useState } from 'react';

const MyGroups = ({ groups }) => {
  const [openGroupIndex, setOpenGroupIndex] = useState(null);

  const toggleGroup = (index) => {
    setOpenGroupIndex(openGroupIndex === index ? null : index);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Groups</h2>

      {groups.length === 0 ? (
        <p className="text-gray-500">No groups created yet.</p>
      ) : (
        groups.map((group, index) => (
          <div
            key={index}
            className="border rounded mb-4 shadow-sm"
          >
            <button
              onClick={() => toggleGroup(index)}
              className="w-full text-left px-4 py-3 bg-cyan-700 text-white font-semibold hover:bg-cyan-800"
            >
              {group.name}
            </button>

            {openGroupIndex === index && (
              <div className="bg-gray-100 px-4 py-3 text-gray-700">
                <h4 className="font-medium mb-2">Members:</h4>
                {group.members.length === 0 ? (
                  <p>No members in this group.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {group.members.map((member, i) => (
                      <li key={i}>
                        {member.name} ({member.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyGroups;
