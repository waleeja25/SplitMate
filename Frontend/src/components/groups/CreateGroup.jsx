import React, { useState, useEffect } from "react";
import alertDisplay from "../ui/alertDisplay";
import {
  FaUserPlus,
  FaUsers,
  FaSave,
  FaPlusCircle,
  FaUserFriends,
} from "react-icons/fa";

const CreateGroup = ({ setGroups }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const [friends, setFriends] = useState([]);
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await fetch(`${backendUrl}/api/friends/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setFriends(
            data.friends.map((f) => ({
              id: f._id,
              name: f.friend.name,
              email: f.friend.email,
            }))
          );
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
  }, [backendUrl]);

  const handleAddMember = () => {
    const nameMissing = !memberName.trim();
    const emailMissing = !memberEmail.trim();

    setMemberNameError(nameMissing);
    setMemberEmailError(emailMissing);

    if (nameMissing || emailMissing) return;

    setMembers([
      ...members,
      { name: memberName.trim(), email: memberEmail.trim() },
    ]);

    setMemberName("");
    setMemberEmail("");

    setMemberNameError(false);
    setMemberEmailError(false);
  };

  const handleNewGroup = async () => {
    if (!groupName.trim()) {
      setGroupError(true);
      return;
    }
    if (members.length === 0) {
      setsingleMemberError(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const currentUser = {
        name: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
      };
      const allMembers = [currentUser, ...members];

      const res = await fetch(`${backendUrl}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: groupName,
          members: allMembers,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setGroups((prev) => [...prev, data.group]);
        setAddGroup(true);
        setSuccessAlert(true);
        setGroupName("");
        setMembers([]);
        isSaveName(false);
        setFriendList(false);
        setNewMember(false);
      } else {
        alertDisplay({
          type: "error",
          title: "Error",
          message: data.message || "Failed to create group",
        });
      }
    } catch (err) {
      alertDisplay({
        type: "error",
        title: "Error",
        message: err.message,
      });
    }
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
    <div className="bg-[rgb(245,252,250)] min-h-screen px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="text-center mb-8 p-7 ">
     <h1 className="text-4xl py-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#185144] via-[#36a186] to-[#2A806D]">
          Create a New Group
        </h1>
            <p className="text-[#4B4B4B] text-sm sm:text-base md:text-lg italic">
          Group your friends to split expenses easily and keep everything
          organized.
        </p>
    <div className="mt-3 border-b-2 border-[#2a806d] w-4/3 sm:w-1/2 md:w-2/3 mx-auto" />
      </div>

      <div className="mt-8 p-8 bg-[rgb(255,255,255)] border border-gray-300 rounded-xl shadow-md max-w-xl mx-auto transition-all duration-300">
        {addGroup &&
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
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#2a806d]">
              <FaSave /> Start a New Group
            </h2>

            <input
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
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
              className="flex items-center gap-2 px-4 py-2 bg-[#2a806d] hover:bg-[#256e5f] text-white rounded transition"
            >
              <FaSave /> Save Group Name
            </button>

            <hr className="my-6" />
          </>
        )}

        {saveName && (
          <>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
              <FaUsers className="shrink-0" />
              <span>
                Add Group Members to{" "}
                <span className="text-[#2a806d] font-bold ml-1">
                  {groupName}
                </span>
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button
                onClick={() => {
                  setFriendList(true);
                  setNewMember(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a806d] hover:bg-[#256e5f] text-white rounded transition w-full sm:w-auto"
              >
                <FaUserFriends /> Select from Friend's List
              </button>

              <button
                onClick={() => {
                  setNewMember(true);
                  setFriendList(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition w-full sm:w-auto"
              >
                <FaUserPlus /> Add New Member
              </button>
            </div>

            {friendList && (
              <div className="bg-white p-6 rounded-2xl shadow border border-[#B2E2D2] mb-6 text-[#4B4B4B]">
                <h2 className="text-xl font-semibold text-[#2A806D] mb-4">
                  Select Friend to Add
                </h2>

                {friends.length === 0 ? (
                  <p className="text-sm text-[#4B4B4B] italic">
                    No friends added yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <select
                      value={selectedFriendIndex}
                      onChange={(e) =>
                        setSelectedFriendIndex(Number(e.target.value))
                      }
                      className="p-3 rounded-lg border border-[#B2E2D2] bg-[#F5FCFA] text-[#2A806D] font-medium focus:outline-none focus:ring-2 focus:ring-[#2A806D] transition"
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
                      disabled={selectedFriendIndex === ""}
                      className="bg-[#2A806D] hover:bg-[#246f5f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-200"
                    >
                      Add to Group
                    </button>
                  </div>
                )}
              </div>
            )}
            {newMember && (
              <div className="bg-white p-6 rounded-2xl shadow border border-[#B2E2D2] mb-6">
                <h2 className="text-xl font-semibold text-[#2A806D] mb-4">
                  Add Member Manually
                </h2>

                <input
                  type="text"
                  placeholder="Member Name"
                  value={memberName}
                  onChange={(e) => {
                    setMemberName(e.target.value);
                    setMemberError(false);
                  }}
                  className="w-full mb-3 px-4 py-2 border border-[#ccc] rounded-lg text-[#4B4B4B]"
                />

                <input
                  type="email"
                  placeholder="Member Email"
                  value={memberEmail}
                  onChange={(e) => {
                    setMemberEmail(e.target.value);
                    setMemberError(false);
                  }}
                  className="w-full mb-4 px-4 py-2 border border-[#ccc] rounded-lg text-[#4B4B4B]"
                />

                <button
                  onClick={handleAddMember}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2a806d] hover:bg-[#256e5f] text-white rounded-lg transition"
                >
                  <FaPlusCircle /> Add Member
                </button>
              </div>
            )}

            {members.length > 0 && (
              <div className="bg-[#F6F9F8] p-5 rounded-xl border border-[#B2E2D2]">
                <h3 className="text-xl font-semibold text-[#2A806D] mb-3">
                  Added Members:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-[#4B4B4B]">
                  {members.map((member, index) => (
                    <li key={index} className="text-sm">
                      {member.name} ({member.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleNewGroup}
              className="mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
            >
              Add Group
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
