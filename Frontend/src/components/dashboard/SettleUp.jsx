import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { settleUp } from "../expenses/AddExpense/helpers";
import DatePickerComponent from "../ui/DatePickerComponent";
import UserAvatar from "../ui/UseAvatar";
import { useEffect } from "react";
import GroupSettlement from "./GroupSettlement";
import alertDisplay from "../ui/alertDisplay";
const backendUrl = import.meta.env.VITE_BACKEND_URI;

const SettleUpPage = () => {
  const currentUser = {
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token"),
    objectId: localStorage.getItem("objectId"),
  };
  const [selectedGroup, setSelectedGroup] = useState("");
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [payer, setPayer] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [alert, setAlert] = useState("");
  const [settleInGroup, setSettleInGroup] = useState(false);

  const showAlert = (alertObj) => {
    setAlert(alertObj);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const getUserNameById = (id) => {
    if (id === currentUser.objectId) return currentUser.name;

    if (transactionType === "individual") {
      return friends.find((f) => f.id === id)?.name || "Unknown";
    } else if (transactionType === "group") {
      const group = groups.find((g) => g._id === selectedGroup);
      return (
        group?.members.find((m) => m._id.toString() === id)?.name || "Unknown"
      );
    }
    return "Unknown";
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
              id: f.friend._id,
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
  }, [setFriends]);

  const [paymentMode, setPaymentMode] = useState("");
  const [transactionType, setTransactionType] = useState("individual");

  const handleSettle = async () => {
    if (!receiver || !amount || !payer) {
      showAlert({
        type: "error",
        title: "Error",
        message: "Please fill all required fields",
      });
      return;
    }
    let payerName = getUserNameById(payer);
    let receiverName = getUserNameById(receiver);

    try {
      const token = currentUser.token;

      if (transactionType === "individual") {
        const payload = {
          from: payer,
          to: receiver,
          amount: parseFloat(amount),
          paymentMode,
          type: "individual",
          date,
          settleInGroup,
        };

        const res = await fetch(`${backendUrl}/api/settlement`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Individual settlement failed");
        }
        settleUp(payer, receiver, parseFloat(amount));
      } else if (transactionType === "group") {
        const groupId = selectedGroup;
        if (!groupId) throw new Error("No group selected");

        const group = groups.find((g) => g._id === groupId);
        console.log("Selected group details:", group);
        const payload = {
          from: payer,
          to: receiver,
          amount: parseFloat(amount),
          paymentMode,
          type: transactionType,
          group: groupId,
          date,
        };
        const res = await fetch(`${backendUrl}/api/settlement`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Settlement failed");
        }
      }

      showAlert({
        type: "success",
        title: "Success",
        message: `Settled Rs ${amount} from ${payerName} to ${receiverName}`,
        color: "#a5d6a7",
      });

      setAmount("");
      setPayer("");
      setReceiver("");
      setPaymentMode("online");
      setTransactionType("individual");
    } catch (err) {
      console.error(err);
      showAlert({
        type: "error",
        title: "Error",
        message: err.message || "Something went wrong",
      });
    }
  };

  let payerOptions = [];
  if (transactionType === "individual") {
    payerOptions = friends;
  } else if (transactionType === "group") {
    const group = groups.find((g) => g._id === selectedGroup);
    if (group) {
      payerOptions = group.members.map((m) => ({
        id: m._id,
        name: m.name,
        email: m.email,
      }));
    }
  }
  return (
    <div className="max-w-3xl mx-auto p-6 bg-[rgb(245,252,250)] min-h-screen">
      <div className="w-full max-w-xl mx-auto p-5 bg-white border border-[#B2E2D2] rounded-xl shadow text-[#4B4B4B] mt-7 ">
        <div className="flex border-b border-[#B2E2D2]">
          <button
            onClick={() => setTransactionType("individual")}
            className={`flex-1 py-3 text-center font-medium ${
              transactionType === "individual"
                ? "border-b-2 border-[#2A806D] text-[#2A806D]"
                : "text-gray-500 hover:text-[#2A806D]"
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setTransactionType("group")}
            className={`flex-1 py-3 text-center font-medium ${
              transactionType === "group"
                ? "border-b-2 border-[#2A806D] text-[#2A806D]"
                : "text-gray-500 hover:text-[#2A806D]"
            }`}
          >
            Group
          </button>
        </div>
        <div className="text-left w-full m-3">
          {alert && alertDisplay(alert)}
        </div>

        <header className="px-7 py-6 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#185144] via-[#36a186] to-[#2A806D]">
            Settle Up
          </h1>
        </header>

        {transactionType === "group" ? (
          <GroupSettlement
            groups={groups}
            setGroups={setGroups}
            payer={payer}
            setPayer={setPayer}
            receiver={receiver}
            setReceiver={setReceiver}
            currentUser={currentUser}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            payerOptions={payerOptions}
          />
        ) : (
          <>
            <div className="p-3 space-y-6 text-[#4B4B4B]">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <UserAvatar name={payer} size={48} />
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
                  >
                    <option value="" disabled>
                      Select a payer
                    </option>

                    <option value={currentUser.objectId}>
                      {currentUser.name}
                    </option>

                    {payerOptions
                      .filter((f) => f.name !== currentUser.name)
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>

                <FaExchangeAlt
                  style={{ fontSize: "2rem" }}
                  className="text-[#4B4B4B]"
                />

                <div className="flex flex-col items-center">
                  <UserAvatar name={receiver} size={48} />

                  <select
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="mt-2 border border-[#B2E2D2] bg-white rounded px-3 py-1 text-sm"
                  >
                    <option value="" disabled>
                      Select a receiver
                    </option>
                    <option value={currentUser.objectId}>
                      {currentUser.name}
                    </option>

                    {payerOptions.map((friend) => (
                      <option key={friend.id} value={friend.id}>
                        {friend.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="p-6 space-y-3 text-[#4B4B4B]">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-[#2A806D]">
                Date
              </label>
              <DatePickerComponent date={date} setDate={setDate} />
            </div>

            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-[#2A806D]">
                Amount
              </label>
              <div className="flex items-center border border-[#B2E2D2] rounded px-3 bg-white">
                <span className="text-lg text-[#4B4B4B] pr-2">Rs</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full py-2 text-[#4B4B4B] outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#2A806D]">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border border-[#B2E2D2] bg-white rounded px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select Payment Mode
              </option>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {transactionType === "individual" && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={settleInGroup}
                onChange={(e) => setSettleInGroup(e.target.checked)}
                id="settleInGroup"
                className="w-4 h-4 text-[#2A806D] border-gray-300 rounded"
              />
              <label htmlFor="settleInGroup" className="text-sm text-[#4B4B4B]">
                Also settle in shared groups if applicable
              </label>
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={() => {
              setAmount("");
              setPayer(currentUser);
              setPaymentMode("online");
              setTransactionType("individual");
            }}
            className="btn px-5 py-2 text-sm bg-white border border-[#B2E2D2] text-[#4B4B4B] hover:bg-[#f0f0f0]"
          >
            Reset
          </button>
          <button
            onClick={handleSettle}
            className="btn px-5 py-2 text-sm bg-[#2A806D] text-white hover:bg-[#246f5f]"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettleUpPage;
