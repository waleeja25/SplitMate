export function calculateEqualSplit(members, amount, paidBy) {
  const perHead = parseFloat((amount / members.length).toFixed(2));
  const summary = {};

  members.forEach(member => {
    if (member.name !== paidBy) {
      summary[member.name] = perHead;
    } else {
      summary[member.name] = 0;
    }
  });

  return summary;
}


export function calculatePercentageSplit(members, percentages, amount, paidBy) {
  const totalPercent = Object.values(percentages)
    .reduce((sum, val) => sum + parseFloat(val || 0), 0);
  if (totalPercent !== 100) {
    return { error: `Total percentage must be exactly 100%. You have ${totalPercent}%.` };
  }

  const summary = {};
  members.forEach(member => {
    const percent = parseFloat(percentages[member.name] || 0);
    const share = ((amount * percent) / 100).toFixed(2);
    if (member.name !== paidBy) {
      summary[member.name] = share;
    }
  });

  return { summary };
}

// export function calculateExactSplit(members, exactAmounts, paidBy) {
//   const summary = {};
//   members.forEach(member => {
//     const exact = parseFloat(exactAmounts[member.name] || 0).toFixed(2);
//     if (member.name !== paidBy) {
//       summary[member.name] = exact;
//     }
//   });
//   return summary;
// }


export function calculateExactSplit(members, exactAmounts, paidBy) {
  const summary = {};

  members.forEach((member) => {
    const amount = parseFloat(exactAmounts[member.name] || 0);
    if (member.name !== paidBy) {
      summary[member.name] = amount.toFixed(2);
    }
  });

  return summary;
}



// export function calculateItemizedSplit(members, items, taxPercent, tipPercent, paidBy) {
//   const memberTotals = {};
//   members.forEach(m => memberTotals[m.name] = 0);

//   items.forEach(item => {
//     const cost = parseFloat(item.cost || 0);
//     if (
//   item.assignedTo &&
//   Object.prototype.hasOwnProperty.call(memberTotals, item.assignedTo)
// ) {
//   memberTotals[item.assignedTo] += cost;
// }

//   });

//   const subtotal = Object.values(memberTotals).reduce((a, b) => a + b, 0);
//   const tax = (subtotal * taxPercent) / 100;
//   const tip = (subtotal * tipPercent) / 100;

//   const summary = {};
//   members.forEach(member => {
//     const base = memberTotals[member.name] || 0;
//     const shareRatio = base / subtotal || 0;
//     const total = (base + tax * shareRatio + tip * shareRatio).toFixed(2);
//     if (member.name !== paidBy) {
//       summary[member.name] = total;
//     }
//   });

//   return { summary, memberTotals, subtotal, tax, tip, grandTotal: subtotal + tax + tip };
// }
export function calculateItemizedSplit(members, items, taxPercent, tipPercent, paidBy) {
  const memberTotals = {};

  // Initialize each member with 0
  members.forEach(member => {
    memberTotals[member.name] = 0;
  });

  // Assign each item's cost
  items.forEach(item => {
    const cost = parseFloat(item.cost || 0);
    const assignedTo = item.assignedTo;

    if (assignedTo && assignedTo in memberTotals) {
      memberTotals[assignedTo] += cost;
    }
  });

  // Calculate totals
  const subtotal = Object.values(memberTotals).reduce((sum, val) => sum + val, 0);
  const tax = (subtotal * taxPercent) / 100;
  const tip = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tax + tip;

  // Calculate each member's final share
  const summary = {};
  members.forEach(member => {
    const base = memberTotals[member.name] || 0;
    const shareRatio = subtotal > 0 ? base / subtotal : 0;
    const total = base + tax * shareRatio + tip * shareRatio;

    if (member.name !== paidBy) {
      summary[member.name] = total.toFixed(2);
    }
  });

  return {
    summary,
    memberTotals,
    subtotal,
    tax,
    tip,
    grandTotal,
  };
}
