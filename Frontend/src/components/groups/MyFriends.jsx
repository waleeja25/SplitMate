// import React, { useState } from "react";
// import alertDisplay from "../ui/alertDisplay";
// import UserAvatar from "../ui/UseAvatar";
// import { FiPlus } from "react-icons/fi";

// const MyFriends = ({ friends, setFriends }) => {
//   const [friendName, setFriendName] = useState("");
//   const [friendEmail, setFriendEmail] = useState("");
//   const [error, setError] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);

//   const addFriends = () => {
//     if (!friendName || !friendEmail) {
//       setError(true);
//       return;
//     }

//     const newList = [...friends, { name: friendName, email: friendEmail }];
//     setFriends(newList);
//     setFriendName("");
//     setFriendEmail("");
//     setShowDialog(false);
//     setError(false);
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto bg-[rgb(245,252,250)] min-h-screen">

//       <div className="text-center mb-8">
//         <h1 className="text-4xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#185144] via-[#36a186] to-[#2A806D] drop-shadow-sm">My Friends</h1>
//         <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits.</p>
//         <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
//       </div>
// <div className="flex justify-end">
//   <button
//     className="flex items-center gap-2 bg-[#2A806D] text-white px-4 py-2 rounded-lg hover:bg-[#246f5f] transition"
//     onClick={() => setShowDialog(true)}
//   >
//     <FiPlus className="text-lg" />
//     <span>Add Friend</span>
//   </button>
// </div>



//       {/* Friends List */}
//       <div className="grid gap-4 mt-6">
//         {friends.length === 0 ? (
//           <p className="text-gray-500 italic">No friends added yet.</p>
//         ) : (
//           friends.map((friend, index) => (
//             <div
//               key={index}
//               className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#B2E2D2]"
//             >
//               <UserAvatar name={friend.name} size={40} />
//               <div>
//                 <p className="font-medium text-[#333]">{friend.name}</p>
//                 <p className="text-sm text-gray-500">{friend.email}</p>
//               </div>
//             </div>
//           ))


//         )}
//       </div>

//       {/* Add Friend Dialog */}
//       {showDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg border border-[#B2E2D2]">
//             <h2 className="text-xl font-semibold text-[#2A806D] mb-4">
//               Add a New Friend
//             </h2>

//             {/* Live Avatar Preview */}
//             {friendName && (
//               <div className="mb-4 flex justify-center">
//                 <UserAvatar name={friendName} size={60} />
//               </div>
//             )}


//             <input
//               className="w-full mb-3 p-2 border border-[#ccc] rounded text-[#333]"
//               placeholder="Friend Name"
//               value={friendName}
//               onChange={(e) => setFriendName(e.target.value)}
//             />
//             <input
//               className="w-full mb-4 p-2 border border-[#ccc] rounded text-[#333]"
//               placeholder="Friend Email"
//               value={friendEmail}
//               onChange={(e) => setFriendEmail(e.target.value)}
//             />

//             {error &&
//               alertDisplay({
//                 type: "error",
//                 title: "Error",
//                 message: "Friend name and email are required.",
//               })}

//             <div className="flex justify-end space-x-3">
//               <button
//                 className="bg-[#a83434] text-white px-4 py-2 rounded hover:bg-[#d35151]"
//                 onClick={() => {
//                   setShowDialog(false);
//                   setError(false);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-[#2A806D] text-white px-4 py-2 rounded hover:bg-[#246f5f]"
//                 onClick={addFriends}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyFriends;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import alertDisplay from "../ui/alertDisplay";
import UserAvatar from "../ui/UseAvatar";
import { FiPlus } from "react-icons/fi";

const MyFriends = ({ friends, setFriends }) => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

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

  const handleFriendClick = (friend) => {
    navigate(`/myFriends/${encodeURIComponent(friend.name)}`, {
      state: { friend },
    });
    
  };
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-[rgb(245,252,250)] min-h-screen">
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

      {/* Friends List */}
      <div className="grid gap-4 mt-6">
        {friends.length === 0 ? (
          <p className="text-gray-500 italic">No friends added yet.</p>
        ) : (
          friends.map((friend, index) => (
            <div
              key={index}
              onClick={() => handleFriendClick(friend)}
              className="cursor-pointer flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#B2E2D2] hover:shadow-md transition"
            >
              <UserAvatar name={friend.name} size={40} />
              <div>
                <p className="font-medium text-[#333]">{friend.name}</p>
                <p className="text-sm text-gray-500">{friend.email}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Friend Dialog */}
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
