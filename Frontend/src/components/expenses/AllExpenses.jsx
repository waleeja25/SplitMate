import React from 'react';
import { getCategoryById, getCategoryIcon } from '../../lib/expense-categories';
import { FaUserFriends, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';

const AllExpenses = () => {
  const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const sessionUser = localStorage.getItem("username");
  const groupWiseMap = {};

  allExpenses.forEach((expense) => {
    const { group, paidBy, summary = {}, category, amount, date, splitType } = expense;
    if (!groupWiseMap[group]) groupWiseMap[group] = [];
    groupWiseMap[group].push({ category, amount, paidBy, summary, date, splitType });
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#2a806d] tracking-wide">All Expenses</h1>
        <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits ✨</p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>

      {Object.keys(groupWiseMap).length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        Object.entries(groupWiseMap).map(([groupName, groupExpenses], idx) => (
          <div
            key={idx}
            className="mb-10 bg-white border border-[#ccc] shadow p-6 rounded-lg hover:shadow-md transition-transform hover:scale-[1.01]"
          >
            <h2 className="text-2xl font-semibold text-[#2a806d] flex items-center gap-2 mb-6">
              <FaUserFriends className="text-[#2a806d]" />
              {groupName}
            </h2>

            {groupExpenses.map((expense, eIdx) => {
              const CategoryIcon = getCategoryIcon(expense.category);
              const categoryName = getCategoryById(expense.category).name;

              const owedToYou = [];
              const youOwe = [];

              Object.entries(expense.summary).forEach(([debtor, amount]) => {
                const formattedAmount = parseFloat(amount).toFixed(2);
                if (expense.paidBy === sessionUser && debtor !== sessionUser) {
                  owedToYou.push(`${debtor} owes you Rs ${formattedAmount}`);
                }
                if (debtor === sessionUser && expense.paidBy !== sessionUser) {
                  youOwe.push(`You owe ${expense.paidBy} Rs ${formattedAmount}`);
                }
              });

              return (
                <div
                  key={eIdx}
                  className="mb-6 p-4 bg-[#f0fdfa] border border-[#ccc] rounded-lg hover:shadow transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-[#2a806d]">
                      <CategoryIcon className="w-5 h-5 text-[#2a806d]" />
                      {categoryName}
                    </h3>
                    <span className="text-sm text-[#666]">{expense.date}</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 text-sm text-[#333]">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#2a806d]" />
                      <span><strong>Paid By:</strong> {expense.paidBy === sessionUser ? 'You' : expense.paidBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-[#2a806d]" />
                      <span><strong>Amount:</strong> Rs {expense.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaExchangeAlt className="text-[#2a806d]" />
                      <span><strong>Split Type:</strong> {expense.splitType}</span>
                    </div>
                  </div>

                  {(owedToYou.length > 0 || youOwe.length > 0) && (
                    <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-[#f9fffe] border border-[#2a806d] rounded-lg p-3">
                        <h4 className="font-semibold text-[#1cc29f] mb-2">Owed to You</h4>
                        {owedToYou.length > 0 ? (
                          <ul className="list-disc ml-5 text-[#075e54]">
                            {owedToYou.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[#666]">None</p>
                        )}
                      </div>

                      <div className="bg-[#fef9f9ce] border border-[#ef4444] rounded-lg p-3">
                        <h4 className="font-semibold text-[#ef4444] mb-2">You Owe</h4>
                        {youOwe.length > 0 ? (
                          <ul className="list-disc ml-5 text-[#7f1d1d]">
                            {youOwe.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[#666]">None</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>


  );
  
};

export default AllExpenses;
 // <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
        //     <h1 className="text-2xl font-bold mb-2">Add a New Expense</h1>

        //     <label className="block mb-1 font-medium">Amount</label>
        //     <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 mb-4 border rounded" />

        //     <label className="block mb-1 font-medium">Category</label>
        //     <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 mb-4 border rounded">
        //         <option value="">-- Select Category --</option>
        //         {getAllCategories().map(cat => (
        //             <option key={cat.id} value={cat.id}>{cat.name}</option>
        //         ))}
        //     </select>



        //     <DatePickerComponent date={date} setDate={setDate} />


        //     {/* <label className="block mb-1 font-medium">Date</label>
        //     <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 mb-4 border rounded" /> */}

        //     <label className="block mb-1 font-medium">Group</label>
        //     <select value={groupSelected} onChange={(e) => setGroupSelected(e.target.value)} className="w-full p-2 mb-4 border rounded">
        //         <option value="">Select Group</option>
        //         {groups.map((group, idx) => (
        //             <option key={idx} value={group.name}>
        //                 {group.name} ({group.members.length} members)
        //             </option>
        //         ))}

        //     </select>

        //     <label className="block mb-1 font-medium">Paid By</label>
        //     <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="w-full p-2 mb-4 border rounded" disabled={!selectedGroup}>
        //         <option value="">Select who paid</option>
        //         {selectedGroup?.members.map((member, idx) => (
        //             <option key={idx} value={member.name}>
        //                 {member.name === sessionUser ? 'You' : member.name}
        //             </option>
        //         ))}
        //     </select>

        //     <label className="block mb-1 font-medium">Split Type</label>
        //     <div className="flex gap-2 mb-4">
        //         {['equal', 'percentage', 'exact', 'itemizedExpense'].map(type => (
        //             <button key={type} type="button" onClick={() => setSplitType(type)} className={`px-3 py-1 border rounded ${splitType === type ? 'bg-cyan-700 text-white' : ''}`}>
        //                 {type.charAt(0).toUpperCase() + type.slice(1)}
        //             </button>
        //         ))}
        //     </div>

        //     {splitType === 'equal' && selectedGroup && (
        //         <SplitEqual selectedGroup={selectedGroup} amount={amount} />
        //     )}
        //     {splitType === 'percentage' && selectedGroup && (
        //         <SplitPercentage percentages={percentages} setPercentages={setPercentages} amount={amount} selectedGroup={selectedGroup} />
        //     )}
        //     {splitType === 'exact' && selectedGroup && (
        //         <SplitExact exactAmounts={exactAmounts} setExactAmounts={setExactAmounts} selectedGroup={selectedGroup} />
        //     )}
        //     {splitType === 'itemizedExpense' && selectedGroup && (
        //         <SplitItemized
        //             items={items}
        //             setItems={setItems}
        //             handleAddItem={handleAddItem}
        //             taxPercent={taxPercent}
        //             setTaxPercent={setTaxPercent}
        //             tipPercent={tipPercent}
        //             setTipPercent={setTipPercent}
        //             selectedGroup={selectedGroup}
        //             memberTotals={itemizedTotals.memberTotals}
        //             subtotal={itemizedTotals.subtotal}
        //             tax={itemizedTotals.tax}
        //             tip={itemizedTotals.tip}
        //             grandTotal={itemizedTotals.grandTotal}
        //         />
        //     )}


        //     <button type="submit" className="w-full py-2 mt-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded">
        //         Add Expense
        //     </button>

        //     <ExpenseSummaryModal
        //         show={showSummary}
        //         expense={submittedExpense}
        //         onClose={() => {
        //             setShowSummary(false);
        //             navigate('/allExpenses');
        //         }}
        //     />
        // </form>

//         <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
//   <h1 className="text-2xl font-bold mb-2 text-[#2a806d]">Add a New Expense</h1>

//   {/* Amount */}
//   <label className="block mb-1 font-medium text-[#333]">Amount</label>
//   <div className="relative mb-4">
//     <input
//       type="number"
//       value={amount}
//       onChange={(e) => setAmount(e.target.value)}
//       className="w-full p-2 pr-10 border border-[#ccc] rounded text-[#333]"
//     />
//     <FaMoneyBillAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d]" />
//   </div>

//   {/* Category */}
//   <label className="block mb-1 font-medium text-[#333]">Category</label>
//   <div className="relative mb-4">
//     <select
//       value={category}
//       onChange={(e) => setCategory(e.target.value)}
//       className="w-full p-2 pr-10 border border-[#ccc] rounded text-[#333]"
//     >
//       <option value="">-- Select Category --</option>
//       {getAllCategories().map((cat) => (
//         <option key={cat.id} value={cat.id}>{cat.name}</option>
//       ))}
//     </select>
//     <FaList className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d]" />
//   </div>

//   {/* Date */}
//   <DatePickerComponent date={date} setDate={setDate} />

//   {/* Group */}
//   <label className="block mb-1 font-medium text-[#333]">Group</label>
//   <div className="relative mb-4">
//     <select
//       value={groupSelected}
//       onChange={(e) => setGroupSelected(e.target.value)}
//       className="w-full p-2 pr-10 border border-[#ccc] rounded text-[#333]"
//     >
//       <option value="">Select Group</option>
//       {groups.map((group, idx) => (
//         <option key={idx} value={group.name}>
//           {group.name} ({group.members.length} members)
//         </option>
//       ))}
//     </select>
//     <FaUsers className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d]" />
//   </div>

//   {/* Paid By */}
//   <label className="block mb-1 font-medium text-[#333]">Paid By</label>
//   <div className="relative mb-4">
//     <select
//       value={paidBy}
//       onChange={(e) => setPaidBy(e.target.value)}
//       disabled={!selectedGroup}
//       className="w-full p-2 pr-10 border border-[#ccc] rounded text-[#333]"
//     >
//       <option value="">Select who paid</option>
//       {selectedGroup?.members.map((member, idx) => (
//         <option key={idx} value={member.name}>
//           {member.name === sessionUser ? 'You' : member.name}
//         </option>
//       ))}
//     </select>
//     <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d]" />
//   </div>

//   {/* Split Type */}
//   <label className="block mb-1 font-medium text-[#333]">Split Type</label>
//   <div className="flex gap-2 mb-4">
//     {['equal', 'percentage', 'exact', 'itemizedExpense'].map((type) => (
//       <button
//         key={type}
//         type="button"
//         onClick={() => setSplitType(type)}
//         className={`px-3 py-1 border rounded ${
//           splitType === type ? 'bg-[#2a806d] text-white' : 'text-[#333]'
//         }`}
//       >
//         {type.charAt(0).toUpperCase() + type.slice(1)}
//       </button>
//     ))}
//   </div>

//   {/* Split Method */}
//   {splitType === 'equal' && selectedGroup && (
//     <SplitEqual selectedGroup={selectedGroup} amount={amount} />
//   )}
//   {splitType === 'percentage' && selectedGroup && (
//     <SplitPercentage
//       percentages={percentages}
//       setPercentages={setPercentages}
//       amount={amount}
//       selectedGroup={selectedGroup}
//     />
//   )}
//   {splitType === 'exact' && selectedGroup && (
//     <SplitExact
//       exactAmounts={exactAmounts}
//       setExactAmounts={setExactAmounts}
//       selectedGroup={selectedGroup}
//     />
//   )}
//   {splitType === 'itemizedExpense' && selectedGroup && (
//     <SplitItemized
//       items={items}
//       setItems={setItems}
//       handleAddItem={handleAddItem}
//       taxPercent={taxPercent}
//       setTaxPercent={setTaxPercent}
//       tipPercent={tipPercent}
//       setTipPercent={setTipPercent}
//       selectedGroup={selectedGroup}
//       memberTotals={itemizedTotals.memberTotals}
//       subtotal={itemizedTotals.subtotal}
//       tax={itemizedTotals.tax}
//       tip={itemizedTotals.tip}
//       grandTotal={itemizedTotals.grandTotal}
//     />
//   )}

//   {/* Submit Button */}
//   <button type="submit" className="w-full py-2 mt-4 bg-[#2a806d] hover:bg-[#1cc29f] text-white rounded">
//     Add Expense
//   </button>

//   <ExpenseSummaryModal
//     show={showSummary}
//     expense={submittedExpense}
//     onClose={() => {
//       setShowSummary(false);
//       navigate('/allExpenses');
//     }}
//   />
// </form>