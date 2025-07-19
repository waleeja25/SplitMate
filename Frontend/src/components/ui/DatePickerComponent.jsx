import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa'; 

const DatePickerComponent = ({ date, setDate }) => {
 // date = new Date();

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">Select Date</label>
      <div className="relative w-full">
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={(selected) => setDate(selected.toISOString().split('T')[0])}
          wrapperClassName="w-full"
          className="w-full p-2 pr-10 border rounded"
          placeholderText="Pick a date"
          dateFormat="dd/MM/yyyy"
        />
        <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d]  pointer-events-none" />
      </div>
    </div>
  );
};

export default DatePickerComponent;


// import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FaCalendarAlt } from 'react-icons/fa';

// const DatePickerComponent = ({ date, setDate }) => {
//   return (
//     <div className="mb-4 w-full">
//       <label className="block mb-1 font-medium text-[#333]">Date</label>
//       <div className="relative">
//         <DatePicker
//           selected={date ? new Date(date) : null}
//           onChange={(selected) => setDate(selected.toISOString().split('T')[0])}
//           className="w-full p-2 pr-10 border border-[#ccc] rounded text-[#333] focus:outline-none focus:ring-2 focus:ring-[#2a806d]"
//           placeholderText="Pick a date"
//           dateFormat="dd/MM/yyyy"
//         />
//         <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2a806d] pointer-events-none" />
//       </div>
//     </div>
//   );
// };

// export default DatePickerComponent;
