// Saved_Pages.js - Complete Rewrite with Proper Exports
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Fade,
  Paper,
  Tabs,
  Tab,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Divider,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  DeleteOutline,
  Visibility,
  Launch,
  Edit,
  Share,
  MoreVert,
  Search,
  Sort,
  CheckCircle,
  Publish,
  Drafts,
  AccessTime,
  Image as ImageIcon,
  Brush,
  Code,
  Storage,
  ContentCopy,
  GetApp,
  Clear,
  Refresh,
  TextFields as TypographyIcon,
  CloudUpload,
  History,
  CheckCircleOutline,
  ErrorOutline,
  Close,
  FolderOpen,
  Star,
  StarBorder,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode';

// ============================================================
// CONSTANTS & CONFIGURATION
// ============================================================
const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
const STORAGE_KEYS = {
  PROJECT_PREFIX: 'project_',
  PUBLISHED_PREFIX: 'published_',
  LATEST_PROJECT_ID: 'latest_project_id',
  LATEST_PROJECT_DATA: 'latest_project_data',
  FAVORITES: 'favorite_projects',
};
const ITEMS_PER_PAGE = 12;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getAuthToken = () => localStorage.getItem('authToken');

const generateId = () => `project_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Invalid date';
  }
};

const getStatusChip = (status) => {
  if (status === 'published') {
    return {
      label: 'Published',
      icon: <Publish sx={{ fontSize: 12 }} />,
      color: '#4CAF50',
      bg: alpha('#4CAF50', 0.15),
    };
  }
  return {
    label: 'Draft',
    icon: <Drafts sx={{ fontSize: 12 }} />,
    color: '#FFA726',
    bg: alpha('#FFA726', 0.15),
  };
};

const getProjectStats = (project) => ({
  componentCount: project.components?.length || 0,
  textCount: project.textElements?.length || 0,
  imageCount: project.uploadedImages?.length || 0,
  pageCount: project.pages?.length || 1,
});

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
};

// ============================================================
// CUSTOM HOOKS
// ============================================================
const useLocalStorageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const projectMap = new Map();

      // Load regular projects
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_KEYS.PROJECT_PREFIX)) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data?.id && data?.name) {
              projectMap.set(data.id, {
                id: data.id,
                name: data.name,
                lastEdited: data.lastEdited || new Date().toISOString(),
                status: data.status || 'draft',
                type: data.type || 'custom',
                components: data.components || [],
                textElements: data.textElements || [],
                imageElements: data.imageElements || [],
                uploadedImages: data.uploadedImages || [],
                styles: data.styles || {},
                pages: data.pages || [],
                publishSlug: data.publishSlug || data.slug,
                publishedUrl:
                  data.publishedUrl ||
                  (data.publishSlug
                    ? `${window.location.origin}/p/${data.publishSlug}`
                    : undefined),
                thumbnail: data.thumbnail,
              });
            }
          } catch (e) {
            console.warn(`Failed to parse project ${key}:`, e);
          }
        }
      }

      // Load published projects (merge or override)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_KEYS.PUBLISHED_PREFIX)) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            if (data?.id && data?.name) {
              const existing = projectMap.get(data.id);
              if (existing) {
                projectMap.set(data.id, {
                  ...existing,
                  ...data,
                  status: 'published',
                  publishedUrl:
                    data.publishedUrl ||
                    (data.slug ? `${window.location.origin}/p/${data.slug}` : undefined),
                });
              } else {
                projectMap.set(data.id, {
                  id: data.id,
                  name: data.name,
                  lastEdited: data.lastEdited || new Date().toISOString(),
                  status: 'published',
                  type: data.type || 'custom',
                  components: data.components || [],
                  textElements: data.textElements || [],
                  imageElements: data.imageElements || [],
                  uploadedImages: data.uploadedImages || [],
                  styles: data.styles || {},
                  pages: data.pages || [],
                  publishSlug: data.slug,
                  publishedUrl:
                    data.publishedUrl ||
                    (data.slug ? `${window.location.origin}/p/${data.slug}` : undefined),
                  thumbnail: data.thumbnail,
                });
              }
            }
          } catch (e) {
            console.warn(`Failed to parse published project ${key}:`, e);
          }
        }
      }

      // Convert to array and sort
      const projectList = Array.from(projectMap.values());
      projectList.sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );

      setProjects(projectList);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError('Failed to load projects from storage');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProject = useCallback(
    (project) => {
      try {
        const key = `${STORAGE_KEYS.PROJECT_PREFIX}${project.id}`;
        localStorage.setItem(key, JSON.stringify(project));
        loadProjects();
        return true;
      } catch (err) {
        console.error('Error saving project:', err);
        return false;
      }
    },
    [loadProjects]
  );

  const deleteProject = useCallback(
    (projectId) => {
      try {
        localStorage.removeItem(`${STORAGE_KEYS.PROJECT_PREFIX}${projectId}`);
        localStorage.removeItem(`${STORAGE_KEYS.PUBLISHED_PREFIX}${projectId}`);
        loadProjects();
        return true;
      } catch (err) {
        console.error('Error deleting project:', err);
        return false;
      }
    },
    [loadProjects]
  );

  const duplicateProject = useCallback(
    (project) => {
      try {
        const newProject = {
          ...project,
          id: generateId(),
          name: `${project.name} (Copy)`,
          status: 'draft',
          lastEdited: new Date().toISOString(),
          publishSlug: undefined,
          publishedUrl: undefined,
        };
        localStorage.setItem(
          `${STORAGE_KEYS.PROJECT_PREFIX}${newProject.id}`,
          JSON.stringify(newProject)
        );
        loadProjects();
        return newProject;
      } catch (err) {
        console.error('Error duplicating project:', err);
        return null;
      }
    },
    [loadProjects]
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { projects, loading, error, loadProjects, saveProject, deleteProject, duplicateProject };
};

// ============================================================
// THUMBNAIL GENERATOR
// ============================================================
const generateThumbnail = (project) => {
  if (project?.thumbnail) return project.thumbnail;
  if (!project) return null;

  const styles = project.styles || {};
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Helper for rounded rectangles
    const roundRect = (x, y, w, h, r) => {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    // Background
    ctx.fillStyle = styles.backgroundColor || '#080C14';
    ctx.fillRect(0, 0, 600, 340);

    // Hero gradient band
    const grad = ctx.createLinearGradient(0, 0, 600, 180);
    grad.addColorStop(0, styles.primaryColor || '#4F6EF7');
    grad.addColorStop(1, styles.secondaryColor || '#2DBCB6');
    ctx.fillStyle = grad;
    roundRect(20, 20, 560, 160, 12);
    ctx.fill();

    // Heading mock text bars
    ctx.fillStyle = styles.headingColor || '#FFFFFF';
    ctx.globalAlpha = 0.9;
    roundRect(120, 65, 360, 18, 4);
    ctx.fill();
    ctx.globalAlpha = 0.55;
    roundRect(170, 95, 260, 10, 3);
    ctx.fill();

    // Button mock
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#FFFFFF';
    roundRect(240, 122, 120, 32, 8);
    ctx.fill();

    // Card mocks
    const cardColors = [styles.primaryColor, styles.secondaryColor, styles.accentColor];
    [0, 1, 2].forEach((i) => {
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = cardColors[i] || '#4F6EF7';
      roundRect(20 + i * 194, 200, 174, 120, 10);
      ctx.fill();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = cardColors[i] || '#4F6EF7';
      roundRect(40 + i * 194, 220, 80, 8, 3);
      ctx.fill();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = styles.textColor || '#FFFFFF';
      roundRect(40 + i * 194, 240, 130, 6, 2);
      ctx.fill();
      roundRect(40 + i * 194, 254, 100, 6, 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Thumbnail generation failed:', err);
    return null;
  }
};

// ============================================================
// MAIN COMPONENT - ProjectsGallery
// ============================================================
const ProjectsGallery = ({
  onOpenProject,
  onPreviewProject,
  onPublishProject,
  onDeleteProject,
  onDuplicateProject,
  maxItems = 100,
  showHeader = true,
  compact = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // ── Custom Hooks ──
  const { projects, loading, error, loadProjects, saveProject, deleteProject, duplicateProject } =
    useLocalStorageProjects();

  // ── State ──
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionProject, setVersionProject] = useState(null);

  // Menu states
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuProject, setMenuProject] = useState(null);

  // Database sync states
  const [savingProjectId, setSavingProjectId] = useState(null);
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // UI states
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [publishSlug, setPublishSlug] = useState('');

  // ── Effects ──
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    applyFilters(projects, searchTerm, statusFilter, sortBy, sortOrder);
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder]);

  // ── Filter Functions ──
  const applyFilters = useCallback(
    (projectList, search, status, sort, order) => {
      let filtered = [...projectList];

      // Search filter
      if (search?.trim()) {
        const term = search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.type && p.type.toLowerCase().includes(term)) ||
            (p.publishSlug && p.publishSlug.toLowerCase().includes(term))
        );
      }

      // Status filter
      if (status !== 'all') {
        filtered = filtered.filter((p) => p.status === status);
      }

      // Sort
      filtered.sort((a, b) => {
        if (sort === 'date') {
          const dateA = new Date(a.lastEdited).getTime();
          const dateB = new Date(b.lastEdited).getTime();
          return order === 'desc' ? dateB - dateA : dateA - dateB;
        } else if (sort === 'name') {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return order === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
        } else if (sort === 'favorites') {
          const favA = favorites.includes(a.id) ? 1 : 0;
          const favB = favorites.includes(b.id) ? 1 : 0;
          return order === 'desc' ? favB - favA : favA - favB;
        }
        return 0;
      });

      setFilteredProjects(filtered);
      setPage(1);
    },
    [favorites]
  );

  // ── DATABASE SYNC FUNCTIONS ──
  const saveProjectToDB = useCallback(async (project, versionLabel = null) => {
    const token = getAuthToken();
    if (!token) {
      setSaveError('Please log in to save projects to the database.');
      return;
    }

    setSavingProjectId(project.id);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const customizations = {
        components: project.components || [],
        textElements: project.textElements || [],
        imageElements: project.imageElements || [],
        uploadedImages: project.uploadedImages || [],
        styles: project.styles || {},
        pages: project.pages || [],
      };

      const response = await axios.put(
        `${API_BASE}/api/projects/${project.id}`,
        {
          name: project.name,
          customizations: customizations,
          status: project.status || 'draft',
          label: versionLabel || `Manual save - ${new Date().toLocaleDateString()}`,
          lastEdited: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSavedProjectIds((prev) => new Set([...prev, project.id]));
      setSaveSuccess(`"${project.name}" saved successfully`);
      return response.data;
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.detail || err.message || 'Failed to save project';
      setSaveError(msg);
      throw err;
    } finally {
      setSavingProjectId(null);
    }
  }, []);

  const fetchVersions = useCallback(async (project) => {
    const token = getAuthToken();
    if (!token) {
      setSaveError('Please log in to view version history.');
      return;
    }

    setVersionProject(project);
    setVersions([]);
    setVersionDialogOpen(true);
    setLoadingVersions(true);

    try {
      const response = await axios.get(`${API_BASE}/api/projects/${project.id}/versions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setVersions(response.data || []);
    } catch (err) {
      console.error('Error fetching versions:', err);
      setVersions([]);
      setSaveError('Failed to load version history');
    } finally {
      setLoadingVersions(false);
    }
  }, []);

  const restoreVersion = useCallback(
    async (projectId, versionNumber) => {
      const token = getAuthToken();
      if (!token) {
        setSaveError('Please log in to restore versions.');
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE}/api/projects/${projectId}/versions/${versionNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const snapshot = response.data.snapshot;
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          const restored = {
            ...project,
            ...snapshot,
            name: project.name,
            lastEdited: new Date().toISOString(),
          };
          saveProject(restored);
          setVersionDialogOpen(false);
          setSaveSuccess(`Restored to version ${versionNumber}`);
          return restored;
        }
        return null;
      } catch (err) {
        console.error('Error restoring version:', err);
        setSaveError('Failed to restore version');
        return null;
      }
    },
    [projects, saveProject]
  );

  const saveAllProjectsToDB = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setSaveError('Please log in to save projects to the database.');
      return;
    }

    let successCount = 0;
    for (const project of projects) {
      try {
        await saveProjectToDB(project, 'Bulk save');
        successCount++;
      } catch (err) {
        console.error(`Failed to save project ${project.id}:`, err);
      }
    }
    setSaveSuccess(`Saved ${successCount}/${projects.length} project(s) to database.`);
  }, [projects, saveProjectToDB]);

  // ── Action Handlers ──
  const handleOpenProject = useCallback(
    (project) => {
      if (onOpenProject) {
        onOpenProject(project);
      } else {
        localStorage.setItem(
          `${STORAGE_KEYS.PROJECT_PREFIX}${project.id}`,
          JSON.stringify(project)
        );
        localStorage.setItem(STORAGE_KEYS.LATEST_PROJECT_ID, project.id);
        localStorage.setItem(STORAGE_KEYS.LATEST_PROJECT_DATA, JSON.stringify(project));
        navigate(`/studio?project=${project.id}`);
      }
    },
    [navigate, onOpenProject]
  );

  const handlePreviewProject = useCallback(
    (project) => {
      if (onPreviewProject) {
        onPreviewProject(project);
      } else {
        localStorage.setItem(
          `${STORAGE_KEYS.PROJECT_PREFIX}${project.id}`,
          JSON.stringify(project)
        );
        localStorage.setItem(STORAGE_KEYS.LATEST_PROJECT_ID, project.id);
        localStorage.setItem(STORAGE_KEYS.LATEST_PROJECT_DATA, JSON.stringify(project));
        navigate(`/preview?id=${project.id}&t=${Date.now()}`);
      }
    },
    [navigate, onPreviewProject]
  );

  const handlePublishProject = useCallback(
    (project) => {
      if (onPublishProject) {
        onPublishProject(project);
      } else {
        setSelectedProject(project);
        setPublishSlug(project.publishSlug || '');
        setPublishDialogOpen(true);
      }
    },
    [onPublishProject]
  );

  const handleDeleteProject = useCallback(
    (projectId) => {
      if (onDeleteProject) {
        onDeleteProject(projectId);
      } else {
        deleteProject(projectId);
      }
    },
    [deleteProject, onDeleteProject]
  );

  const handleDuplicateProject = useCallback(
    (project) => {
      if (onDuplicateProject) {
        onDuplicateProject(project);
      } else {
        duplicateProject(project);
      }
    },
    [duplicateProject, onDuplicateProject]
  );

  const handleExportProject = useCallback((project) => {
    setExporting(true);
    try {
      const exportData = {
        ...project,
        exportedAt: new Date().toISOString(),
        version: '2.0',
        exporter: 'ProjectsGallery',
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name.replace(/[^a-z0-9]/gi, '_')}_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      setSaveError('Failed to export project');
    } finally {
      setExporting(false);
    }
  }, []);

  const copyToClipboard = useCallback((text) => {
    if (!text) return;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }, []);

  const toggleFavorite = useCallback((projectId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // ── Memoized Values ──
  const totalPages = useMemo(
    () => Math.ceil(filteredProjects.length / ITEMS_PER_PAGE),
    [filteredProjects.length]
  );

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, page]);

  const publishedCount = useMemo(
    () => projects.filter((p) => p.status === 'published').length,
    [projects]
  );

  const draftCount = useMemo(() => projects.filter((p) => p.status === 'draft').length, [projects]);

  // ── Render Helpers ──
  const renderSkeletons = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {showHeader && (
        <Box sx={{ mb: 4 }}>
          <Skeleton
            variant="text"
            width={300}
            height={40}
            sx={{ bgcolor: alpha('#FFFFFF', 0.05) }}
          />
          <Skeleton
            variant="text"
            width={200}
            height={24}
            sx={{ bgcolor: alpha('#FFFFFF', 0.05) }}
          />
        </Box>
      )}
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Skeleton
              variant="rounded"
              height={280}
              sx={{ borderRadius: 3, bgcolor: alpha('#FFFFFF', 0.05) }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const renderEmptyState = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Paper
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          bgcolor: alpha('#FFFFFF', 0.02),
          borderRadius: 4,
          border: `1px dashed ${alpha('#4F6EF7', 0.3)}`,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: alpha('#4F6EF7', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Storage sx={{ fontSize: 40, color: alpha('#4F6EF7', 0.5) }} />
        </Box>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          {searchTerm ? 'No matching projects found' : 'No projects yet'}
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mb: 3 }}>
          {searchTerm
            ? 'Try adjusting your search or filters'
            : 'Create your first project to get started'}
        </Typography>
        {!searchTerm && (
          <Button
            variant="contained"
            startIcon={<Brush />}
            onClick={() => navigate('/studio')}
            sx={{
              background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            Create New Project
          </Button>
        )}
      </Paper>
    </motion.div>
  );

  const renderProjectCard = (project, index) => {
    const stats = getProjectStats(project);
    const statusChip = getStatusChip(project.status);
    const thumbnail = generateThumbnail(project);
    const isFavorite = favorites.includes(project.id);
    const isSaved = savedProjectIds.has(project.id);
    const isSaving = savingProjectId === project.id;
    const publishedUrl =
      project.publishedUrl ||
      (project.publishSlug ? `${window.location.origin}/p/${project.publishSlug}` : null);

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.5) }}
          whileHover={{ y: -4 }}
        >
          <Card
            sx={{
              bgcolor: alpha('#FFFFFF', 0.04),
              borderRadius: 3,
              border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                borderColor: alpha('#4F6EF7', 0.3),
                boxShadow: `0 8px 32px ${alpha('#4F6EF7', 0.15)}`,
              },
            }}
          >
            {/* Thumbnail */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              {thumbnail ? (
                <CardMedia
                  component="img"
                  image={thumbnail}
                  alt={project.name}
                  sx={{ height: 160, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 160,
                    background: 'linear-gradient(135deg, #1A1F2E, #0A0F1A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Brush sx={{ fontSize: 48, color: alpha('#4F6EF7', 0.3) }} />
                </Box>
              )}

              {/* Status badge */}
              <Chip
                size="small"
                icon={statusChip.icon}
                label={statusChip.label}
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: statusChip.bg,
                  color: statusChip.color,
                  border: `1px solid ${alpha(statusChip.color, 0.3)}`,
                  fontSize: '0.7rem',
                  height: 24,
                }}
              />

              {/* Favorite button */}
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 60,
                  bgcolor: alpha('#000000', 0.5),
                  color: isFavorite ? '#FFD700' : 'white',
                  '&:hover': { bgcolor: alpha('#000000', 0.7) },
                }}
                onClick={() => toggleFavorite(project.id)}
              >
                {isFavorite ? <Star sx={{ fontSize: 16 }} /> : <StarBorder sx={{ fontSize: 16 }} />}
              </IconButton>

              {/* Menu button */}
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: alpha('#000000', 0.5),
                  color: 'white',
                  '&:hover': { bgcolor: alpha('#000000', 0.7) },
                }}
                onClick={(e) => {
                  setMenuAnchorEl(e.currentTarget);
                  setMenuProject(project);
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>

            <CardContent sx={{ pb: 1, flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {project.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <AccessTime sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }} />
                <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  {formatDate(project.lastEdited)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Tooltip title="Components">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Code sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }} />
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      {stats.componentCount}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Text Elements">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TypographyIcon sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }} />
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      {stats.textCount}
                    </Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Images">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <ImageIcon sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }} />
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                      {stats.imageCount}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              {/* Color palette preview */}
              {project.styles && (
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1, alignItems: 'center' }}>
                  {['primaryColor', 'secondaryColor', 'accentColor'].map((key) => {
                    const color = project.styles[key];
                    return color ? (
                      <Box
                        key={key}
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: color,
                          borderRadius: '4px',
                          border: `1px solid ${alpha('#FFFFFF', 0.2)}`,
                        }}
                      />
                    ) : null;
                  })}
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.3), ml: 0.5 }}>
                    {project.styles?.fontFamily?.split(',')[0] || 'Default'}
                  </Typography>
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1, flexWrap: 'wrap' }}>
              <Tooltip title="Open in Editor">
                <IconButton
                  size="small"
                  onClick={() => handleOpenProject(project)}
                  sx={{
                    color: '#4F6EF7',
                    bgcolor: alpha('#4F6EF7', 0.1),
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: alpha('#4F6EF7', 0.2) },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Preview">
                <IconButton
                  size="small"
                  onClick={() => handlePreviewProject(project)}
                  sx={{
                    color: '#2DBCB6',
                    bgcolor: alpha('#2DBCB6', 0.1),
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: alpha('#2DBCB6', 0.2) },
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              {publishedUrl && (
                <Tooltip title="View Published">
                  <IconButton
                    size="small"
                    onClick={() => window.open(publishedUrl, '_blank')}
                    sx={{
                      color: '#3ED67C',
                      bgcolor: alpha('#3ED67C', 0.1),
                      borderRadius: 1.5,
                      '&:hover': { bgcolor: alpha('#3ED67C', 0.2) },
                    }}
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {project.status === 'draft' && (
                <Tooltip title="Publish">
                  <IconButton
                    size="small"
                    onClick={() => handlePublishProject(project)}
                    sx={{
                      color: '#FFA726',
                      bgcolor: alpha('#FFA726', 0.1),
                      borderRadius: 1.5,
                      '&:hover': { bgcolor: alpha('#FFA726', 0.2) },
                    }}
                  >
                    <Publish fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedProject(project);
                    setShareDialogOpen(true);
                  }}
                  sx={{ color: alpha('#FFFFFF', 0.5), borderRadius: 1.5 }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Version History">
                <IconButton
                  size="small"
                  onClick={() => fetchVersions(project)}
                  sx={{ color: alpha('#FFFFFF', 0.4), borderRadius: 1.5 }}
                >
                  <History fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={isSaved ? 'Saved to DB ✓' : 'Save to Database'}>
                <IconButton
                  size="small"
                  onClick={() => saveProjectToDB(project)}
                  disabled={isSaving}
                  sx={{
                    color: isSaved ? '#3ED67C' : '#4F6EF7',
                    bgcolor: isSaved ? alpha('#3ED67C', 0.1) : alpha('#4F6EF7', 0.1),
                    borderRadius: 1.5,
                  }}
                >
                  {isSaving ? (
                    <CircularProgress size={14} sx={{ color: '#4F6EF7' }} />
                  ) : isSaved ? (
                    <CheckCircleOutline fontSize="small" />
                  ) : (
                    <CloudUpload fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  // ── Loading State ──
  if (loading) {
    return renderSkeletons();
  }

  // ── Main Render ──
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #080C14 0%, #0A0F1A 100%)',
      }}
    >
      <Container maxWidth="xl" sx={{ py: compact ? 2 : 4 }}>
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: 4,
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #4F6EF7 0%, #2DBCB6 50%, #3ED67C 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 0.5,
                  }}
                >
                  My Projects
                </Typography>
                <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} •
                  {publishedCount} published • {draftCount} drafts
                  {favorites.length > 0 && ` • ${favorites.length} favorites`}
                </Typography>
              </Box>

              <Box
                onClick={() => navigate('/dashboard')}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.7 },
                }}
              >
                <Typography
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white' }}
                >
                  ← Back to Dashboard
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={loadProjects}
                  sx={{
                    color: 'white',
                    borderColor: alpha('#FFFFFF', 0.2),
                    '&:hover': { borderColor: '#4F6EF7' },
                  }}
                >
                  Refresh
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={saveAllProjectsToDB}
                  disabled={savingProjectId !== null}
                  sx={{
                    color: '#3ED67C',
                    borderColor: '#3ED67C',
                    '&:hover': {
                      borderColor: '#3ED67C',
                      bgcolor: 'rgba(62,214,124,0.08)',
                    },
                  }}
                >
                  Save All to DB
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Brush />}
                  onClick={() => navigate('/studio')}
                  sx={{
                    background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  New Project
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, bgcolor: '#2A1A1A', color: '#ff6b6b' }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Filters Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Paper
            sx={{
              p: 2,
              mb: 4,
              bgcolor: alpha('#FFFFFF', 0.03),
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: alpha('#FFFFFF', 0.5), fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <Clear sx={{ color: alpha('#FFFFFF', 0.5), fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#FFFFFF', 0.2),
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#4F6EF7', 0.5),
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: alpha('#FFFFFF', 0.6) }}>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#FFFFFF', 0.2),
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={4} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: alpha('#FFFFFF', 0.6) }}>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort by"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha('#FFFFFF', 0.2),
                      },
                    }}
                  >
                    <MenuItem value="date">Last Modified</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="favorites">Favorites</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title={sortOrder === 'desc' ? 'Descending' : 'Ascending'}>
                    <IconButton
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      sx={{ color: alpha('#FFFFFF', 0.6) }}
                    >
                      <Sort sx={{ transform: sortOrder === 'desc' ? 'scaleY(-1)' : 'none' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, v) => {
            setTabValue(v);
            if (v === 0) setStatusFilter('all');
            else if (v === 1) setStatusFilter('published');
            else setStatusFilter('draft');
          }}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: alpha('#FFFFFF', 0.6),
              textTransform: 'none',
              fontWeight: 500,
            },
            '& .Mui-selected': { color: '#4F6EF7' },
            '& .MuiTabs-indicator': { backgroundColor: '#4F6EF7' },
          }}
        >
          <Tab label={`All (${projects.length})`} />
          <Tab label={`Published (${publishedCount})`} />
          <Tab label={`Drafts (${draftCount})`} />
        </Tabs>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedProjects.map((project, index) => renderProjectCard(project, index))}
              </AnimatePresence>
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: alpha('#FFFFFF', 0.7),
                      borderColor: alpha('#FFFFFF', 0.2),
                    },
                    '& .Mui-selected': {
                      background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
                      color: 'white',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* ── MENU POPOVER ── */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 2,
            border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
            minWidth: 200,
          },
        }}
      >
        {menuProject && (
          <>
            <MenuItem
              onClick={() => {
                handleOpenProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1.5 }}
            >
              <Edit fontSize="small" /> Open in Editor
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePreviewProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1.5 }}
            >
              <Visibility fontSize="small" /> Preview
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDuplicateProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1.5 }}
            >
              <ContentCopy fontSize="small" /> Duplicate
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleExportProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1.5 }}
              disabled={exporting}
            >
              <GetApp fontSize="small" /> Export JSON
            </MenuItem>
            <MenuItem
              onClick={() => {
                saveProjectToDB(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: '#3ED67C', gap: 1.5 }}
              disabled={savingProjectId === menuProject?.id}
            >
              <CloudUpload fontSize="small" />
              {savingProjectId === menuProject?.id ? 'Saving…' : 'Save to Database'}
            </MenuItem>
            <MenuItem
              onClick={() => {
                fetchVersions(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: '#2DBCB6', gap: 1.5 }}
            >
              <History fontSize="small" /> Version History
            </MenuItem>
            <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />
            <MenuItem
              onClick={() => {
                setSelectedProject(menuProject);
                setDeleteDialogOpen(true);
                setMenuAnchorEl(null);
              }}
              sx={{ color: '#ff4444', gap: 1.5 }}
            >
              <DeleteOutline fontSize="small" /> Delete
            </MenuItem>
          </>
        )}
      </Menu>

      {/* ── DELETE DIALOG ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 3,
            border: `1px solid ${alpha('#ff4444', 0.3)}`,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteOutline sx={{ color: '#ff4444' }} />
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: alpha('#FFFFFF', 0.7) }}>
            Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedProject) {
                handleDeleteProject(selectedProject.id);
                setDeleteDialogOpen(false);
                setSelectedProject(null);
              }
            }}
            variant="contained"
            sx={{ bgcolor: '#ff4444', '&:hover': { bgcolor: '#cc0000' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── PUBLISH DIALOG ── */}
      <Dialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 3,
            border: `1px solid ${alpha('#4F6EF7', 0.3)}`,
            minWidth: 450,
          },
        }}
      >
        <Box sx={{ height: 4, background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)' }} />
        <DialogTitle sx={{ color: 'white' }}>Publish Website</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: alpha('#FFFFFF', 0.7), mb: 2 }}>
            Publish "{selectedProject?.name}" to make it live on the web.
          </Typography>
          <TextField
            fullWidth
            label="Custom URL Slug (optional)"
            placeholder="my-awesome-site"
            value={publishSlug}
            onChange={(e) => setPublishSlug(e.target.value)}
            size="small"
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
            }}
          />
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Your website will be available at: {window.location.origin}/p/
            {publishSlug || '[your-slug]'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setPublishDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (selectedProject) {
                const updatedProject = {
                  ...selectedProject,
                  status: 'published',
                  publishSlug: publishSlug || selectedProject.id,
                  publishedUrl: `${window.location.origin}/p/${publishSlug || selectedProject.id}`,
                  lastEdited: new Date().toISOString(),
                };
                saveProject(updatedProject);
                setPublishDialogOpen(false);
                setSaveSuccess(`"${updatedProject.name}" published successfully!`);
              }
            }}
            sx={{ background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)' }}
          >
            Publish Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SHARE DIALOG ── */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 3,
            border: `1px solid ${alpha('#4F6EF7', 0.3)}`,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          Share Project
          <IconButton onClick={() => setShareDialogOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {selectedProject?.publishedUrl && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                  Published Link
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: alpha('#4F6EF7', 0.1),
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#4F6EF7',
                      wordBreak: 'break-all',
                      fontSize: '0.75rem',
                      flex: 1,
                      mr: 1,
                    }}
                  >
                    {selectedProject.publishedUrl}
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy Link'}>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(selectedProject.publishedUrl)}
                      sx={{ color: '#4F6EF7', flexShrink: 0 }}
                    >
                      {copied ? (
                        <CheckCircle sx={{ fontSize: 18 }} />
                      ) : (
                        <ContentCopy sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Box>
            )}

            {selectedProject && (
              <Box>
                <Typography variant="subtitle2" sx={{ color: alpha('#FFFFFF', 0.7), mb: 1 }}>
                  QR Code
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    width: 'fit-content',
                  }}
                >
                  <QRCode
                    value={
                      selectedProject.publishedUrl ||
                      `${window.location.origin}/preview?id=${selectedProject.id}`
                    }
                    size={120}
                    level="H"
                  />
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── VERSION HISTORY DIALOG ── */}
      <Dialog
        open={versionDialogOpen}
        onClose={() => setVersionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1A1F2E',
            borderRadius: 3,
            border: `1px solid ${alpha('#2DBCB6', 0.3)}`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ height: 3, background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6, #3ED67C)' }} />
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History sx={{ color: '#2DBCB6' }} />
          Version History — {versionProject?.name}
        </DialogTitle>
        <DialogContent>
          {loadingVersions ? (
            <Box sx={{ py: 3 }}>
              <LinearProgress
                sx={{
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #4F6EF7, #2DBCB6)',
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: alpha('#FFFFFF', 0.5), mt: 1, display: 'block', textAlign: 'center' }}
              >
                Loading versions…
              </Typography>
            </Box>
          ) : versions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History sx={{ fontSize: 48, color: alpha('#FFFFFF', 0.2), mb: 1 }} />
              <Typography sx={{ color: alpha('#FFFFFF', 0.5) }}>
                No versions saved yet. Click "Save to Database" on a project to create the first
                version.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {versions.map((v) => (
                <Paper
                  key={v.id}
                  sx={{
                    p: 2,
                    bgcolor: alpha('#FFFFFF', 0.04),
                    border: `1px solid ${alpha('#2DBCB6', 0.15)}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={`v${v.version_number}`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#4F6EF7', 0.2),
                          color: '#4F6EF7',
                          height: 20,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                        {v.label || `Version ${v.version_number}`}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.4) }}>
                      {formatDate(v.created_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Restore this version">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => restoreVersion(versionProject?.id, v.version_number)}
                        sx={{
                          color: '#2DBCB6',
                          borderColor: alpha('#2DBCB6', 0.4),
                          fontSize: '0.72rem',
                          py: 0.4,
                          '&:hover': {
                            borderColor: '#2DBCB6',
                            bgcolor: alpha('#2DBCB6', 0.08),
                          },
                        }}
                      >
                        Restore
                      </Button>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: 'wrap', gap: 1 }}>
          <Button
            onClick={() =>
              saveProjectToDB(versionProject, `Manual save — ${new Date().toLocaleDateString()}`)
            }
            variant="contained"
            disabled={savingProjectId === versionProject?.id}
            startIcon={
              savingProjectId === versionProject?.id ? (
                <CircularProgress size={14} />
              ) : (
                <CloudUpload />
              )
            }
            sx={{ background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)', mr: 'auto' }}
          >
            Save New Version
          </Button>
          <Button onClick={() => setVersionDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── SNACKBARS ── */}
      <Snackbar
        open={Boolean(saveSuccess)}
        autoHideDuration={4000}
        onClose={() => setSaveSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ bgcolor: '#1A2A1A', color: '#3ED67C' }}
          onClose={() => setSaveSuccess(null)}
        >
          {saveSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(saveError)}
        autoHideDuration={5000}
        onClose={() => setSaveError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          sx={{ bgcolor: '#2A1A1A', color: '#ff6b6b' }}
          onClose={() => setSaveError(null)}
        >
          {saveError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ============================================================
// SIMPLE VERSION - ProjectsGallerySimple
// ============================================================
const ProjectsGallerySimple = ({ token, onSelectProject }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress sx={{ color: '#4F6EF7' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
        Your Saved Projects
      </Typography>
      {projects.length === 0 ? (
        <Typography sx={{ color: alpha('#FFFFFF', 0.5) }}>
          No projects found. Create your first project!
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                sx={{
                  bgcolor: alpha('#FFFFFF', 0.05),
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#4F6EF7', 0.1),
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => onSelectProject && onSelectProject(project)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    {project.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
                    Last updated: {new Date(project.updated_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => onSelectProject && onSelectProject(project)}
                    sx={{
                      background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)',
                      '&:hover': { opacity: 0.9 },
                    }}
                  >
                    Open Project
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// ============================================================
// EXPORTS - Clean and consistent
// ============================================================

// Default export - the main full-featured component
export default ProjectsGallery;

// Named exports for both versions
export { ProjectsGallery, ProjectsGallerySimple };

// Also export the simple version as ProjectsGallerySimple (alias)
export { ProjectsGallerySimple as SimpleProjectsGallery };
