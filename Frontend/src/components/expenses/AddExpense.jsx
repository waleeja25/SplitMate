import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, getCategoryById, getCategoryIcon } from '../../lib/expense-categories';

const categories = [
    'Food & Drink', 'Coffee', 'Groceries', 'Shopping', 'Transportation',
    'Utilities', 'Travel', 'Entertainment', 'Health', 'Education',
    'Maintenance', 'Gifts', 'Mobile',
];

const AddExpense = ({ groups }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [groupSelected, setGroupSelected] = useState('');
    const [paidBy, setPaidBy] = useState('');
    const [splitType, setSplitType] = useState('');
    const [percentages, setPercentages] = useState({});
    const [exactAmounts, setExactAmounts] = useState({});
    const [showSummary, setShowSummary] = useState(false);
    const [submittedExpense, setSubmittedExpense] = useState(null);
    const navigate = useNavigate();

    const [items, setItems] = useState([
        { name: '', cost: '', assignedTo: '' }
    ]);

    const sessionUser = localStorage.getItem('username');

    const [taxPercent, setTaxPercent] = useState(0);
    const [tipPercent, setTipPercent] = useState(0);

    const selectedGroup = groups.find((group) => group.name === groupSelected);
    let memberTotals = {};
    let subtotal = 0, tax = 0, tip = 0, grandTotal = 0;

    if (splitType === 'itemizedExpense' && selectedGroup) {
        memberTotals = {};
        selectedGroup.members.forEach(m => {
            memberTotals[m.name] = 0;
        });

        items.forEach(item => {
            const cost = parseFloat(item.cost || 0);
            if (item.assignedTo) {
                memberTotals[item.assignedTo] += cost;
            }
        });

        subtotal = Object.values(memberTotals).reduce((a, b) => a + b, 0);
        tax = (subtotal * taxPercent) / 100;
        tip = (subtotal * tipPercent) / 100;
        grandTotal = subtotal + tax + tip;
    }

    const handleAddItem = () => {
        setItems([...items, { name: '', cost: '', assignedTo: '' }]);
    };

    const total =
        selectedGroup && selectedGroup.members.length > 0
            ? (parseFloat(amount || 0) / selectedGroup.members.length).toFixed(2)
            : '0.00';

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !category || !date || !groupSelected || !paidBy) {
            alert('Please fill out all fields.');
            return;
        }

        if (splitType === 'percentage') {
            const totalPercent = Object.values(percentages)
                .reduce((sum, val) => sum + parseFloat(val || 0), 0);
            if (totalPercent !== 100) {
                alert(`Total percentage must be exactly 100%. You have ${totalPercent}%.`);
                return;
            }
        }

        const expenseAmount = parseFloat(amount || 0);
        const summary = {};

        if (splitType === 'equal' && selectedGroup) {
            const perHead = (expenseAmount / selectedGroup.members.length).toFixed(2);
            selectedGroup.members.forEach((member) => {
                if (member.name !== paidBy) {
                    summary[member.name] = perHead;
                }
            });
        }

        if (splitType === 'percentage') {
            selectedGroup.members.forEach((member) => {
                const percent = parseFloat(percentages[member.name] || 0);
                const share = ((expenseAmount * percent) / 100).toFixed(2);
                if (member.name !== paidBy) {
                    summary[member.name] = share;
                }
            });
        }

        if (splitType === 'exact') {
            selectedGroup.members.forEach((member) => {
                const amount = parseFloat(exactAmounts[member.name] || 0).toFixed(2);
                if (member.name !== paidBy) {
                    summary[member.name] = amount;
                }
            });
        }

        if (splitType === 'itemizedExpense') {
            const memberSubtotals = {};
            selectedGroup.members.forEach(m => memberSubtotals[m.name] = 0);

            items.forEach((item) => {
                const cost = parseFloat(item.cost || 0);
                if (item.assignedTo) {
                    memberSubtotals[item.assignedTo] += cost;
                }
            });

            const subtotal = Object.values(memberSubtotals).reduce((a, b) => a + b, 0);
            const taxAmount = (subtotal * taxPercent) / 100;
            const tipAmount = (subtotal * tipPercent) / 100;
            const grand = subtotal + taxAmount + tipAmount;

            selectedGroup.members.forEach((member) => {
                const base = memberSubtotals[member.name] || 0;
                const shareRatio = base / subtotal || 0;
                const total = (base + taxAmount * shareRatio + tipAmount * shareRatio).toFixed(2);
                if (member.name !== paidBy) {
                    summary[member.name] = total;
                }
            });
        }

        const expense = {
            amount: expenseAmount,
            category,
            date,
            group: groupSelected,
            paidBy,
            splitType,
            percentages: splitType === 'percentage' ? percentages : null,
            exactAmounts: splitType === 'exact' ? exactAmounts : null,
            items: splitType === 'itemizedExpense' ? items : null,
            taxPercent: splitType === 'itemizedExpense' ? taxPercent : null,
            tipPercent: splitType === 'itemizedExpense' ? tipPercent : null,
            summary,
        };

        const existing = JSON.parse(localStorage.getItem("expenses") || "[]");
        localStorage.setItem("expenses", JSON.stringify([...existing, expense]));

        setSubmittedExpense(expense);
        setShowSummary(true);

        // Reset form
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
    };



    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white shadow rounded"
        >
            <h1 className="text-2xl font-bold mb-2">Add a New Expense</h1>
            <h6 className="text-gray-500 mb-4">Relieve your stress</h6>

            {/* Amount */}
            <label className="block mb-1 font-medium">Amount</label>
            <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />

            {/* Category */}
            <label className="block mb-1 font-medium">Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}

                className="w-full p-2 mb-4 border rounded"
            >
                <option value="" disabled>
                    -- Select Category --
                </option>
                {getAllCategories().map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}

            </select>

            {/* Date */}
            <label className="block mb-1 font-medium">Date</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            />

            {/* Group */}
            <label className="block mb-1 font-medium">Group</label>
            <select
                value={groupSelected}
                onChange={(e) => setGroupSelected(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="" disabled>
                    Select Group
                </option>
                {groups.map((group, index) => (
                    <option key={index} value={group.name}>
                        {group.name} ({group.members.length} Members)
                    </option>
                ))}
            </select>

            {/* Paid By */}
            <label className="block mb-1 font-medium">Paid By</label>
            <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                disabled={!selectedGroup}
                className="w-full p-2 mb-4 border rounded"
            >
                <option value="" disabled>
                    Select who paid
                </option>
                {selectedGroup?.members.map((member, idx) => (
                    <option key={idx} value={member.name}>
                        {member.name === sessionUser ? "You" : member.name}
                    </option>
                ))}
            </select>

            {/* Split Type */}
            <label className="block mb-1 font-medium">Split Type</label>
            <div className="flex gap-2 mb-4">
                {['equal', 'percentage', 'exact', 'itemizedExpense'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setSplitType(type)}
                        className={`px-3 py-1 border rounded ${splitType === type ? 'bg-cyan-700 text-white' : ''
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Equal */}
            {splitType === 'equal' && selectedGroup && (
                <div className="mb-4 text-green-700">
                    {selectedGroup.members.map((member, idx) => (
                        <div key={idx}>
                            {member.name}: <strong>{total}</strong>
                        </div>
                    ))}
                </div>
            )}

            {/* Percentage */}
            {splitType === 'percentage' && selectedGroup && (
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Split by Percentage</h4>
                    {selectedGroup.members.map((member, idx) => {
                        const percent = parseFloat(percentages[member.name] || 0);
                        const share = ((amount * percent) / 100).toFixed(2);

                        return (
                            <div key={idx} className="flex gap-2 items-center mb-2">
                                <span className="w-1/3">{member.name}</span>
                                <input
                                    type="number"
                                    placeholder="e.g. 25"
                                    className="w-1/3 border p-1 rounded"
                                    value={percentages[member.name] || ''}
                                    onChange={(e) =>
                                        setPercentages({
                                            ...percentages,
                                            [member.name]: e.target.value,
                                        })
                                    }
                                />
                                <span className="w-1/3 text-right text-green-700">
                                    Rs {isNaN(share) ? '0.00' : share}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* Exact */}
            {splitType === 'exact' && selectedGroup && (
                <div className="mb-4">
                    <h4 className="font-medium mb-2">Split by Exact Amount</h4>
                    {selectedGroup.members.map((member, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-2">
                            <span className="w-1/3">{member.name}</span>
                            <input
                                type="number"
                                placeholder="e.g. 120"
                                className="w-2/3 border p-1 rounded"
                                value={exactAmounts[member.name] || ''}
                                onChange={(e) =>
                                    setExactAmounts({
                                        ...exactAmounts,
                                        [member.name]: e.target.value,
                                    })
                                }
                            />
                            <span>Rs</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Itemized */}
            {splitType === 'itemizedExpense' && selectedGroup && (
                <div className="mb-6">
                    <h4 className="font-medium mb-2">Itemized Expenses</h4>

                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Item"
                                value={item.name}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].name = e.target.value;
                                    setItems(newItems);
                                }}
                                className="border p-1 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Cost"
                                value={item.cost}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].cost = e.target.value;
                                    setItems(newItems);
                                }}
                                className="border p-1 rounded"
                            />
                            <select
                                value={item.assignedTo}
                                onChange={(e) => {
                                    const newItems = [...items];
                                    newItems[idx].assignedTo = e.target.value;
                                    setItems(newItems);
                                }}
                                className="border p-1 rounded"
                            >
                                <option value="">Assign to</option>
                                {selectedGroup.members.map((member, mIdx) => (
                                    <option key={mIdx} value={member.name}>{member.name}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    const newItems = [...items];
                                    newItems.splice(idx, 1);
                                    setItems(newItems);
                                }}
                                className="text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="mb-4 px-3 py-1 border rounded bg-green-600 text-white"
                    >
                        + Add Item
                    </button>
                    {splitType === 'itemizedExpense' && (
                        <>
                            <label className="block font-medium mt-4">Tax %</label>
                            <input
                                type="number"
                                placeholder="e.g. 5"
                                value={taxPercent}
                                onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 mb-2 border rounded"
                            />

                            <label className="block font-medium">Tip %</label>
                            <input
                                type="number"
                                placeholder="e.g. 10"
                                value={tipPercent}
                                onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
                                className="w-full p-2 mb-4 border rounded"
                            />
                        </>
                    )}

                    <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
                        <h5 className="font-semibold mb-2">Split Summary</h5>
                        {selectedGroup.members.map((member, idx) => {
                            const sub = memberTotals[member.name].toFixed(2);
                            const share = memberTotals[member.name] / subtotal || 0;
                            const taxShare = (tax * share).toFixed(2);
                            const tipShare = (tip * share).toFixed(2);
                            const total = (parseFloat(sub) + parseFloat(taxShare) + parseFloat(tipShare)).toFixed(2);

                            return (
                                <div key={idx} className="mb-1">
                                    {member.name}: Subtotal ${sub}, Tax ${taxShare}, Tip ${tipShare}, <strong>Total ${total}</strong>
                                </div>
                            );
                        })}
                        <hr className="my-2" />
                        <div><strong>Grand Total: ${grandTotal.toFixed(2)}</strong></div>
                    </div>
                </div>
            )}


            {/* Submit */}
            <button
                type="submit"
                className="w-full py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded"
            >
                Add Expense
            </button>
            {showSummary && submittedExpense && (() => {
                const categoryDetails = getCategoryById(submittedExpense.category);
                const CategoryIcon = getCategoryIcon(submittedExpense.category);

                return (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                            <div className="flex items-center gap-2 mb-2">
                                {CategoryIcon && <CategoryIcon className="w-6 h-6 text-cyan-700" />}
                                <h2 className="text-xl font-bold">{categoryDetails?.name || "Unknown Category"}</h2>
                            </div>

                            <h4 className="text-gray-700 mb-2">Total: Rs {submittedExpense.amount}</h4>
                            <p className="mb-2">
                                <strong>Paid By:</strong> {submittedExpense.paidBy}
                            </p>
                            <p className="mb-2">
                                <strong>Date:</strong> {submittedExpense.date}
                            </p>
                            <div className="mb-4">
                                <strong>Owed By:</strong>
                                <ul className="list-disc pl-6 mt-1 text-sm">
                                    {Object.entries(submittedExpense.summary).map(([name, amt], idx) => (
                                        <li key={idx}>{name} owes Rs {amt}</li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
                                onClick={() => {
                                    setShowSummary(false);
                                    navigate('/allExpenses');
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                );
            })()}



        </form>


    );
};

export default AddExpense;
