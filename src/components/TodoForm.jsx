import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' }
];

const TodoForm = React.memo(({ dispatch }) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState("medium");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!text.trim()) {
        return;
      }
      dispatch({
        type: 'ADD_TASK',
        payload: {
          title: text.trim(),
          description,
          dueDate,
          priority
        }
      });
      setText("");
      setDescription("");
      setDueDate(null);
      setPriority("medium");
      setIsExpanded(false);
    },
    [text, description, dueDate, priority, dispatch]
  );

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border border-amber-300 rounded-md"
            placeholder="Task title"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-amber-100 text-amber-800 px-3 py-2 rounded-md hover:bg-amber-200 transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <textarea
              className="w-full p-2 border border-amber-300 rounded-md"
              placeholder="Description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Due Date
                </label>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  minDate={new Date()}
                  className="w-full p-2 border border-amber-300 rounded-md"
                  placeholderText="Select date"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-900 mb-1">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorityOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`px-3 py-1 rounded-md text-white text-sm ${
                        option.color
                      } ${
                        priority === option.value 
                          ? 'ring-2 ring-offset-2 ring-amber-500' 
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
});

export default TodoForm;