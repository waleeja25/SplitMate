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

            <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
                <h5 className="font-semibold mb-2">Split Summary</h5>

                {subtotal > 0 && selectedGroup.members.map((member, idx) => {
                    const rawSub = parseFloat(memberTotals?.[member.name] || 0);
                    const sub = rawSub.toFixed(2);
                    const share = subtotal ? rawSub / subtotal : 0;
                    const taxShare = (tax * share).toFixed(2);
                    const tipShare = (tip * share).toFixed(2);
                    const total = (rawSub + parseFloat(taxShare) + parseFloat(tipShare)).toFixed(2);

                    return (
                        <div key={idx} className="mb-1">
                            {member.name}: Subtotal Rs {sub}, Tax Rs {taxShare}, Tip Rs {tipShare},{" "}
                            <strong>Total Rs {total}</strong>
                        </div>
                    );
                })}


                <hr className="my-2" />
                {grandTotal !== undefined && !isNaN(grandTotal) && (
                    <>
                        <hr className="my-2" />
                        <div>
                            <strong>Grand Total: Rs {grandTotal.toFixed(2)}</strong>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default SplitItemized;
