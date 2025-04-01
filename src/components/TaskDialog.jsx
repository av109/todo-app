import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';

const priorities = [
  { value: "low", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" }
];

const TaskDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialValues = {
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    notes: '',
    checklist: []
  }
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormValues(initialValues);
    }
  }, [isOpen, initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriorityChange = (priority) => {
    setFormValues(prev => ({
      ...prev,
      priority
    }));
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormValues(prev => ({
        ...prev,
        checklist: [
          ...prev.checklist,
          { id: Date.now(), text: newChecklistItem.trim(), completed: false }
        ]
      }));
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (id) => {
    setFormValues(prev => ({
      ...prev,
      checklist: prev.checklist.filter(item => item.id !== id)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newChecklistItem.trim()) {
      e.preventDefault();
      addChecklistItem();
    }
  };

  const handleSave = () => {
    if (!formValues.title.trim()) {
      alert("Title is required");
      return;
    }
    onSave(formValues);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSave}
      title={initialValues.id ? "Edit Task" : "Add New Task"}
      confirmText={initialValues.id ? "Save Changes" : "Add Task"}
      size="lg"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            autoFocus
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rows="2"
            className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Due Date & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formValues.dueDate}
              onChange={handleChange}
              className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handlePriorityChange(priority.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formValues.priority === priority.value
                      ? priority.color + ' ring-2 ring-offset-1 ring-gray-400'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formValues.notes}
            onChange={handleChange}
            rows="2"
            className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Checklist
          </label>
          <div className="space-y-2">
            {formValues.checklist.map(item => (
              <div key={item.id} className="flex items-center group">
                <span className="flex-1 truncate">{item.text}</span>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add checklist item..."
                className="flex-1 p-2 border border-amber-300 rounded-l-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="px-3 bg-amber-500 text-white rounded-r-md hover:bg-amber-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskDialog;