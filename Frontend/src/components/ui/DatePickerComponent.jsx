import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const DatePickerComponent = ({ date, setDate }) => {
  return (
    <div className="mb-4">
      <div className="relative w-full">
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={(selected) => {
            if (!selected) {
              setDate(null);
              return;
            }
            const localDate = selected.toLocaleDateString("en-CA"); 
            setDate(localDate);
          }}
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
