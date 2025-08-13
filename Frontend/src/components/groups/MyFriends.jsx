import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import alertDisplay from "../ui/alertDisplay";
import UserAvatar from "../ui/UseAvatar";
import { FiPlus } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const MyFriends = ({ friends, setFriends }) => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const showAlert = (alertObj) => {
    setAlert(alertObj);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const addFriends = async () => {
    if (!friendName || !friendEmail) {
      setError(true);
      return;
    }
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/api/friends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId, friendName, friendEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setFriends(prev => [
          ...prev,
          {
            id: data.friend._id,
            friendId: data.friend.friend._id,
            name: data.friend.friend.name,
            email: data.friend.friend.email
          }
        ]);
        setFriendName("");
        setFriendEmail("");
        setShowDialog(false);
        setError(false);
        showAlert({
          type: "success",
          title: "Success",
          message: "Friend added successfully"
        });
      } else {
        showAlert({
          type: "error",
          title: "Error",
          message: data.message || "Failed to add friend"
        });
      }
    } catch (err) {
      console.log(err.message)
      showAlert({
        type: "error",
        title: "Error",
        message: err.message
      });
    }
  };
  console.log(friends);

  const handleFriendClick = (friend) => {
    navigate(`/myFriends/${encodeURIComponent(friend.name)}`, {
      state: { friend },
    });
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3001/api/friends/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setFriends(data.friends.map(f => ({
            id: f._id,
            name: f.friend.name,
            email: f.friend.email
          })));
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
  }, [setFriends]);

  const handleDeleteFriend = async (friendId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setFriends(prev => prev.filter(f => f.id !== friendId));

        showAlert({
          type: "success",
          title: "Deleted",
          message: "Friend deleted successfully"
        });

      } else {
        showAlert({
          type: "error",
          title: "Error",
          message: data.message || "Failed to delete friend"
        });
      }
    } catch (err) {
      showAlert({
        type: "error",
        title: "Error",
        message: err.message
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-[rgb(245,252,250)] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#185144] via-[#36a186] to-[#2A806D]">
          My Friends
        </h1>
        <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits.</p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>

      <div className="flex justify-end">
        <button
          className="flex items-center gap-2 bg-[#2A806D] text-white px-4 py-2 rounded-lg hover:bg-[#246f5f] transition"
          onClick={() => setShowDialog(true)}
        >
          <FiPlus className="text-lg" />
          <span>Add Friend</span>
        </button>
      </div>
      <div className="text-left w-full">
        {alert && alertDisplay(alert)}
      </div>


      <div className="grid gap-4 mt-6">
        {friends.length === 0 ? (
          <p className="text-gray-500 italic">No friends added yet.</p>
        ) : (
          friends.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#B2E2D2] hover:shadow-md transition"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => handleFriendClick(friend)}
              >
                <UserAvatar name={friend.name} size={40} />
                <div>
                  <p className="font-medium text-[#333]">{friend.name}</p>
                  <p className="text-sm text-gray-500">{friend.email}</p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg border border-[#B2E2D2]">
            <h2 className="text-xl font-semibold text-[#2A806D] mb-4">Add a New Friend</h2>

            {friendName && (
              <div className="mb-4 flex justify-center">
                <UserAvatar name={friendName} size={60} />
              </div>
            )}

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
                onClick={() => {
                  addFriends();
                }}
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
