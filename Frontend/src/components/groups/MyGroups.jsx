import { useNavigate } from 'react-router-dom';
import DicebearAvatar from '../ui/DicebearAvatar';
import { FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import alertDisplay from '../ui/alertDisplay';
import { FiTrash2 } from "react-icons/fi";

const MyGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const showAlert = (alertObj) => {
    setAlert(alertObj);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
  console.log(groups);


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
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);


  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="w-16 h-16 border-4 border-t-4 border-[#2A806D] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#2A806D] text-lg font-medium">Loading your groups...</p>
      </div>
    );
  }


  const handleGroupClick = (group) => {
    navigate(`/myGroups/${encodeURIComponent(group.name)}`, {
      state: { group },
    });
  };

  const handleDeleteGroup = async (groupId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3001/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setGroups(prev => prev.filter(g => g._id !== groupId));


        showAlert({
          type: "success",
          title: "Deleted",
          message: "Group deleted successfully",
          color: "#a5d6a7",
        });

      } else {
        showAlert({
          type: "error",
          title: "Error",
          message: data.message || "Failed to delete group"
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
          My Groups
        </h1>
        <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits.</p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate('/createGroup')}
          className="flex items-center gap-2 bg-[#2A806D] text-white px-4 py-2 rounded-lg hover:bg-[#246f5f] transition"

        >
          <FiPlus className="text-lg" />
          <span>Create Group</span>
        </button>
      </div>

      <div className="text-left w-full">
        {alert && alertDisplay(alert)}
      </div>

      <div className="grid gap-4 mt-6">
        {groups.length === 0 ? (
          <p className="text-center text-[#4B4B4B]">No groups created yet.</p>
        ) : (
          groups.map((group, index) => (
            <div
              key={index}
              onClick={() => handleGroupClick(group)}
              className="cursor-pointer flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#B2E2D2] hover:shadow-md transition duration-200"
            >
              <div className="flex-shrink-0">
                <DicebearAvatar name={group.name} size={48} />
              </div>

              <div className="flex flex-col flex-grow">
                <p className="font-medium text-[#333]">{group.name}</p>
                <p className="text-sm text-gray-500">
                  {group.members.length} member{group.members.length !== 1 && 's'}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group._id);
                }}
                className="text-red-500 hover:text-red-700 p-2 rounded"
              >
                <FiTrash2 size={20} />
              </button>
            </div>


          ))
        )}
      </div>
    </div>
  );
};

export default MyGroups;


