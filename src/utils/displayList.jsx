import React from "react";

export const displayList = (title, items) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mt-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index}>
              {item.name} {item.email && `- ${item.email}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
