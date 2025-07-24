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
export function updateBalances(summary, paidBy, amount, splitType) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");

  for (const member in summary) {
    if (member === paidBy) continue;

    const memberAmount = summary[member];

    if (!balances[member]) balances[member] = {};
    if (!balances[paidBy]) balances[paidBy] = {};

    balances[member][paidBy] = (balances[member][paidBy] || 0) - memberAmount;
    balances[paidBy][member] = (balances[paidBy][member] || 0) + memberAmount;
  }

  localStorage.setItem("balances", JSON.stringify(balances));

  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  expenses.push({
    paidBy,
    amount,
    summary,
    splitType,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

export function getUserBalances(userName) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");
  const userData = balances[userName] || {};

  const owes = [];
  const owed = [];

for (const [person, amount] of Object.entries(userData)) {
  const numAmount = Number(amount); 
  if (numAmount > 0) {
    owed.push({ to: person, amount: numAmount });
  } else if (numAmount < 0) {
    owes.push({ to: person, amount: -numAmount });
  }
}
  return { owes, owed };
}

export function settleUp(from, to, amount) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");

  if (!balances[from]) balances[from] = {};
  if (!balances[to]) balances[to] = {};

  balances[from][to] = (balances[from][to] || 0) + amount;
  balances[to][from] = -balances[from][to];

  if (balances[from][to] === 0) {
  delete balances[from][to];
  delete balances[to][from];
}


  localStorage.setItem("balances", JSON.stringify(balances));
}

export function getMonthlyExpenses() {
  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

  // Step 1: Prepare monthly totals from actual data
  const monthlyTotals = {};
  expenses.forEach(({ amount, timestamp }) => {
    const date = new Date(timestamp);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // e.g., "2025-7"
    if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
    monthlyTotals[monthKey] += Number(amount);
  });

  // Step 2: Generate all months (Jan to Dec) for current year
  const now = new Date();
  const currentYear = now.getFullYear();

  const fullYearMonths = Array.from({ length: 12 }, (_, index) => {
    const key = `${currentYear}-${index + 1}`;
    return {
      month: key,
      total: Number((monthlyTotals[key] || 0).toFixed(2)),
    };
  });

  return fullYearMonths;
}

export function getDatewiseExpenses(monthKey) {
  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

  const [year, month] = monthKey.split("-").map(Number); // e.g. "2025-7"
  const daysInMonth = new Date(year, month, 0).getDate(); // get total days in the month

  // Initialize totals with all days = 0
  const dateTotals = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const paddedDay = String(day).padStart(2, "0");
    dateTotals[`${year}-${month}-${paddedDay}`] = 0;
  }

  // Aggregate actual expenses
  expenses.forEach(({ amount, timestamp }) => {
    const date = new Date(timestamp);
    const dYear = date.getFullYear();
    const dMonth = date.getMonth() + 1;
    const dDay = date.getDate();

    if (dYear === year && dMonth === month) {
      const dateKey = `${year}-${month}-${String(dDay).padStart(2, "0")}`;
      dateTotals[dateKey] += Number(amount);
    }
  });

  // Return as formatted array
  return Object.entries(dateTotals).map(([date, total]) => ({
    date,
    total: Number(total.toFixed(2)),
  }));
}
