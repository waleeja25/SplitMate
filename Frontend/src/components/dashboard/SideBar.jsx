// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Group,
//   PlusCircle,
//   List,
//   Wallet,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// import { motion, AnimatePresence } from "framer-motion";
// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = localStorage.getItem("username");
// //   const [isOpen, setIsOpen] = useState(true);

//   const navItems = [
//     { label: "Dashboard", route: "/dashboard", icon: <Home size={18} /> },
//     {
//       label: "Create Group",
//       route: "/createGroup",
//       icon: <PlusCircle size={18} />,
//     },
//     { label: "My Friends", route: "/myFriends", icon: <Users size={18} /> },
//     { label: "My Groups", route: "/myGroups", icon: <Group size={18} /> },
//     {
//       label: "Add Expense",
//       route: "/addExpense",
//       icon: <PlusCircle size={18} />,
//     },
//     { label: "All Expenses", route: "/allExpenses", icon: <List size={18} /> },
//     { label: "Settle Up", route: "/settleUp", icon: <Wallet size={18} /> },
//   ];

//   return (
//     <>
//       <AnimatePresence>
//           <motion.div
//             initial={{ x: -260 }}
//             animate={{ x: 0 }}
//             exit={{ x: -260 }}
//             transition={{ type: "spring", stiffness: 250, damping: 30 }}
//             className="
//     fixed lg:static
// +   top-[48px]
//     left-0
// -   h-[calc(100vh-50px)]
// +   max-h-100vh
// +   overflow-y-auto
//     w-64 
//     bg-[#f0faf6] 
//     border-r border-t border-[#d9f0ea] 
//     shadow-lg 
//     flex flex-col 
//     px-4 py-6 
//     z-40
//   "
//           >
//             {/* Greeting */}
//             <div className="flex flex-col items-center gap-1 mb-8 mt-9 relative">
//               {/* Text Content */}
//               <div className="z-10 text-center">
//                 <p className="text-lg font-medium text-gray-600 tracking-wide">
//                   Welcome,
//                 </p>
//                 <p className="text-1xl sm:text-2xl font-bold text-[#2A806D] ">
//                   {user}
//                 </p>
//               </div>
//             </div>

//             <ul className="space-y-2 flex-1">
//               {navItems.map(({ label, route, icon }) => {
//                 const isActive = location.pathname === route;
//                 return (
//                   <li
//                     key={label}
//                     onClick={() => {
//                       navigate(route);
//                     }}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold cursor-pointer group transition-all duration-300 ease-in-out 
//         ${
//           isActive
//             ? "bg-gradient-to-r from-[#d8f6ef] to-[#c2ede3] text-[#2A806D] font-semibold shadow-md"
//             : "text-[#4B4B4B] hover:bg-gradient-to-r hover:from-[#e8f8f4] hover:to-[#d8f6ef] hover:text-[#2A806D] hover:shadow-sm"
//         }`}
//                   >
//                     <span className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 text-[#2A806D]">
//                       {icon}
//                     </span>
//                     <span className="text-sm tracking-wide group-hover:font-medium transition-all duration-300">
//                       {label}
//                     </span>
//                   </li>
//                 );
//               })}
//             </ul>
//           </motion.div>
//       </AnimatePresence>
//     </>
//   );
// };

// export default Sidebar;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Group,
  PlusCircle,
  List,
  Wallet,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem("username");

  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle

  const navItems = [
    { label: "Dashboard", route: "/dashboard", icon: <Home size={18} /> },
    { label: "Create Group", route: "/createGroup", icon: <PlusCircle size={18} /> },
    { label: "My Friends", route: "/myFriends", icon: <Users size={18} /> },
    { label: "My Groups", route: "/myGroups", icon: <Group size={18} /> },
    { label: "Add Expense", route: "/addExpense", icon: <PlusCircle size={18} /> },
    { label: "All Expenses", route: "/allExpenses", icon: <List size={18} /> },
    { label: "Settle Up", route: "/settleUp", icon: <Wallet size={18} /> },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-[#cceee4] shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} className="text-[#2A806D]" /> : <Menu size={20} className="text-[#2A806D]" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className="
              fixed lg:static
              top-[48px]
              left-0
              max-h-screen
              overflow-y-auto
              w-64 
              bg-[#f0faf6] 
              border-r border-t border-[#d9f0ea] 
              shadow-lg 
              flex flex-col 
              px-4 py-6 
              z-40
            "
          >
            {/* Greeting */}
            <div className="flex flex-col items-center gap-1 mb-8 mt-9 relative">
              <div className="z-10 text-center">
                <p className="text-lg font-medium text-gray-600 tracking-wide">
                  Welcome,
                </p>
                <p className="text-1xl sm:text-2xl font-bold text-[#2A806D] ">
                  {user}
                </p>
              </div>
            </div>

            <ul className="space-y-2 flex-1">
              {navItems.map(({ label, route, icon }) => {
                const isActive = location.pathname === route;
                return (
                  <li
                    key={label}
                    onClick={() => {
                      navigate(route);
                      setIsOpen(false); // Auto-close on navigation
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold cursor-pointer group transition-all duration-300 ease-in-out 
                    ${
                      isActive
                        ? "bg-gradient-to-r from-[#d8f6ef] to-[#c2ede3] text-[#2A806D] font-semibold shadow-md"
                        : "text-[#4B4B4B] hover:bg-gradient-to-r hover:from-[#e8f8f4] hover:to-[#d8f6ef] hover:text-[#2A806D] hover:shadow-sm"
                    }`}
                  >
                    <span className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 text-[#2A806D]">
                      {icon}
                    </span>
                    <span className="text-sm tracking-wide group-hover:font-medium transition-all duration-300">
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always show on larger screens */}
      <div className="hidden lg:flex flex-col w-64 h-screen bg-[#f0faf6] border-r border-t border-[#d9f0ea] shadow-lg px-4 py-6">
        <div className="flex flex-col items-center gap-1 mb-8 mt-9 relative">
          <div className="z-10 text-center">
            <p className="text-lg font-medium text-gray-600 tracking-wide">
              Welcome,
            </p>
            <p className="text-1xl sm:text-2xl font-bold text-[#2A806D] ">
              {user}
            </p>
          </div>
        </div>
        <ul className="space-y-2 flex-1">
          {navItems.map(({ label, route, icon }) => {
            const isActive = location.pathname === route;
            return (
              <li
                key={label}
                onClick={() => navigate(route)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold cursor-pointer group transition-all duration-300 ease-in-out 
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#d8f6ef] to-[#c2ede3] text-[#2A806D] font-semibold shadow-md"
                    : "text-[#4B4B4B] hover:bg-gradient-to-r hover:from-[#e8f8f4] hover:to-[#d8f6ef] hover:text-[#2A806D] hover:shadow-sm"
                }`}
              >
                <span className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 text-[#2A806D]">
                  {icon}
                </span>
                <span className="text-sm tracking-wide group-hover:font-medium transition-all duration-300">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
