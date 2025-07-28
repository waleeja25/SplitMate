import { useNavigate } from 'react-router-dom';
import DicebearAvatar from '../ui/DicebearAvatar';
import { FiPlus } from "react-icons/fi";
const MyGroups = ({ groups }) => {
  const navigate = useNavigate();
  
  console.log(groups);


    const handleGroupClick = (group) => {
    navigate(`/myGroups/${encodeURIComponent(group.name)}`, {
      state: { group },
    });  
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
      {/* Avatar */}
      <div className="flex-shrink-0">
        <DicebearAvatar name={group.name} size={48} />
      </div>

      {/* Group Details */}
      <div className="flex flex-col">
        <p className="font-medium text-[#333]">
          {group.name}
        </p>
        <p className="text-sm text-gray-500">
          {group.members.length} member{group.members.length !== 1 && 's'}
        </p>
      </div>
    </div>
  ))
      )}
      </div>
    </div>
  );
};

export default MyGroups;



            {/* <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openGroupIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            > */}
              {/* <div className="bg-[#E7F9F6] px-4 py-4 text-[#4B4B4B] rounded-b-xl">
                <h4 className="font-semibold mb-2 text-[#2A806D]">Members:</h4>
                {group.members.length === 0 ? (
                  <p>No members in this group.</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {group.members.map((member, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaUser className="text-[#2A806D]" />
                        {member.name} ({member.email})
                      </li>
                    ))}
                  </ul>
                )}
              </div> */}

            {/* </div> */}