import React, { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const MyFriends = () => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [error, setError] = useState(false);
  const [friends, setFriends] = useState(() => {
    // ✅ Load from localStorage on first render only (not with useEffect)
    try {
      const stored = localStorage.getItem("friends");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  const addFriends = () => {
    if (!friendName || !friendEmail) {
      setError(true);
      return;
    }

    const newList = [...friends, { name: friendName, email: friendEmail }];
    setFriends(newList);
    setFriendName("");
    setFriendEmail("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Friends</h1>

      <input
        className="border-2 border-black mb-2 p-1"
        placeholder="Friend Name"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <br />
      <input
        className="border-2 border-black mb-2 p-1"
        placeholder="Friend Email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
      />
      <br />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded"
        onClick={addFriends}
      >
        Add Friend
      </button>

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

      {error && (
        <Stack sx={{ width: "100%" }} spacing={2} className="mb-4">
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Friend name and email are required.
          </Alert>
        </Stack>
      )}
    </div>
  );
};

export default MyFriends;
