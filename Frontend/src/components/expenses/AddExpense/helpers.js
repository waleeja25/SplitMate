export function calculateEqualSplit(members, amount, paidBy) {
  const totalMembers = members.length;
  const splitAmount = parseFloat(amount) / totalMembers;

  const summary = {};

  members.forEach((member) => {
    summary[member.name] = member.name === paidBy ? 0 : splitAmount;
  });

  return { summary };
}

export function calculatePercentageSplit(members, percentages, amount, paidBy) {
  const totalPercent = Object.values(percentages).reduce(
    (sum, val) => sum + parseFloat(val || 0),
    0
  );

  if (totalPercent !== 100) {
    return {
      error: `Total percentage must be exactly 100%. You have ${totalPercent}%.`,
    };
  }

  const summary = {};
  members.forEach((member) => {
    const percent = parseFloat(percentages[member.name] || 0);
    summary[member.name] =
      member.name === paidBy ? 0 : (amount * percent) / 100;
  });

  return { summary };
}

export function calculateExactSplit(members, exactAmounts, paidBy) {
  const summary = {};

  members.forEach((member) => {
    const amount = parseFloat(exactAmounts[member.name]) || 0;
    summary[member.name] = member.name === paidBy ? 0 : amount;
  });

  return { summary };
}

export function calculateItemizedSplit(
  members,
  items,
  taxPercent,
  tipPercent,
  paidBy
) {
  const memberTotals = {};
  members.forEach((member) => (memberTotals[member.name] = 0));

  items.forEach((item) => {
    const cost = parseFloat(item.cost || 0);
    const assignedTo = item.assignedTo;
    if (assignedTo && memberTotals[assignedTo] !== undefined) {
      memberTotals[assignedTo] += cost;
    }
  });

  const subtotal = Object.values(memberTotals).reduce(
    (sum, val) => sum + val,
    0
  );
  const tax = (subtotal * taxPercent) / 100;
  const tip = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tax + tip;

  const summary = {};
  members.forEach((member) => {
    const base = memberTotals[member.name] || 0;
    const shareRatio = subtotal > 0 ? base / subtotal : 0;
    summary[member.name] =
      member.name === paidBy ? 0 : base + tax * shareRatio + tip * shareRatio;
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

export function updateBalances(summary, paidBy, amount, splitType, date) {
  if (!summary || typeof summary !== "object") return;

  const balances = JSON.parse(localStorage.getItem("balances") || "{}");
  if (!balances[paidBy]) balances[paidBy] = {};

  Object.entries(summary).forEach(([memberName, memberAmount]) => {
    if (memberName === paidBy || memberAmount === 0) return;
    if (!balances[memberName]) balances[memberName] = {};

    const amountNum =
      typeof memberAmount === "string"
        ? parseFloat(memberAmount)
        : memberAmount;

    balances[memberName][paidBy] =
      (balances[memberName][paidBy] || 0) - amountNum;
    balances[paidBy][memberName] =
      (balances[paidBy][memberName] || 0) + amountNum;
  });

  localStorage.setItem("balances", JSON.stringify(balances));

  const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  expenses.push({
    paidBy,
    amount,
    splitType,
    summary,
    timestamp: date || new Date().toISOString(),
  });
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

export function getUserBalances(currentUser) {
  const balances = JSON.parse(localStorage.getItem("balances") || "{}");
  const owes = [];
  const owed = [];

  const currentUserBalances = balances[currentUser] || {};

  Object.entries(currentUserBalances).forEach(([otherUser, amount]) => {
    const numAmount = Number(amount);
    if (numAmount === 0) return;
    const rounded = Math.round(numAmount * 100) / 100;
    if (rounded === 0) return;
    if (numAmount < 0) {
      owes.push({ to: otherUser, amount: -numAmount });
    } else if (numAmount > 0) {
      owed.push({ from: otherUser, amount: numAmount });
    }
  });

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

export function getMonthlyExpenses(expenses) {
  const monthlyTotals = {};

  expenses.forEach(({ amount, date, createdAt }) => {
    const expenseDate = new Date(date || createdAt);
    const monthKey = `${expenseDate.getFullYear()}-${String(
      expenseDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
    monthlyTotals[monthKey] += Number(amount);
  });

  const now = new Date();
  const currentYear = now.getFullYear();

  return Array.from({ length: 12 }, (_, index) => {
    const key = `${currentYear}-${String(index + 1).padStart(2, "0")}`;
    return {
      month: key,
      total: Number((monthlyTotals[key] || 0).toFixed(2)),
    };
  });
}

export function getDatewiseExpenses(monthKey, expenses) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();

  const paddedMonth = String(month).padStart(2, "0");
  const dateTotals = {};
  for (let day = 1; day <= daysInMonth; day++) {
    const paddedDay = String(day).padStart(2, "0");
    dateTotals[`${year}-${paddedMonth}-${paddedDay}`] = 0;
  }

  expenses.forEach(({ amount, date, createdAt }) => {
    const expenseDate = new Date(date || createdAt);
    const dYear = expenseDate.getFullYear();
    const dMonth = expenseDate.getMonth() + 1;
    const dDay = expenseDate.getDate();

    if (dYear === year && dMonth === month) {
      const dateKey = `${year}-${paddedMonth}-${String(dDay).padStart(2, "0")}`;
      dateTotals[dateKey] += Number(amount);
    }
  });

  return Object.entries(dateTotals).map(([date, total]) => ({
    date,
    total: Number(total.toFixed(2)),
  }));
}

export function getExpensesForMember(memberName, expenses) {
  const result = [];

  expenses.forEach((expense) => {
    const {
      group,
      members,
      paidBy,
      summary = {},
      category,
      amount,
      date,
      splitType,
    } = expense;

    if (!group && Array.isArray(members)) {
      const isInvolved = members.some((m) => m.name === memberName);

      if (isInvolved) {
        result.push({
          paidBy,
          category,
          amount,
          date,
          splitType,
          summary,
        });
      }
    }
  });

  return result;
}

export function getExpensesForGroup(groupName, expenses) {
  return expenses.filter((expense) => expense.group === groupName);
}

export function getGroupUserBalances(
  currentUser,
  groupExpenses,
  groupMembers,
  groupName
) {
  const netBalances = {};

  // Initialize net balances for each member
  groupMembers.forEach((member) => {
    if (member !== currentUser) {
      netBalances[member] = 0;
    }
  });

  groupExpenses.forEach((expense) => {
    if (!expense || expense.group !== groupName) return; // only for this group
    if (!expense.summary || typeof expense.summary !== "object") return;

    const payer = expense.paidBy;

    Object.entries(expense.summary).forEach(([member, amount]) => {
      const amt = parseFloat(amount);

      if (member === payer) return;

      // If current user paid, others owe them
      if (payer === currentUser && member !== currentUser) {
        netBalances[member] = (netBalances[member] || 0) + amt;
      }

      // If current user owes someone else
      else if (member === currentUser && payer !== currentUser) {
        netBalances[payer] = (netBalances[payer] || 0) - amt;
      }
    });
  });

  const owes = [];
  const owed = [];

  Object.entries(netBalances).forEach(([person, balance]) => {
    const rounded = Math.round(balance * 100) / 100;

    if (rounded > 0) {
      owed.push({ from: person, amount: rounded });
    } else if (rounded < 0) {
      owes.push({ to: person, amount: -rounded });
    }
  });

  return { owes, owed };
}

export async function settleUpBackend(from, to, amount, token) {
  try {
    const res = await fetch("http://localhost:3001/api/balances/settle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Settlement failed");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
export async function BalanceUpdate(summary, paidBy, amount, splitType, token) {
  try {
    const res = await fetch("http://localhost:3001/api/balances/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ summary, paidBy, amount, splitType }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Balance Update failed");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
