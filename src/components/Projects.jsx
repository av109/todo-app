import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import Dialog from "./Dialog";

const Projects = React.memo(({ projects, activeProjectId, dispatch }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const inputRef = useRef(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const handleProjectClick = useCallback((projectId) => {
    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: projectId });
  }, [dispatch]);
  
  const handleAddProject = useCallback(() => {
    if (newProjectName.trim()) {
      const newProject = {
        id: uuidv4(),
        name: newProjectName.trim(),
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      setNewProjectName('');
      setIsDialogOpen(false);
    }
  }, [newProjectName, dispatch]);

  useEffect(() => {
    if (isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  const handleDeleteClick = useCallback((projectId, e) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (projectToDelete) {
      dispatch({ type: 'DELETE_PROJECT', payload: projectToDelete });
    }
    setIsDeleteDialogOpen(false);
  }, [dispatch, projectToDelete]);

  return (
    <div className="w-1/4 bg-amber-100 p-4 border-r border-amber-200">
      <h2 className="text-xl font-semibold mb-4 text-amber-950">Projects</h2>
      
      <ul className="space-y-2">
        {projects.map(project => (
          <motion.li
            key={project.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 rounded-md cursor-pointer transition-colors relative ${
              project.id === activeProjectId 
                ? 'bg-amber-500 text-white' 
                : 'hover:bg-amber-200'
            }`}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </div>
              {project.id !== 'default' && (
                <button
                  onClick={(e) => handleDeleteClick(project.id, e)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
      
      <button
        onClick={() => setIsDialogOpen(true)}
        className="mt-4 w-full bg-amber-600 text-white p-2 rounded-md hover:bg-amber-700 transition-colors"
      >
        + New Project
      </button>
      
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleAddProject}
        title="Create New Project"
        confirmText="Create"
      >
        <input
          ref={inputRef}          
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          className="w-full p-2 border border-amber-300 rounded-md mb-2"
          placeholder="Project name"
          onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
        />
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        confirmText="Delete"
      >
        <p>Are you sure you want to delete this project and all its tasks?</p>
      </Dialog>
    </div>
  );
});

export default Projects;