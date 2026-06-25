// src/context/AppContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { projectService } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [mergedDesign, setMergedDesign] = useState(null);
  const [voiceCommand, setVoiceCommand] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
      setCurrentProject(newProject);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(
    async (id, updates) => {
      try {
        const updated = await projectService.updateProject(id, updates);
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (currentProject?.id === id) setCurrentProject(updated);
        return updated;
      } catch (error) {
        console.error('Failed to update project:', error);
        throw error;
      }
    },
    [currentProject]
  );

  const deleteProject = useCallback(
    async (id) => {
      try {
        await projectService.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (currentProject?.id === id) setCurrentProject(null);
      } catch (error) {
        console.error('Failed to delete project:', error);
        throw error;
      }
    },
    [currentProject]
  );

  const value = {
    currentProject,
    setCurrentProject,
    projects,
    setProjects,
    selectedDesigns,
    setSelectedDesigns,
    mergedDesign,
    setMergedDesign,
    voiceCommand,
    setVoiceCommand,
    loading,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
