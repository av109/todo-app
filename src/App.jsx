import React from "react";
import TodoForm from "./components/TodoForm";
import Tabs from "./components/Tabs";
import TodoList from "./components/TodoList";
import Projects from "./components/Projects";
import { useState, useReducer } from "react";

const DEFAULT_PROJECT_ID = 'default';

// Initial state with a default project
const initialState = {
  projects: [
    {
      id: DEFAULT_PROJECT_ID,
      name: 'Default Project',
      color: '#f59e0b',
    }
  ],
  activeProjectId: 'default',
  tasks: []
};

// Reducer function to manage state
const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, {
          id: Date.now(),
          projectId: state.activeProjectId,
          title: action.payload.title,
          description: action.payload.description || '',
          dueDate: action.payload.dueDate || null,
          priority: action.payload.priority || 'medium',
          isCompleted: false,
          notes: '',
          checklist: [],
          createdAt: new Date().toISOString()
        }]
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };

    case 'SET_ACTIVE_PROJECT':
      return {
        ...state,
        activeProjectId: action.payload
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        // Switch to default project if deleting the current active one
        activeProjectId: state.activeProjectId === action.payload
          ? DEFAULT_PROJECT_ID
          : state.activeProjectId,
        // Remove all tasks associated with this project
        tasks: state.tasks.filter(task => task.projectId !== action.payload)
      };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Projects Sidebar */}
      <Projects
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        dispatch={dispatch}
      />

      {/* Main Content */}
      <div className="w-3/4 mx-auto flex flex-col justify-center items-center min-h-screen select-none">
        <h1 className="text-4xl self-start p-4 font-(family-name:--font-akira) text-amber-950">
          {state.projects.find(p => p.id === state.activeProjectId)?.name || 'Tasks'}
        </h1>

        <TodoForm dispatch={dispatch} />
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <TodoList
          tasks={state.tasks.filter(t => t.projectId === state.activeProjectId)}
          dispatch={dispatch}
          selectedTab={selectedTab}
        />
      </div>
    </div>
  );
}

export default React.memo(App);