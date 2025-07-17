import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../../../lib/expense-categories';

import SplitEqual from './SplitEqual';
import SplitPercentage from './SplitPercentage';
import SplitExact from './SplitExact';
import SplitItemized from './SplitItemized';
import ExpenseSummaryModal from './ExpenseSummaryModal';
import {
    calculateEqualSplit,
    calculatePercentageSplit,
    calculateExactSplit,
    calculateItemizedSplit,
} from './helpers';

const AddExpenseForm = ({ groups }) => {
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

    // const total =
    //     selectedGroup && selectedGroup.members.length > 0
    //         ? (parseFloat(amount || 0) / selectedGroup.members.length).toFixed(2)
    //         : '0.00';

    const handleAddItem = () => {
        setItems([...items, { name: '', cost: '', assignedTo: '' }]);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!amount || !category || !date || !groupSelected || !paidBy) {
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
            summary = calculateExactSplit(selectedGroup.members, exactAmounts, paidBy);
        }

        if (splitType === 'itemizedExpense') {
            for (const item of items) {
                if (!item.name || !item.cost || !item.assignedTo) {
                    alert("All item fields must be filled.");
                    return;
                }
            }

            const result = calculateItemizedSplit(
                selectedGroup.members,
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
            const result = calculatePercentageSplit(selectedGroup.members, percentages, expenseAmount, paidBy);
            if (result.error) {
                alert(result.error);
                return;
            }
            summary = result.summary;
        }

        if (splitType === 'equal') {
            summary = calculateEqualSplit(selectedGroup.members, expenseAmount, paidBy);
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
        if (splitType === 'itemizedExpense' && selectedGroup) {
            const result = calculateItemizedSplit(
                selectedGroup.members,
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
    }, [splitType, selectedGroup, items, taxPercent, tipPercent, paidBy]);




    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-2">Add a New Expense</h1>

            <label className="block mb-1 font-medium">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 mb-4 border rounded" />

            <label className="block mb-1 font-medium">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 mb-4 border rounded">
                <option value="">-- Select Category --</option>
                {getAllCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <label className="block mb-1 font-medium">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 mb-4 border rounded" />

            <label className="block mb-1 font-medium">Group</label>
            <select value={groupSelected} onChange={(e) => setGroupSelected(e.target.value)} className="w-full p-2 mb-4 border rounded">
                <option value="">Select Group</option>
                {groups.map((group, idx) => (
                    <option key={idx} value={group.name}>
                        {group.name} ({group.members.length} members)
                    </option>
                ))}

            </select>

            <label className="block mb-1 font-medium">Paid By</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full p-2 mb-4 border rounded" disabled={!selectedGroup}>
                <option value="">Select who paid</option>
                {selectedGroup?.members.map((member, idx) => (
                    <option key={idx} value={member.name}>
                        {member.name === sessionUser ? 'You' : member.name}
                    </option>
                ))}
            </select>

            <label className="block mb-1 font-medium">Split Type</label>
            <div className="flex gap-2 mb-4">
                {['equal', 'percentage', 'exact', 'itemizedExpense'].map(type => (
                    <button key={type} type="button" onClick={() => setSplitType(type)} className={`px-3 py-1 border rounded ${splitType === type ? 'bg-cyan-700 text-white' : ''}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {splitType === 'equal' && selectedGroup && (
                <SplitEqual selectedGroup={selectedGroup} amount={amount} />
            )}
            {splitType === 'percentage' && selectedGroup && (
                <SplitPercentage percentages={percentages} setPercentages={setPercentages} amount={amount} selectedGroup={selectedGroup} />
            )}
            {splitType === 'exact' && selectedGroup && (
                <SplitExact exactAmounts={exactAmounts} setExactAmounts={setExactAmounts} selectedGroup={selectedGroup} />
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


            <button type="submit" className="w-full py-2 mt-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded">
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
        </form>
    );
};

export default AddExpenseForm;
