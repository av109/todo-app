import React, { useMemo, useCallback, useState } from "react";
import { 
  MdEdit, 
  MdDeleteOutline, 
  MdCheckBox, 
  MdOutlineSquare,
  MdExpandMore,
  MdExpandLess,
  MdOutlineNotes,
  MdCalendarToday,
  MdFlag
} from "react-icons/md";
import EditDialog from "./EditDialog";
import Dialog from "./Dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

const TodoList = React.memo(({ tasks, dispatch, selectedTab }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleChecked = useCallback(
    (id) => dispatch({ type: "TOGGLE_TASK", payload: id }),
    [dispatch]
  );

  const handleDeleteClick = useCallback(
    (id) => setDeletingTaskId(id),
    []
  );

  const confirmDelete = useCallback(() => {
    dispatch({ type: "DELETE_TASK", payload: deletingTaskId });
    setDeletingTaskId(null);
  }, [deletingTaskId, dispatch]);

  const handleEditClick = useCallback(
    (task) => setEditingTask(task),
    []
  );

  const handleSaveEdit = useCallback(
    (updates) => {
      dispatch({
        type: "EDIT_TASK",
        payload: { id: editingTask.id, updates }
      });
      setEditingTask(null);
    },
    [dispatch, editingTask]
  );

  const toggleTaskExpansion = useCallback((taskId) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId);
  }, []);  

  const handleAddChecklistItem = useCallback((taskId) => {
    if (newChecklistItem.trim() === '') return;
  
    const newItem = {
      id: uuidv4(),
      text: newChecklistItem.trim(),
      completed: false,
    };
  
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        id: taskId,
        updates: {
          checklist: [...(tasks.find(t => t.id === taskId)?.checklist || []), newItem],
        },
      },
    });
  
    setNewChecklistItem('');
  }, [dispatch, newChecklistItem, tasks]);

  const handleToggleChecklistItem = useCallback((taskId, itemId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;
    
    const updatedChecklist = task.checklist.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        id: taskId,
        updates: { checklist: updatedChecklist }
      }
    });
  }, [dispatch, tasks]);

  const handleDeleteChecklistItem = useCallback((taskId, itemId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.checklist) return;
    
    const updatedChecklist = task.checklist.filter(item => item.id !== itemId);
    
    dispatch({
      type: 'EDIT_TASK',
      payload: {
        id: taskId,
        updates: { checklist: updatedChecklist }
      }
    });
  }, [dispatch, tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedTab === "Active") return !task.isCompleted;
      if (selectedTab === "Completed") return task.isCompleted;
      return true;
    });
  }, [tasks, selectedTab]);

  return (
    <div className="w-full p-4">
      {/* Edit Dialog */}
      <EditDialog
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        confirmText="Delete"
      >
        <p className="text-gray-700">Are you sure you want to delete this task?</p>
      </Dialog>

      <ul className="space-y-3">
        {filteredTasks.length === 0 && (
          <li className="text-gray-500 text-center py-4">No tasks available</li>
        )}
        
        {filteredTasks.map((task) => (
          <motion.li
            key={task.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ opacity: { duration: 0.2 }, y: { duration: 0.3 }, scale: { duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleChecked(task.id)}
                    className="mt-1 text-amber-600 hover:text-amber-700"
                  >
                    {task.isCompleted ? (
                      <MdCheckBox className="text-2xl" />
                    ) : (
                      <MdOutlineSquare className="text-2xl" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.dueDate && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MdCalendarToday className="mr-1" />
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </div>
                    )}
                    
                    {expandedTaskId === task.id && task.description && (
                      <div className="mt-2 text-gray-600 flex items-start">
                        <MdOutlineNotes className="mr-2 mt-1 flex-shrink-0" />
                        <p>{task.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  {task.priority && (
                    <span 
                      className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`}
                      title={task.priority}
                    />
                  )}
                  <button
                    onClick={() => toggleTaskExpansion(task.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedTaskId === task.id ? (
                      <MdExpandLess className="text-xl" />
                    ) : (
                      <MdExpandMore className="text-xl" />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedTaskId === task.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  {task.checklist && task.checklist.length > 0 && (
                    <div className="mb-2">
                      <ul className="space-y-1">
                        {task.checklist.map((item) => (
                          <li key={item.id} className="flex items-center justify-between bg-gray-50 rounded-md px-2 py-1">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklistItem(task.id, item.id)}
                                className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                              />
                              <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                                {item.text}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteChecklistItem(task.id, item.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <MdDeleteOutline className="h-5 w-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Progress Bar */}
                  {task.checklist && task.checklist.length > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-amber-600 h-2.5 rounded-full"
                          style={{ 
                            width: `${(task.checklist.filter(item => item.completed).length / task.checklist.length * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Add Checklist Item */}
                  <div className="mt-2 flex items-center">
                    <input
                      type="text"
                      value={newChecklistItem}
                      onChange={(e) => setNewChecklistItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem(task.id)}
                      placeholder="New checklist item"
                      className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
                    />
                    <button 
                      onClick={() => handleAddChecklistItem(task.id)} 
                      className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
              
              <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEditClick(task)}
                  className="text-amber-600 hover:text-amber-700 p-1"
                  title="Edit"
                >
                  <MdEdit className="text-xl" />
                </button>
                
                <button
                  onClick={() => handleDeleteClick(task.id)}
                  className="text-amber-600 hover:text-amber-700 p-1"
                  title="Delete"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
});

export default TodoList;