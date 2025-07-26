import React, { useState } from "react";
import alertDisplay from "../ui/alertDisplay";

const MyFriends = ({ friends, setFriends, displayList }) => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const addFriends = () => {
    if (!friendName || !friendEmail) {
      setError(true);
      return;
    }

    const newList = [...friends, { name: friendName, email: friendEmail }];
    setFriends(newList);
    setFriendName("");
    setFriendEmail("");
    setShowDialog(false);
    setError(false);
  };

  return (
    <div className="p-6 rounded-xl bg-[rgb(245,252,250)] min-h-screen">
      <h1 className="text-2xl font-bold text-[#2A806D] mb-4">My Friends</h1>

      <button
        className="bg-[#2A806D] text-white px-4 py-2 rounded-lg hover:bg-[#246f5f]"
        onClick={() => setShowDialog(true)}
      >
        Add Friend
      </button>

      {/* Display Friend List */}
      <div className="mt-6">{displayList("Friends", friends)}</div>

      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg border border-[#B2E2D2]">
            <h2 className="text-xl font-semibold text-[#2A806D] mb-4">
              Add a New Friend
            </h2>

            <input
              className="w-full mb-3 p-2 border border-[#ccc] rounded text-[#333]"
              placeholder="Friend Name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <input
              className="w-full mb-4 p-2 border border-[#ccc] rounded text-[#333]"
              placeholder="Friend Email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />

            {error &&
              alertDisplay({
                type: "error",
                title: "Error",
                message: "Friend name and email are required.",
              })}

            <div className="flex justify-end space-x-3">
              <button
                className="bg-[#a83434] text-white px-4 py-2 rounded hover:bg-[#d35151]"
                onClick={() => {
                  setShowDialog(false);
                  setError(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#2A806D] text-white px-4 py-2 rounded hover:bg-[#246f5f]"
                onClick={addFriends}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFriends;
