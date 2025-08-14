import { useState, useEffect, useMemo } from 'react';
import { getAllCategories } from '../../../lib/expense-categories';
import alertDisplay from '../../ui/alertDisplay';
import { updateBalances } from './helpers';
import SplitEqual from './SplitEqual';
import SplitPercentage from './SplitPercentage';
import SplitExact from './SplitExact';
import SplitItemized from './SplitItemized';
import ExpenseSummaryModal from './ExpenseSummaryModal';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerComponent from '../../ui/DatePickerComponent';
import { useExpenses } from '../../../context/UseExpenses';
import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateExactSplit,
  calculateItemizedSplit,
} from './helpers';
import { FaSpinner } from "react-icons/fa";

const AddExpenseForm = () => {
  const [alert, setAlert] = useState(null);
  const { expenses, setExpenses } = useExpenses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [friends, setFriends] = useState([])
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [groupSelected, setGroupSelected] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('');
  const [percentages, setPercentages] = useState({});
  const [exactAmounts, setExactAmounts] = useState({});
  const [items, setItems] = useState([{ name: '', cost: '', assignedTo: '' }]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [tipPercent, setTipPercent] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [submittedExpense, setSubmittedExpense] = useState(null);

  const [isGroup, setIsGroup] = useState(true);
  const [itemizedTotals, setItemizedTotals] = useState({
    memberTotals: {},
    subtotal: 0,
    tax: 0,
    tip: 0,
    grandTotal: 0,
  });

  expenses

  const showAlert = (alertObj) => {
    setAlert(alertObj);
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };
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


  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3001/api/friends/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setFriends(
            data.friends.map(f => ({
              id: f._id,
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
  }, []);


  const currentUser = {
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email")
  };

  const selectedGroup = groups.find((group) => group.name === groupSelected);

  const people = useMemo(() => {
    if (selectedGroup && Array.isArray(selectedGroup.members)) {
      return { members: selectedGroup.members };
    }
    return { members: Array.isArray(members) ? members : [] };
  }, [selectedGroup, members]);


  const handleAddItem = () => {
    setItems([...items, { name: '', cost: '', assignedTo: '' }]);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (members.length === 0) {
      setMembers([
        { name: currentUser.name, email: currentUser.email },
        { name: memberName.trim(), email: memberEmail.trim() }
      ]);
    } else {
      setMembers([
        ...members,
        { name: memberName.trim(), email: memberEmail.trim() }
      ]);
    }
    setMemberName("");
    setMemberEmail("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!amount || !category || !date) {
      alert('Please fill out all fields.');
      return;
    }

    const expenseAmount = parseFloat(amount || 0);
    let summary = {};

    if (splitType === 'exact') {
      const total = Object.values(exactAmounts).reduce((a, b) => a + parseFloat(b || 0), 0);
      if (Math.abs(total - expenseAmount) > 0.01) {
        alert("Exact amounts do not match total.");
        return;
      }
      ({ summary } = calculateExactSplit(people.members, exactAmounts, paidBy));
    }


    if (splitType === 'itemizedExpense') {
      for (const item of items) {
        if (!item.name || !item.cost || !item.assignedTo) {
          alert("All item fields must be filled.");
          return;
        }
      }

      const result = calculateItemizedSplit(
        people.members,
        items,
        taxPercent,
        tipPercent,
        paidBy
      );

      summary = result.summary;

      setItemizedTotals({
        memberTotals: result.memberTotals,
        subtotal: result.subtotal,
        tax: result.tax,
        tip: result.tip,
        grandTotal: result.grandTotal,
      });
    }

    if (splitType === 'percentage') {
      const result = calculatePercentageSplit(people.members, percentages, expenseAmount, paidBy);
      if (result.error) {
        alert(result.error);
        return;
      }
      summary = result.summary;
    }

    if (splitType === 'equal') {
      ({ summary } = calculateEqualSplit(people.members, expenseAmount, paidBy));
    }
    const formattedMembers = Array.isArray(people.members)
      ? people.members.map(m => ({ name: m.name, email: m.email }))
      : [];
    const groupMembers = groupSelected
      ? groups.find(g => g.name === groupSelected)?.members || []
      : [];


    const expense = {
      amount: expenseAmount,
      category,
      date,
      group: groupSelected || null,
      paidBy,
      splitType,
      percentages: splitType === 'percentage' ? percentages : null,
      exactAmounts: splitType === 'exact' ? exactAmounts : null,
      items: splitType === 'itemizedExpense' ? items : null,
      taxPercent: splitType === 'itemizedExpense' ? taxPercent : null,
      tipPercent: splitType === 'itemizedExpense' ? tipPercent : null,
      summary,
      members: groupSelected ? groupMembers : formattedMembers,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch('http://localhost:3001/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to save expense.');
      }

      updateBalances(summary, paidBy, amount, splitType, date)
      setExpenses(prev => [...prev, result.expense]);
      setSubmittedExpense(result.expense);
      setShowSummary(true);

      showAlert({
        type: "success",
        title: "Success",
        message: "Expense added successfully",
        color: "#a5d6a7",
      });

      setAmount('');
      setCategory('');
      setDate('');
      setGroupSelected('');
      setPaidBy('');
      setPercentages({});
      setExactAmounts({});
      setItems([{ name: '', cost: '', assignedTo: '' }]);
      setTaxPercent(0);
      setTipPercent(0);
      setSplitType('');

      setItemizedTotals({
        memberTotals: {},
        subtotal: 0,
        tax: 0,
        tip: 0,
        grandTotal: 0,
      });
      setMembers([]);
    } catch (err) {
      console.log(err.message)
      showAlert({
        type: "error",
        title: "Error",
        message: err.message
      });
    } finally {
      setIsSubmitting(false); 
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
  };
  useEffect(() => {
    if (splitType === 'itemizedExpense' && people) {
      const result = calculateItemizedSplit(
        people.members,
        items,
        taxPercent,
        tipPercent,
        paidBy
      );

      setItemizedTotals({
        memberTotals: result.memberTotals,
        subtotal: result.subtotal,
        tax: result.tax,
        tip: result.tip,
        grandTotal: result.grandTotal,
      });
    }
  }, [splitType, people, items, taxPercent, tipPercent, paidBy]);



  return (
    <div>
      <div className="text-center mb-3 p-7">
        <p className="text-4xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2A806D] via-[#36a186] to-[#2A806D] drop-shadow-sm">Add a new Expense</p>
        <p className="text-[#4B4B4B] mt-1">
          Log your expense and let us handle the split.
        </p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-1/3 mx-auto" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">

        <div className="w-full flex mb-6 rounded-lg border border-[#2a806d]">
          <button
            type="button"
            onClick={() => setIsGroup(false)}
            className={`px-4 py-2 w-1/2 text-sm font-medium transition-colors duration-200 
      ${!isGroup ? 'bg-[#2a806d] text-white' : 'bg-white text-[#2a806d]'} 
      rounded-l-lg border-r border-[#2a806d]`}
          >
            Individual Expense
          </button>
          <button
            type="button"
            onClick={() => setIsGroup(true)}
            className={`px-4 py-2 w-1/2 text-sm font-medium transition-colors duration-200 
      ${isGroup ? 'bg-[#2a806d] text-white' : 'bg-white text-[#2a806d]'} 
      rounded-r-lg`}
          >
            Group Expense
          </button>
        </div>

        <div className="text-left w-full m-3">
          {alert && alertDisplay(alert)}
        </div>

        <label className=" block mb-1 font-medium text-[#333]">Amount</label>
        <input
          type="number"
          placeholder='0.00'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
        />

        <label className=" block mb-1 font-medium text-[#333]">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
        >
          <option value="">-- Select Category --</option>
          {getAllCategories().map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <DatePickerComponent date={date} setDate={setDate} />
        {isGroup && (
          <div>
            <label className="block mb-1 font-medium text-[#333]">Group</label>
            <select
              value={groupSelected}
              onChange={(e) => setGroupSelected(e.target.value)}
              className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
            >
              <option value="">Select Group</option>
              {groups.map((group, idx) => (
                <option key={idx} value={group.name}>
                  {group.name} ({group.members.length} members)
                </option>
              ))}
            </select>

            <label className="block mb-1 font-medium text-[#333]">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              disabled={!selectedGroup}
              className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
            >
              <option value="">Select who paid</option>
              {selectedGroup?.members.map((member, idx) => (
                <option key={idx} value={member.name}>
                  {member.name === currentUser ? 'You' : member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!isGroup && (
          <>
            <label className="block mb-1 font-medium text-[#333]">Add Member</label>
            <div className="rounded mb-6 relative">
             
              <input
                list="friend-suggestions"
                type="text"
                placeholder="Member's Name"
                value={memberName}
                onChange={(e) => {
                  const name = e.target.value;
                  setMemberName(name);

                  const matchedFriend = friends.find(friend => friend.name === name);
                  if (matchedFriend) {
                    setMemberEmail(matchedFriend.email);
                  }
                }}
                className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
              />

              <datalist id="friend-suggestions">
                {friends.map((friend, idx) => (
                  <option key={idx} value={friend.name}>
                    {friend.name} ({friend.email})
                  </option>
                ))}
              </datalist>

              <input
                type="email"
                placeholder="Member's Email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
              />

              <button
                onClick={handleAddMember}
                className="w-full btn bg-[#2a806d] text-white rounded py-2 hover:bg-[#246c5c]"
              >
                Add Member
              </button>
            </div>

            {members.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {members.map((member, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-[#e6f4f1] text-[#2a806d] border border-[#2a806d] text-sm"
                  >
                    {member.name}
                    {member.name === currentUser?.name && ' (You)'}

                    <button
                      onClick={() => {
                        setMembers((prev) => prev.filter((_, i) => i !== idx));
                        if (paidBy === member.name) setPaidBy("");
                      }}
                      className="ml-2 text-[#2a806d] hover:text-red-600 font-bold"
                    >
                    </button>
                  </span>
                ))}
              </div>
            )}

            <label className="block mb-1 font-medium text-[#333]">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              disabled={members.length === 0}
              className="w-full p-2 mb-4 border border-[#ccc] rounded text-[#333]"
            >
              <option value="">Select who paid</option>
              {members.map((member, idx) => (
                <option key={idx} value={member.name}>
                  {member.name} {member.name === currentUser ? "(You)" : ""}
                </option>
              ))}
            </select>
          </>
        )}

        <label className="w-full block mb-1 font-medium text-[#333]">Split Type</label>
        <div className="w-full flex gap-2 mb-4">
          {['equal', 'percentage', 'exact', 'itemizedExpense'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSplitType(type);
                setDialogVisible(true);
              }}
              className={`w-1/4 px-3 py-1 border rounded ${splitType === type ? 'bg-[#2a806d] text-white' : 'text-[#333]'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 mt-4 bg-[#2a806d] hover:bg-[#53b8a2] text-white rounded flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Submitting Your Expense
            </>
          ) : (
            "Add Expense"
          )}
        </button>

        <ExpenseSummaryModal
          show={showSummary}
          expense={submittedExpense}
          onClose={() => {
            setShowSummary(false);

          }}
        />

        {dialogVisible && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <form
              method="dialog"
              className={`modal-box ${splitType === 'itemizedExpense'
                ? '!w-[80vw] !max-w-[80vw] sm:!w-[65vw] sm:!max-w-[80vw]'
                : ''
                }`}
            >

              <div className="py-1">
                {splitType === 'equal' && (
                  <SplitEqual selectedGroup={people} amount={amount} />
                )}
                {splitType === 'percentage' && (
                  <SplitPercentage
                    percentages={percentages}
                    setPercentages={setPercentages}
                    amount={amount}
                    selectedGroup={people}
                  />
                )}
                {splitType === 'exact' && (
                  <SplitExact
                    exactAmounts={exactAmounts}
                    setExactAmounts={setExactAmounts}
                    selectedGroup={people}
                  />
                )}
                {splitType === 'itemizedExpense' && (
                  <SplitItemized
                    items={items}
                    setItems={setItems}
                    handleAddItem={handleAddItem}
                    taxPercent={taxPercent}
                    setTaxPercent={setTaxPercent}
                    tipPercent={tipPercent}
                    setTipPercent={setTipPercent}
                    selectedGroup={people}
                    memberTotals={itemizedTotals.memberTotals}
                    subtotal={itemizedTotals.subtotal}
                    tax={itemizedTotals.tax}
                    tip={itemizedTotals.tip}
                    grandTotal={itemizedTotals.grandTotal}
                  />
                )}
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setDialogVisible(false)}
                  className="btn  bg-[#2a806d]  text-white rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </dialog>
        )}
      </form>
    </div>

  );
};

export default AddExpenseForm;
