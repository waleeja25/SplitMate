import React from 'react';
const SplitItemized = ({
    items,
    setItems,
    selectedGroup,
    taxPercent,
    setTaxPercent,
    tipPercent,
    setTipPercent,
    handleAddItem,
    memberTotals,
    subtotal,
    tax,
    tip,
    grandTotal,
}) => {
     if (!selectedGroup) return null;



    return (
        // <div className="mb-6">
        //     <h4 className="font-medium mb-2">Itemized Expenses</h4>

        //     {items.map((item, idx) => (
        //         <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
        //             <input
        //                 type="text"
        //                 placeholder="Item"
        //                 value={item.name}
        //                 onChange={(e) => {
        //                     const newItems = [...items];
        //                     newItems[idx].name = e.target.value;
        //                     setItems(newItems);
        //                 }}
        //                 className="border p-1 rounded"
        //             />
        //             <input
        //                 type="number"
        //                 placeholder="Cost"
        //                 value={item.cost}
        //                 onChange={(e) => {
        //                     const newItems = [...items];
        //                     newItems[idx].cost = e.target.value;
        //                     setItems(newItems);
        //                 }}
        //                 className="border p-1 rounded"
        //             />
        //             <select
        //                 value={item.assignedTo}
        //                 onChange={(e) => {
        //                     const newItems = [...items];
        //                     newItems[idx].assignedTo = e.target.value;
        //                     setItems(newItems);
        //                 }}
        //                 className="border p-1 rounded"
        //             >
        //                 <option value="">Assign to</option>
        //                 {selectedGroup.members.map((member, mIdx) => (
        //                     <option key={mIdx} value={member.name}>
        //                         {member.name}
        //                     </option>
        //                 ))}
        //             </select>
        //             <button
        //                 type="button"
        //                 onClick={() => {
        //                     const newItems = [...items];
        //                     newItems.splice(idx, 1);
        //                     setItems(newItems);
        //                 }}
        //                 className="text-red-600"
        //             >
        //                 Remove
        //             </button>
        //         </div>
        //     ))}

        //     <button
        //         type="button"
        //         onClick={handleAddItem}
        //         className="mb-4 px-3 py-1 border rounded bg-green-600 text-white"
        //     >
        //         + Add Item
        //     </button>

        //     <label className="block font-medium mt-4">Tax %</label>
        //     <input
        //         type="number"
        //         placeholder="e.g. 5"
        //         value={taxPercent}
        //         onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
        //         className="w-full p-2 mb-2 border rounded"
        //     />

        //     <label className="block font-medium">Tip %</label>
        //     <input
        //         type="number"
        //         placeholder="e.g. 10"
        //         value={tipPercent}
        //         onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
        //         className="w-full p-2 mb-4 border rounded"
        //     />

        //     <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
        //         <h5 className="font-semibold mb-2">Split Summary</h5>

        //         {subtotal > 0 && selectedGroup.members.map((member, idx) => {
        //             const rawSub = parseFloat(memberTotals?.[member.name] || 0);
        //             const sub = rawSub.toFixed(2);
        //             const share = subtotal ? rawSub / subtotal : 0;
        //             const taxShare = (tax * share).toFixed(2);
        //             const tipShare = (tip * share).toFixed(2);
        //             const total = (rawSub + parseFloat(taxShare) + parseFloat(tipShare)).toFixed(2);

        //             return (
        //                 <div key={idx} className="mb-1">
        //                     {member.name}: Subtotal Rs {sub}, Tax Rs {taxShare}, Tip Rs {tipShare},{" "}
        //                     <strong>Total Rs {total}</strong>
        //                 </div>
        //             );
        //         })}


        //         <hr className="my-2" />
        //         {grandTotal !== undefined && !isNaN(grandTotal) && (
        //             <>
        //                 <hr className="my-2" />
        //                 <div>
        //                     <strong>Grand Total: Rs {grandTotal.toFixed(2)}</strong>
        //                 </div>
        //             </>
        //         )}

        //     </div>
        // </div>

//         <div className="mb-10 bg-[rgb(245_252_250)] p-6 rounded-2xl border border-[#d9f0ea] shadow-sm">
//   <h4 className="text-xl font-bold text-[#2a806d] mb-4">Itemized Expenses</h4>

//   {items.map((item, idx) => (
//     <div key={idx} className="grid grid-cols-4 gap-3 mb-3">
//       <input
//         type="text"
//         placeholder="Item"
//         value={item.name}
//         onChange={(e) => {
//           const newItems = [...items];
//           newItems[idx].name = e.target.value;
//           setItems(newItems);
//         }}
//         className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//       />
//       <input
//         type="number"
//         placeholder="Cost"
//         value={item.cost}
//         onChange={(e) => {
//           const newItems = [...items];
//           newItems[idx].cost = e.target.value;
//           setItems(newItems);
//         }}
//         className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//       />
//       <select
//         value={item.assignedTo}
//         onChange={(e) => {
//           const newItems = [...items];
//           newItems[idx].assignedTo = e.target.value;
//           setItems(newItems);
//         }}
//         className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//       >
//         <option value="">Assign to</option>
//         {selectedGroup.members.map((member, mIdx) => (
//           <option key={mIdx} value={member.name}>
//             {member.name}
//           </option>
//         ))}
//       </select>
//       <button
//         type="button"
//         onClick={() => {
//           const newItems = [...items];
//           newItems.splice(idx, 1);
//           setItems(newItems);
//         }}
//         className="text-red-600 font-medium hover:underline"
//       >
//         Remove
//       </button>
//     </div>
//   ))}

//   <button
//     type="button"
//     onClick={handleAddItem}
//     className="mt-2 px-4 py-2 rounded-lg bg-[#2a806d] hover:bg-[#1c4f45] text-white font-semibold"
//   >
//     + Add Item
//   </button>

//   <div className="mt-6">
//     <label className="block font-semibold text-sm mb-1">Tax %</label>
//     <input
//       type="number"
//       placeholder="e.g. 5"
//       value={taxPercent}
//       onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
//       className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//     />

//     <label className="block font-semibold text-sm mb-1">Tip %</label>
//     <input
//       type="number"
//       placeholder="e.g. 10"
//       value={tipPercent}
//       onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
//       className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//     />
//   </div>

//   <div className="bg-white border border-[#d9f0ea] p-4 rounded-xl text-sm mt-6 shadow-sm">
//     <h5 className="font-semibold text-[#2a806d] mb-3">Split Summary</h5>

//     {subtotal > 0 && selectedGroup.members.map((member, idx) => {
//       const rawSub = parseFloat(memberTotals?.[member.name] || 0);
//       const sub = rawSub.toFixed(2);
//       const share = subtotal ? rawSub / subtotal : 0;
//       const taxShare = (tax * share).toFixed(2);
//       const tipShare = (tip * share).toFixed(2);
//       const total = (rawSub + parseFloat(taxShare) + parseFloat(tipShare)).toFixed(2);

//       return (
//         <div
//           key={idx}
//           className="flex justify-between py-1 border-b border-dashed border-gray-200"
//         >
//           <span>{member.name}</span>
//           <span>
//             Rs {sub} + Rs {taxShare} tax + Rs {tipShare} tip ={" "}
//             <strong className="text-[#1c4f45]">Rs {total}</strong>
//           </span>
//         </div>
//       );
//     })}

//     {grandTotal !== undefined && !isNaN(grandTotal) && (
//       <div className="mt-4 font-bold text-[#1c4f45] text-right">
//         Grand Total: Rs {grandTotal.toFixed(2)}
//       </div>
//     )}
//   </div>
// </div>

<div className="w-[50vw] mx-auto bg-white p-6 rounded-xl shadow border border-[#d9f0ea]">


  <h4 className="text-2xl font-bold text-[#2a806d] mb-6">Itemized Expenses</h4>

  {items.map((item, idx) => (
    <div key={idx} className="grid grid-cols-12 gap-4 mb-4">
      <input
        type="text"
        placeholder="Item"
        value={item.name}
        onChange={(e) => {
          const newItems = [...items];
          newItems[idx].name = e.target.value;
          setItems(newItems);
        }}
        className="col-span-12 md:col-span-3 p-3 rounded border border-gray-300 shadow-sm w-full"
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
        className="col-span-12 md:col-span-2 p-3 rounded border border-gray-300 shadow-sm w-full"
      />
      <select
        value={item.assignedTo}
        onChange={(e) => {
          const newItems = [...items];
          newItems[idx].assignedTo = e.target.value;
          setItems(newItems);
        }}
        className="col-span-12 md:col-span-5 p-3 rounded border border-gray-300 shadow-sm w-full"
      >
        <option value="">Assign to</option>
        {selectedGroup.members.map((member, mIdx) => (
          <option key={mIdx} value={member.name}>
            {member.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          const newItems = [...items];
          newItems.splice(idx, 1);
          setItems(newItems);
        }}
        className="col-span-12 md:col-span-2 text-red-600 font-medium hover:underline"
      >
        Remove
      </button>
      
    </div>
  ))}

  <button
    type="button"
    onClick={handleAddItem}
    className="px-5 py-2 mt-2 rounded bg-[#2a806d] text-white font-semibold hover:bg-[#1c5c4f] transition"
  >
    + Add Item
  </button>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
    <div>
      <label className="block text-sm font-medium text-[#2a806d] mb-1">Tax %</label>
      <input
        type="number"
        placeholder="e.g. 5"
        value={taxPercent}
        onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
        className="w-full p-3 rounded border border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-[#2a806d] mb-1">Tip %</label>
      <input
        type="number"
        placeholder="e.g. 10"
        value={tipPercent}
        onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
        className="w-full p-3 rounded border border-gray-300 shadow-sm"
      />
    </div>
  </div>

  <div className="mt-8 bg-white border border-[#d9f0ea] rounded-xl p-6 text-sm">
    <h5 className="text-xl font-semibold text-[#2a806d] mb-4">Split Summary</h5>

    {subtotal > 0 && selectedGroup.members.map((member, idx) => {
      const rawSub = parseFloat(memberTotals?.[member.name] || 0);
      const sub = rawSub.toFixed(2);
      const share = subtotal ? rawSub / subtotal : 0;
      const taxShare = (tax * share).toFixed(2);
      const tipShare = (tip * share).toFixed(2);
      const total = (rawSub + parseFloat(taxShare) + parseFloat(tipShare)).toFixed(2);

      return (
        <div key={idx} className="flex justify-between py-2 border-b last:border-none">
          <span className="text-gray-700">{member.name}</span>
          <span className="text-gray-800">
            Rs {sub} + Rs {taxShare} tax + Rs {tipShare} tip ={" "}
            <strong className="text-[#2a806d]">Rs {total}</strong>
          </span>
        </div>
      );
    })}

    {grandTotal !== undefined && !isNaN(grandTotal) && (
      <div className="mt-6 pt-4 border-t font-bold text-lg text-[#1c4f45]">
        Grand Total: Rs {grandTotal.toFixed(2)}
      </div>
    )}
  </div>
</div>


    );
};

export default SplitItemized;
