import React, { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const CreateGroup = ({friends, groups, setGroups}) => {
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

  const handleAddMember = () => {
    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError(true);
      return;
    }

    setMembers([...members, { name: memberName, email: memberEmail }]);
    setMemberName("");
    setMemberEmail("");
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

  setAddGroup(true);       // ✅ Show group added alert
  setSuccessAlert(true);   // (Optional: for another alert?)

  // Reset form
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
      {addGroup && groups.length > 0 && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="success" sx={{ backgroundColor: "	#a5d6a7" }}>
            <AlertTitle>Success</AlertTitle>
            Group added successfully.
          </Alert>
        </Stack>
      )}

      {groupError && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Group name is required.
          </Alert>
        </Stack>
      )}

      {singlememberError && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            At least one member must be added to the group.
          </Alert>
        </Stack>
      )}

      {memberError && !memberName && !memberEmail && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Member name and email are required.
          </Alert>
        </Stack>
      )}

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
             <h2 className="text-lg font-semibold mt-4">Friend List</h2>
      {friends.length === 0 ? (
        <p>No friends added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {friends.map((friend, index) => (
            <li key={index}>
              {friend.name} - {friend.email}
            </li>
          ))}
        </ul>
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
