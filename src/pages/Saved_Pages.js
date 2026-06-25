import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

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

  // State
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuProject, setMenuProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Load projects from localStorage on mount
  const loadProjects = () => {
    setLoading(true);
    try {
      const projectList = [];

      // Iterate through localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('project_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            if (data && data.id && data.name) {
              projectList.push({
                id: data.id,
                name: data.name,
                lastEdited: data.lastEdited || new Date().toISOString(),
                status: data.status || 'draft',
                type: data.type || 'custom',
                components: data.components,
                textElements: data.textElements,
                imageElements: data.imageElements,
                uploadedImages: data.uploadedImages,
                styles: data.styles,
                pages: data.pages,
                publishSlug: data.publishSlug || data.slug,
                publishedUrl:
                  data.publishedUrl ||
                  (data.publishSlug
                    ? `${window.location.origin}/p/${data.publishSlug}`
                    : undefined),
              });
            }
          } catch (e) {
            console.error(`Error parsing project ${key}:`, e);
          }
        }
      }

      // Also check for published websites in separate storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('published_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            if (data && data.id && !projectList.find((p) => p.id === data.id)) {
              projectList.push({
                id: data.id,
                name: data.name,
                lastEdited: data.lastEdited || new Date().toISOString(),
                status: 'published',
                type: data.type || 'custom',
                components: data.components,
                textElements: data.textElements,
                imageElements: data.imageElements,
                uploadedImages: data.uploadedImages,
                styles: data.styles,
                pages: data.pages,
                publishSlug: data.slug,
                publishedUrl:
                  data.publishedUrl ||
                  (data.slug ? `${window.location.origin}/p/${data.slug}` : undefined),
              });
            }
          } catch (e) {
            console.error(`Error parsing published ${key}:`, e);
          }
        }
      }

      // Remove duplicates by ID
      const uniqueProjects = projectList.filter(
        (project, index, self) => index === self.findIndex((p) => p.id === project.id)
      );

      // Sort by lastEdited (newest first)
      uniqueProjects.sort(
        (a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
      );

      setProjects(uniqueProjects);
      applyFilters(uniqueProjects, searchTerm, statusFilter, sortBy, sortOrder);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const applyFilters = (projectList, search, status, sort, order) => {
    let filtered = [...projectList];

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) || (p.type && p.type.toLowerCase().includes(term))
      );
    }

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sort === 'date') {
        const dateA = new Date(a.lastEdited).getTime();
        const dateB = new Date(b.lastEdited).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return order === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      }
    });

    setFilteredProjects(filtered);
    setPage(1);
  };

  // Reload projects when dependencies change
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters(projects, searchTerm, statusFilter, sortBy, sortOrder);
  }, [projects, searchTerm, statusFilter, sortBy, sortOrder]);

  // Generate thumbnail from project styles
  const generateThumbnail = (project) => {
    if (project.thumbnail) return project.thumbnail;

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
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        return this;
      };
      ctx.roundRect = roundRect;

      // Background
      ctx.fillStyle = styles.backgroundColor || '#080C14';
      ctx.fillRect(0, 0, 600, 340);

      // Hero gradient band
      const grad = ctx.createLinearGradient(0, 0, 600, 180);
      grad.addColorStop(0, styles.primaryColor || '#4F6EF7');
      grad.addColorStop(1, styles.secondaryColor || '#2DBCB6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(20, 20, 560, 160, 12);
      ctx.fill();

      // Heading mock text bars
      ctx.fillStyle = styles.headingColor || '#FFFFFF';
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(120, 65, 360, 18, 4);
      ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.roundRect(170, 95, 260, 10, 3);
      ctx.fill();

      // Button mock
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(240, 122, 120, 32, 8);
      ctx.fill();

      // Card mocks
      const cardColors = [styles.primaryColor, styles.secondaryColor, styles.accentColor];
      [0, 1, 2].forEach((i) => {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = cardColors[i] || '#4F6EF7';
        ctx.beginPath();
        ctx.roundRect(20 + i * 194, 200, 174, 120, 10);
        ctx.fill();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = cardColors[i] || '#4F6EF7';
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 220, 80, 8, 3);
        ctx.fill();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = styles.textColor || '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 240, 130, 6, 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(40 + i * 194, 254, 100, 6, 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      return canvas.toDataURL('image/png');
    } catch (_) {
      return null;
    }
  };

  // Handle opening project in DesignStudio
  const handleOpenProject = (project) => {
    if (onOpenProject) {
      onOpenProject(project);
    } else {
      // Save to localStorage and navigate
      localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
      localStorage.setItem('latest_project_id', project.id);
      localStorage.setItem('latest_project_data', JSON.stringify(project));
      navigate(`/studio?project=${project.id}`);
    }
  };

  // Handle preview project
  const handlePreviewProject = (project) => {
    if (onPreviewProject) {
      onPreviewProject(project);
    } else {
      // Save to localStorage and navigate to preview
      localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
      localStorage.setItem('latest_project_id', project.id);
      localStorage.setItem('latest_project_data', JSON.stringify(project));
      navigate(`/preview?id=${project.id}&t=${Date.now()}`);
    }
  };

  // Handle publish project
  const handlePublishProject = (project) => {
    if (onPublishProject) {
      onPublishProject(project);
    } else {
      setSelectedProject(project);
      setPublishDialogOpen(true);
    }
  };

  // Handle delete project
  const handleDeleteProject = (projectId) => {
    if (onDeleteProject) {
      onDeleteProject(projectId);
    } else {
      localStorage.removeItem(`project_${projectId}`);
      localStorage.removeItem(`published_${projectId}`);
      loadProjects();
    }
  };

  // Handle duplicate project
  const handleDuplicateProject = (project) => {
    if (onDuplicateProject) {
      onDuplicateProject(project);
    } else {
      const newProject = {
        ...project,
        id: `${project.id}_copy_${Date.now()}`,
        name: `${project.name} (Copy)`,
        status: 'draft',
        lastEdited: new Date().toISOString(),
        publishSlug: undefined,
        publishedUrl: undefined,
      };
      localStorage.setItem(`project_${newProject.id}`, JSON.stringify(newProject));
      loadProjects();
    }
  };

  // Handle export project as JSON
  const handleExportProject = (project) => {
    setExporting(true);
    try {
      const exportData = {
        ...project,
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_backup.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } finally {
      setExporting(false);
    }
  };

  // Copy published link to clipboard
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get status chip color
  const getStatusChip = (status) => {
    if (status === 'published') {
      return {
        label: 'Published',
        icon: React.createElement(Publish, { sx: { fontSize: 12 } }),
        color: '#4CAF50',
        bg: alpha('#4CAF50', 0.15),
      };
    }
    return {
      label: 'Draft',
      icon: React.createElement(Drafts, { sx: { fontSize: 12 } }),
      color: '#FFA726',
      bg: alpha('#FFA726', 0.15),
    };
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Get stats for project
  const getProjectStats = (project) => {
    const componentCount = project.components?.length || 0;
    const textCount = project.textElements?.length || 0;
    const imageCount = project.uploadedImages?.length || 0;
    const pageCount = project.pages?.length || 1;
    return { componentCount, textCount, imageCount, pageCount };
  };

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {showHeader && (
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={300} height={40} />
            <Skeleton variant="text" width={200} height={24} />
          </Box>
        )}
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

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
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} saved
                  • {projects.filter((p) => p.status === 'published').length} published
                </Typography>
              </Box>

              <Box
                onClick={() => navigate('/dashboard')}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: 2,
                  '&:hover': { opacity: 0.7 },
                }}
              >
                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'white', }}>
                  ← Back to Dashboard
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
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
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
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
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
                    }}
                  >
                    <MenuItem value="date">Last Modified</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title={sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}>
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

        {/* Tabs for quick filtering */}
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
          <Tab label={`Published (${projects.filter((p) => p.status === 'published').length})`} />
          <Tab label={`Drafts (${projects.filter((p) => p.status === 'draft').length})`} />
        </Tabs>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
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
                No projects found
              </Typography>
              <Typography variant="body2" sx={{ color: alpha('#FFFFFF', 0.5), mb: 3 }}>
                {searchTerm
                  ? 'Try a different search term'
                  : 'Create your first project to get started'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<Brush />}
                  onClick={() => navigate('/design-studio')}
                  sx={{ background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)' }}
                >
                  Create New Project
                </Button>
              )}
            </Paper>
          </motion.div>
        ) : (
          <>
            <Grid container spacing={3}>
              <AnimatePresence>
                {paginatedProjects.map((project, index) => {
                  const stats = getProjectStats(project);
                  const statusChip = getStatusChip(project.status);
                  const thumbnail = generateThumbnail(project);
                  const publishedUrl =
                    project.publishedUrl ||
                    (project.publishSlug
                      ? `${window.location.origin}/p/${project.publishSlug}`
                      : null);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card
                          sx={{
                            bgcolor: alpha('#FFFFFF', 0.04),
                            borderRadius: 3,
                            border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: alpha('#4F6EF7', 0.3),
                              boxShadow: `0 8px 32px ${alpha('#4F6EF7', 0.15)}`,
                            },
                          }}
                        >
                          {/* Thumbnail */}
                          <Box sx={{ position: 'relative' }}>
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

                          <CardContent sx={{ pb: 1 }}>
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
                                  <Typography
                                    variant="caption"
                                    sx={{ color: alpha('#FFFFFF', 0.5) }}
                                  >
                                    {stats.componentCount}
                                  </Typography>
                                </Box>
                              </Tooltip>
                              <Tooltip title="Text Elements">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <TypographyIcon
                                    sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: alpha('#FFFFFF', 0.5) }}
                                  >
                                    {stats.textCount}
                                  </Typography>
                                </Box>
                              </Tooltip>
                              <Tooltip title="Images">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ImageIcon sx={{ fontSize: 12, color: alpha('#FFFFFF', 0.4) }} />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: alpha('#FFFFFF', 0.5) }}
                                  >
                                    {stats.imageCount}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </Box>

                            {/* Color palette preview */}
                            {project.styles && (
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
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
                                <Typography
                                  variant="caption"
                                  sx={{ color: alpha('#FFFFFF', 0.3), ml: 0.5 }}
                                >
                                  {project.styles?.fontFamily?.split(',')[0] || 'Default'}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>

                          <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                            <Tooltip title="Open in Editor">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenProject(project)}
                                sx={{
                                  color: '#4F6EF7',
                                  bgcolor: alpha('#4F6EF7', 0.1),
                                  borderRadius: 1.5,
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
                                }}
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {publishedUrl && (
                              <Tooltip title="Open Published Link">
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(publishedUrl, '_blank')}
                                  sx={{
                                    color: '#3ED67C',
                                    bgcolor: alpha('#3ED67C', 0.1),
                                    borderRadius: 1.5,
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
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
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

      {/* Menu Popover */}
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
            minWidth: 180,
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
              sx={{ color: 'white', gap: 1 }}
            >
              <Edit fontSize="small" /> Open in Editor
            </MenuItem>
            <MenuItem
              onClick={() => {
                handlePreviewProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1 }}
            >
              <Visibility fontSize="small" /> Preview
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleDuplicateProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1 }}
            >
              <ContentCopy fontSize="small" /> Duplicate
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleExportProject(menuProject);
                setMenuAnchorEl(null);
              }}
              sx={{ color: 'white', gap: 1 }}
              disabled={exporting}
            >
              <GetApp fontSize="small" /> Export JSON
            </MenuItem>
            <Divider sx={{ borderColor: alpha('#FFFFFF', 0.1) }} />
            <MenuItem
              onClick={() => {
                setSelectedProject(menuProject);
                setDeleteDialogOpen(true);
                setMenuAnchorEl(null);
              }}
              sx={{ color: '#ff4444', gap: 1 }}
            >
              <DeleteOutline fontSize="small" /> Delete
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
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

      {/* Publish Dialog */}
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
            size="small"
            sx={{
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: alpha('#FFFFFF', 0.6) },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha('#FFFFFF', 0.2) },
            }}
          />
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.5) }}>
            Your website will be available at: {window.location.origin}/p/[your-slug]
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setPublishDialogOpen(false)} sx={{ color: alpha('#FFFFFF', 0.6) }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Handle publish logic here
              setPublishDialogOpen(false);
            }}
            sx={{ background: 'linear-gradient(135deg, #4F6EF7, #2DBCB6)' }}
          >
            Publish Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
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
        <DialogTitle sx={{ color: 'white' }}>Share Project</DialogTitle>
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
                    sx={{ color: '#4F6EF7', wordBreak: 'break-all', fontSize: '0.75rem' }}
                  >
                    {selectedProject.publishedUrl}
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy Link'}>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(selectedProject.publishedUrl)}
                      sx={{ color: '#4F6EF7' }}
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
    </Box>
  );
};

export default ProjectsGallery;
