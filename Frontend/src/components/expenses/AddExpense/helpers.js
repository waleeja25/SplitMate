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

export function updateBalances(summary, paidBy) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");

  for (const member in summary) {
    if (member === paidBy) continue;

    const amount = summary[member];

    if (!balances[member]) balances[member] = {};
    if (!balances[paidBy]) balances[paidBy] = {};

    balances[member][paidBy] = (balances[member][paidBy] || 0) - amount;
    balances[paidBy][member] = (balances[paidBy][member] || 0) + amount;
  }

  localStorage.setItem("balances", JSON.stringify(balances));
}

export function getUserBalances(userName) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");
  const userData = balances[userName] || {};

  const owes = [];
  const owed = [];

  for (const [person, amount] of Object.entries(userData)) {
    if (amount > 0) {
      owed.push({ to: person, amount });
    } else if (amount < 0) {
      owes.push({ to: person, amount: -amount });
    }
  }

  return { owes, owed };
}

export function settleUp(from, to, amount) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");

  if (!balances[from]) balances[from] = {};
  if (!balances[to]) balances[to] = {};

  balances[from][to] = (balances[from][to] || 0) - amount;
  balances[to][from] = (balances[to][from] || 0) + amount;

  localStorage.setItem("balances", JSON.stringify(balances));
}
