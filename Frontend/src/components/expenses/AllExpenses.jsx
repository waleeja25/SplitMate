import ExpenseCard from './ExpenseCard';

const AllExpenses = () => {
  const allExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");
  const sessionUser = localStorage.getItem("username");
  const groupWiseMap = {};
  const memberWiseMap = {};
  
  
  allExpenses.forEach((expense) => {
    const { group, members, paidBy, summary = {}, category, amount, date, splitType } = expense;

    if (group) {
      if (!groupWiseMap[group]) groupWiseMap[group] = [];
      groupWiseMap[group].push({ category, amount, paidBy, summary, date, splitType });
    }
    if (!group && Array.isArray(members)) {
      members.forEach((member) => {
        const memberName = member.name;
        if (!memberWiseMap[memberName]) memberWiseMap[memberName] = [];
        memberWiseMap[memberName].push({ category, amount, paidBy, summary, date, splitType });
      });
    }
  });
  return (
    <div className="p-6 max-w-4xl mx-auto bg-[rgb(245,252,250)]">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#2a806d] tracking-wide">All Expenses</h1>
        <p className="text-[#333] mt-1">Track who paid, who owes, and how it splits.</p>
        <div className="mt-2 border-b-2 border-[#2a806d] w-3/4 mx-auto" />
      </div>

      {(Object.keys(groupWiseMap).length === 0) && (Object.keys(memberWiseMap).length === 0) ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        Object.entries(groupWiseMap).map(([groupName, groupExpenses], idx) => (
          <div key={idx} className="mb-10">
            {groupExpenses.map((expense, eIdx) => (
              <ExpenseCard
                key={eIdx}
                expense={expense}
                groupName={groupName}
                sessionUser={sessionUser}
              />
            ))}
          </div>
        ))
      )}

 {Object.entries(memberWiseMap).map(([memberName, memberExpenses], idx) => {
  if (memberName === sessionUser) return null; 
  return (
    <div key={idx} className="mb-10">
      {memberExpenses.map((expense, eIdx) => (
        <ExpenseCard
          key={eIdx}
          expense={expense}
          groupName={memberName}
          sessionUser={sessionUser}
        />
      ))}
    </div>
  );
})}
    </div>
  );
};

export default AllExpenses;
