import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import UserAvatar from "../ui/UseAvatar";
import { useEffect } from "react";

const SettleUpPage = ({
  groups,
  setGroups,
  payer,
  setPayer,
  receiver,
  setReceiver,
  currentUser,
  selectedGroup,
  setSelectedGroup,
}) => {
  const [groupMembers, setGroupMembers] = useState([]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/groups/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          setGroups(data.groups);
        } else {
          console.error("Failed to fetch groups:", data.message);
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, [setGroups]);
  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);

    const group = groups.find((g) => g._id === groupId);
    if (group) {
      setGroupMembers(group.members);
    }
  };

  console.log("Payer", payer);
  console.log("Receiver", receiver);
  return (
    <div>
      <div className="flex flex-col items-center mb-4 px-7">
        <label className="block mb-1 text-sm font-medium text-[#2A806D]">
          Select Group
        </label>
        <select
          value={selectedGroup}
          onChange={(e) => handleGroupSelect(e.target.value)}
          className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-2 text-sm w-full"
        >
          <option value="">-- Select a Group --</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <UserAvatar name={payer} size={48} />
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
          >
            <option value={currentUser.objectId}>
              You ({currentUser.name})
            </option>
          </select>
        </div>

        <FaExchangeAlt
          style={{ fontSize: "2rem" }}
          className="text-[#4B4B4B]"
        />

        <div className="flex flex-col items-center">
          <UserAvatar name={receiver} size={48} />
          {selectedGroup ? (
            <select
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
            >
              <option value="" disabled>
                Select a Receiver
              </option>
              {groupMembers

                .filter((member) => member.name !== currentUser.name)
                .map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name === currentUser.name
                      ? `You (${currentUser.name})`
                      : member.name}
                  </option>
                ))}
            </select>
          ) : (
            <p className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm">
              Select a receiver
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettleUpPage;
