import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, ArrowLeftRight, PlusCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, getCategoryIcon } from "../../lib/expense-categories";
import DiceBearAvatar from "../ui/DicebearAvatar";
import UserAvatar from "../ui/UseAvatar";

export default function GroupExpensesCard() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [balance, setBalance] = useState({ amount: 0 });
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("expenses");
  const [settlements, setSettlements] = useState([]);
  const [owedToYou, setOwedToYou] = useState([]);
  const [youOwe, setYouOwe] = useState([]);
  const [groups, setGroups] = useState([]);

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
  }, []);

  const sessionUser = useMemo(
    () => ({
      name: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      objectId: localStorage.getItem("objectId"),
      token: localStorage.getItem("token"),
    }),
    []
  );

  const matchedGroup = groups.find((g) => String(g._id) === String(groupId));
  const members = useMemo(() => matchedGroup?.members || [], [matchedGroup]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionUser.token;

        const resExpenses = await fetch(
          `http://localhost:3001/api/expense/group/${groupId}/user/${sessionUser.objectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataExpenses = await resExpenses.json();
        if (dataExpenses.success) setGroupExpenses(dataExpenses.expenses);

        const resBalance = await fetch(
          `http://localhost:3001/api/group-balances/${groupId}/${sessionUser.objectId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataBalance = await resBalance.json();
        if (dataBalance.success) {
          const userBalances = dataBalance.user.balances || {};

          setBalance({
            amount: dataBalance.user.netBalance,
            details: userBalances,
          });

          const owedToYouArr = [];
          const youOweArr = [];

          console.log(userBalances);
          Object.entries(userBalances).forEach(([otherName, amt]) => {
            const member = members.find((m) => m.name === otherName);
            if (!member) return;

            if (amt > 0) {
              owedToYouArr.push(`${member.name} owes you Rs ${amt.toFixed(2)}`);
            } else if (amt < 0) {
              youOweArr.push(
                `You owe ${member.name} Rs ${Math.abs(amt).toFixed(2)}`
              );
            }
          });

          setOwedToYou(owedToYouArr);
          setYouOwe(youOweArr);
        }

        const resSettlements = await fetch(
          `http://localhost:3001/api/settlement/group/${groupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dataSettlements = await resSettlements.json();
        if (dataSettlements.success)
          setSettlements(dataSettlements.settlements);
      } catch (err) {
        console.error("Error fetching group data:", err);
      }
    };

    fetchData();
  }, [groupId, sessionUser, members]);

  console.log(owedToYou);
  console.log(youOwe);
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 min-h-screen">
      <button
        onClick={() => window.history.back()}
        className="btn btn-sm mb-8 btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <DiceBearAvatar name={matchedGroup?.name || ""} size={70} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">
              {matchedGroup?.name}
            </h1>
            <p className="text-sm text-gray-500">
              {members.length} member{members.length !== 1 && "s"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/settleUp")}
            className="btn btn-outline text-[#2A806D] hover:bg-[#2A806D] hover:text-white"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" /> Settle up
          </button>
          <button
            onClick={() => navigate("/addExpense")}
            className="btn btn-outline bg-[#2A806D] text-white hover:bg-[#368c79]"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#d9f0ea] rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-bold text-[#2a806d] mb-4">
              Total Balance
            </h2>
            <div className="text-center mb-6">
              {balance?.amount > 0 ? (
                <span className="text-2xl font-bold text-green-600">
                  +Rs {balance.amount.toFixed(2)}
                </span>
              ) : balance?.amount < 0 ? (
                <span className="text-2xl font-bold text-red-600">
                  -Rs {Math.abs(balance.amount).toFixed(2)}
                </span>
              ) : (
                <span className="text-1xl font-semibold text-gray-500">
                  All settled — no dues!
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-[#2a806d] mb-4">
              Group Balances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#f0fcf9] border border-[#a7f3d0] rounded-xl p-4 shadow-sm">
                <h4 className="text-[#1cc29f] font-semibold mb-2 text-base">
                  You are owed
                </h4>
                {owedToYou.length > 0 ? (
                  <ul className="text-gray-700 italic text-sm list-disc ml-5 space-y-1">
                    {owedToYou.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    No one owes you.
                  </p>
                )}
              </div>

              <div className="bg-[#fff7f7] border border-[#fecaca] rounded-xl p-4 shadow-sm">
                <h4 className="text-[#f87171] font-semibold mb-2 text-base">
                  You owe
                </h4>
                {youOwe.length > 0 ? (
                  <ul className="text-gray-700 italic text-sm list-disc ml-5 space-y-1">
                    {youOwe.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic text-sm">
                    You owe no one.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#d9f0ea] rounded-2xl p-5 shadow-md">
          <h2 className="text-xl font-bold text-[#2a806d] mb-4">
            Group Members
          </h2>
          <ul className="flex flex-col gap-3">
            {members.map((member) => (
              <li
                key={member._id}
                className="flex items-center gap-3  rounded-lg hover:bg-[#e5f6f3] transition"
              >
                <div>
                  <UserAvatar name={member.name} size={35} />
                </div>
                <span className="text-sm font-medium text-[#333]">
                  {member.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        role="tablist"
        className="flex space-x-2 mb-4 rounded-xl bg-[#e5f6f3] p-1"
      >
        <button
          role="tab"
          className={`flex-1 text-center font-medium text-[#2a806d] py-2 rounded-lg transition ${
            activeTab === "expenses"
              ? "bg-white shadow-md tab-active"
              : "hover:bg-[#d1eee5]"
          }`}
          onClick={() => setActiveTab("expenses")}
        >
          Expenses{" "}
          <span className="font-semibold">({groupExpenses.length})</span>
        </button>

        <button
          role="tab"
          className={`flex-1 text-center font-medium text-[#2a806d] py-2 rounded-lg transition ${
            activeTab === "settlements"
              ? "bg-white shadow-md tab-active"
              : "hover:bg-[#d1eee5]"
          }`}
          onClick={() => setActiveTab("settlements")}
        >
          Settlements{" "}
          <span className="font-semibold">({settlements.length})</span>
        </button>
      </div>

      {activeTab === "expenses" && (
        <div className="space-y-4">
          {groupExpenses.map((exp, idx) => {
            const CategoryIcon = getCategoryIcon(exp.category);
            const categoryName =
              getCategoryById(exp.category)?.name || "Unknown";
            const userId = sessionUser.objectId;
            let oweText = "";
            const userShare = exp.summary?.[sessionUser.name] || 0;
            const isPaidByYou = exp.paidBy?._id === userId;

            if (isPaidByYou) oweText = "You paid — others owe you";
            else if (userShare > 0)
              oweText = `You owe Rs ${userShare.toFixed(2)}`;
            else if (userShare < 0)
              oweText = `Owed to you Rs ${Math.abs(userShare).toFixed(2)}`;
            else oweText = "Settled up";

            return (
              <div
                key={idx}
                className="card bg-white border shadow-sm hover:shadow-md transition"
              >
                <div className="card-body space-y-2">
                  <div className="flex items-center gap-2 text-[#2a806d] font-semibold text-2xl">
                    <CategoryIcon className="w-6 h-6" />
                    <span>{categoryName}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm text-gray-600">
                    <p>
                      Paid by <strong>{exp.paidBy?.name || "Unknown"}</strong>{" "}
                      on{" "}
                      <span className="italic">
                        {new Date(exp.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>

                    <div className="text-right text-gray-500 italic text-sm">
                      {oweText}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
                    <p>
                      Total: <strong>Rs {exp.amount}</strong>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-4">
          {settlements.length === 0 ? (
            <p className="text-gray-500 text-center italic">
              No settlements yet
            </p>
          ) : (
            settlements.map((settlement, idx) => (
              <div
                key={idx}
                className="card bg-white border shadow-sm hover:shadow-md transition rounded-xl"
              >
                <div className="card-body space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#2a806d]">
                      {settlement.from.name === sessionUser.name
                        ? "You"
                        : settlement.from.name}{" "}
                      <span className="text-gray-700 font-normal">paid</span>{" "}
                      {settlement.to.name === sessionUser.name
                        ? "you"
                        : settlement.to.name}
                    </h3>
                    <span className="text-[#2a806d] font-bold text-xl">
                      Rs {settlement.amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="italic">
                      Mode: {settlement.paymentMode}
                    </span>
                    <span>
                      {new Date(settlement.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
