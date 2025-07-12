import React, { useState, useEffect } from "react";
import alertDisplay from "../utils/alertDisplay";

const CreateGroup = ({ friends, groups, setGroups }) => {
  const [groupName, setGroupName] = useState("");
  const [saveName, isSaveName] = useState(false);
  const [friendList, setFriendList] = useState(false);
  const [newMember, setNewMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [addGroup, setAddGroup] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const [memberError, setMemberError] = useState(false);
  const [singlememberError, setsingleMemberError] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [memberNameError, setMemberNameError] = useState(false);
  const [memberEmailError, setMemberEmailError] = useState(false);
  const [selectedFriendIndex, setSelectedFriendIndex] = useState("");

  const handleAddFriendToGroup = () => {
  if (selectedFriendIndex === "") return;

  const selectedFriend = friends[selectedFriendIndex];

  // Check for duplicate
  const alreadyAdded = members.some(
    (m) => m.email.toLowerCase() === selectedFriend.email.toLowerCase()
  );

  if (alreadyAdded) {
    alertDisplay({
      type: "error",
      title: "Duplicate Member",
      message: "This friend is already added to the group.",
    });
    return;
  }

  setMembers([...members, selectedFriend]);
  setSelectedFriendIndex("");
};


 const handleAddMember = () => {
  const nameMissing = !memberName.trim();
  const emailMissing = !memberEmail.trim();

  setMemberNameError(nameMissing);
  setMemberEmailError(emailMissing);

  if (nameMissing || emailMissing) return;

  setMembers([...members, { name: memberName.trim(), email: memberEmail.trim() }]);

  setMemberName("");
  setMemberEmail("");

  setMemberNameError(false);
  setMemberEmailError(false);
};


  const handleNewGroup = () => {
    if (!groupName.trim()) {
      setGroupError(true);
      return;
    }
    if (members.length === 0) {
      setsingleMemberError(true);
      return;
    }

    const newGroup = {
      name: groupName,
      members: [...members],
    };
    setGroups([...groups, newGroup]);

    setAddGroup(true); 
    setSuccessAlert(true); 
    
    setGroupName("");
    setMembers([]);
    isSaveName(false);
    setFriendList(false);
    setNewMember(false);
  };

  useEffect(() => {
    if (groupError || memberError || singlememberError || successAlert) {
      const timer = setTimeout(() => {
        setGroupError(false);
        setMemberError(false);
        setsingleMemberError(false);
        setSuccessAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [groupError, memberError, singlememberError, successAlert]);

  useEffect(() => {
    if (addGroup) {
      const timer = setTimeout(() => {
        setAddGroup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addGroup]);

  return (
    <div className="mt-12 p-8 bg-white border border-gray-500 rounded-lg shadow-md max-w-xl mx-auto">
      {addGroup &&
        groups.length > 0 &&
        alertDisplay({
          type: "success",
          title: "Success",
          message: "Group added successfully",
          color: "#a5d6a7",
        })}

      {groupError &&
        alertDisplay({
          type: "error",
          title: "Error",
          message: "Group name is required",
        })}

      {singlememberError &&
        alertDisplay({
          type: "error",
          title: "Error",
          message: "At least one member must be added to the group.",
        })}

        


{(memberNameError || memberEmailError) &&
  alertDisplay({
    type: "error",
    title: "Incomplete Member Info",
    message:
      memberNameError && memberEmailError
        ? "Member name and email are required."
        : memberNameError
        ? "Name is missing."
        : "Email is missing.",
  })}


      {!saveName && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Start a New Group</h2>

          <input
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full mb-6"
          />

          <button
            onClick={() => {
              if (!groupName.trim()) {
                setGroupError(true);
                isSaveName(false);
              } else {
                setGroupError(false);
                isSaveName(true);
              }
            }}
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded"
          >
            Save
          </button>

          <hr className="my-6" />
        </>
      )}

      {saveName && (
        <>
          <h2 className="text-xl font-semibold mb-2">
            Add Group Members to{" "}
            <span className="text-cyan-700">{groupName}</span>
          </h2>

          <div className="space-x-4 mb-4">
            <button
              onClick={() => {
                setFriendList(true);
                setNewMember(false);
              }}
              className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded"
            >
              Select from Friend's List
            </button>

            <button
              onClick={() => {
                setNewMember(true);
                setFriendList(false);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              Add New
            </button>
          </div>

{friendList && (
  <div className="bg-gray-100 p-4 rounded mb-6 text-gray-700">
    <h2 className="text-lg font-semibold mt-4">Select Friend to Add</h2>

    {friends.length === 0 ? (
      <p>No friends added yet.</p>
    ) : (
      <div className="flex flex-col gap-4">
        <select
          value={selectedFriendIndex}
          onChange={(e) => setSelectedFriendIndex(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="">-- Choose a friend --</option>
          {friends.map((friend, index) => (
            <option key={index} value={index}>
              {friend.name} ({friend.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleAddFriendToGroup}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={selectedFriendIndex === ""}
        >
          Add to Group
        </button>
      </div>
    )}
  </div>
)}


          {newMember && (
            <div className="bg-gray-100 p-4 rounded mb-6">
              <input
                type="text"
                placeholder="Member Name"
                value={memberName}
                onChange={(e) => {
                  setMemberName(e.target.value);
                  setMemberError(false);
                }}
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Member Email"
                value={memberEmail}
                onChange={(e) => {
                  setMemberEmail(e.target.value);
                  setMemberError(false);
                }}
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Add Member
              </button>
            </div>
          )}

          {members.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Added Members:</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {members.map((member, index) => (
                  <li key={index}>
                    {member.name} ({member.email})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleNewGroup}
            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
          >
            Add Group
          </button>
        </>
      )}
    </div>
  );
};

export default CreateGroup;
