import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../lib/expense-categories';
import { updateBalances } from './helpers';
import SplitEqual from './SplitEqual';
import SplitPercentage from './SplitPercentage';
import SplitExact from './SplitExact';
import SplitItemized from './SplitItemized';
import ExpenseSummaryModal from './ExpenseSummaryModal';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerComponent from '../../ui/DatePickerComponent';


import {
  calculateEqualSplit,
  calculatePercentageSplit,
  calculateExactSplit,
  calculateItemizedSplit,
} from './helpers';

const AddExpenseForm = ({ groups }) => {
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
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


  const navigate = useNavigate();
  const sessionUser = localStorage.getItem('username');
  const selectedGroup = groups.find((group) => group.name === groupSelected);
  const people = useMemo(() => {
    return selectedGroup ? selectedGroup : { members };
  }, [selectedGroup, members]);

  const handleAddItem = () => {
    setItems([...items, { name: '', cost: '', assignedTo: '' }]);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (members.length === 0) {
      setMembers([
        { name: sessionUser },
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


  const handleSubmit = (e) => {
    e.preventDefault();

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
      ({summary} = calculateExactSplit(people.members, exactAmounts, paidBy));
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
      // summary = calculateEqualSplit(people.members, expenseAmount, paidBy);
      ({ summary } = calculateEqualSplit(people.members, expenseAmount, paidBy));
    }
    console.log(summary);

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
      members: groupSelected ? null : members,
    };

    const existing = JSON.parse(localStorage.getItem("expenses") || "[]");
    localStorage.setItem("expenses", JSON.stringify([...existing, expense]));
    updateBalances(summary, paidBy, amount, splitType, date)
    setSubmittedExpense(expense);
    setShowSummary(true);


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
        <h1 className="text-3xl font-bold text-[#2a806d]">Add a New Expense</h1>
        <p className="text-[#4B4B4B] mt-1">
          Fill in the details below to split an expense across the group.
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
                    {member.name === sessionUser ? 'You' : member.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {!isGroup && (
            <>
              <label className="block mb-1 font-medium text-[#333]">Add Member</label>
              <div className="rounded mb-6">
                <input
                  type="text"
                  placeholder="Member Name"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
                />
                <input
                  type="email"
                  placeholder="Member Email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full p-2 mb-2 border border-[#ccc] rounded text-[#333]"
                />
                <button
                  onClick={handleAddMember}
                  className="w-full btn bg-[#2a806d] text-white rounded py-2"
                >
                  Add Member
                </button>
              </div>

              {/* Display Members as Tabs */}
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {members.map((member, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#e6f4f1] text-[#2a806d] border border-[#2a806d] text-sm"
                    >
                      {member.name}
                      {member.name === sessionUser && ' (You)'}
                      <button
                        onClick={() => {
                          setMembers((prev) => prev.filter((_, i) => i !== idx));
                          // Optional: update paidBy if deleted member was selected
                          if (paidBy === member.name) setPaidBy("");
                        }}
                        className="ml-2 text-[#2a806d] hover:text-red-600 font-bold"
                      >
                        ×
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
                    {member.name} {member.name === sessionUser ? "(You)" : ""}
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
          className="w-full py-2 mt-4 bg-[#2a806d] hover:bg-[#1cc29f] text-white rounded"
        >
          Add Expense
        </button>

        <ExpenseSummaryModal
          show={showSummary}
          expense={submittedExpense}
          onClose={() => {
            setShowSummary(false);
            navigate('/allExpenses');
          }}
        />


        {/* {dialogVisible && (
<dialog open className="modal modal-bottom sm:modal-middle">
  <form
    method="dialog"
    className={`modal-box ${
      splitType === 'itemizedExpense'
        ? 'w-[90vw] max-w-none'
        : 'max-w-md'
    }`}
  >
              <h3 className="font-bold text-lg">Split Expense - {splitType}</h3>
              <div className="py-4">
                {splitType === 'equal' && selectedGroup && (
                  <SplitEqual selectedGroup={selectedGroup} amount={amount} />
                )}
                {splitType === 'percentage' && selectedGroup && (
                  <SplitPercentage
                    percentages={percentages}
                    setPercentages={setPercentages}
                    amount={amount}
                    selectedGroup={selectedGroup}
                  />
                )}
                {splitType === 'exact' && selectedGroup && (
                  <SplitExact
                    exactAmounts={exactAmounts}
                    setExactAmounts={setExactAmounts}
                    selectedGroup={selectedGroup}
                  />
                )}
                {splitType === 'itemizedExpense' && selectedGroup && (
                  <SplitItemized
                    items={items}
                    setItems={setItems}
                    handleAddItem={handleAddItem}
                    taxPercent={taxPercent}
                    setTaxPercent={setTaxPercent}
                    tipPercent={tipPercent}
                    setTipPercent={setTipPercent}
                    selectedGroup={selectedGroup}
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
                  className="btn"
                >
                  Close
                </button>
              </div>
            </form>
          </dialog>
        )} */}
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
