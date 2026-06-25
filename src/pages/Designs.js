// Designs.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  DesignServices,
  Storefront,
  Business,
  Restaurant,
  School,
  Code,
  Palette,
  Speed,
  Security,
  Visibility,
  Favorite,
  FavoriteBorder,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const templates = [
  {
    id: 1,
    name: 'Modern Minimalist',
    category: 'business',
    description: 'Clean and professional design perfect for corporate websites',
    image: 'https://placehold.co/600x400/A59B8C/FFFFFF?text=Modern+Minimalist',
    rating: 4.8,
    reviews: 234,
    features: ['Responsive', 'SEO Optimized', 'Fast Loading'],
    popular: true,
    icon: <Business />,
    color: '#A59B8C',
    colors: {
      primaryColor: '#A59B8C',
      secondaryColor: '#6B5E4A',
      accentColor: '#C4B5A0',
      backgroundColor: '#FAF9F7',
      textColor: '#2C2C2C',
      headingColor: '#1A1A1A',
    },
  },
  {
    id: 2,
    name: 'Creative Agency',
    category: 'portfolio',
    description: 'Bold and artistic layout for creative professionals',
    image: 'https://placehold.co/600x400/2C6E6B/FFFFFF?text=Creative+Agency',
    rating: 4.9,
    reviews: 567,
    features: ['Animations', 'Portfolio Grid', 'Contact Form'],
    popular: true,
    icon: <DesignServices />,
    color: '#2C6E6B',
    colors: {
      primaryColor: '#2C6E6B',
      secondaryColor: '#FF6B6B',
      accentColor: '#4ECDC4',
      backgroundColor: '#FFFFFF',
      textColor: '#2C3E50',
      headingColor: '#1A2A3A',
    },
  },
  {
    id: 3,
    name: 'Shop Modern',
    category: 'ecommerce',
    description: 'Feature-rich e-commerce template with product showcase',
    image: 'https://placehold.co/600x400/1F2A2E/FFFFFF?text=Shop+Modern',
    rating: 4.7,
    reviews: 892,
    features: ['Product Gallery', 'Cart Integration', 'Payment Ready'],
    popular: true,
    icon: <Storefront />,
    color: '#1F2A2E',
    colors: {
      primaryColor: '#1F2A2E',
      secondaryColor: '#E67E22',
      accentColor: '#F39C12',
      backgroundColor: '#FFFFFF',
      textColor: '#2C3E50',
      headingColor: '#1F2A2E',
    },
  },
  {
    id: 4,
    name: 'EduSmart',
    category: 'education',
    description: 'Engaging design for online courses and educational platforms',
    image: 'https://placehold.co/600x400/4A5D73/FFFFFF?text=EduSmart',
    rating: 4.6,
    reviews: 156,
    features: ['Course Layout', 'Video Support', 'Student Dashboard'],
    popular: false,
    icon: <School />,
    color: '#4A5D73',
    colors: {
      primaryColor: '#4A5D73',
      secondaryColor: '#7F8C8D',
      accentColor: '#3498DB',
      backgroundColor: '#F8F9FA',
      textColor: '#2C3E50',
      headingColor: '#2C3E50',
    },
  },
  {
    id: 5,
    name: 'Foodie Delight',
    category: 'restaurant',
    description: 'Appetizing design for restaurants and cafes',
    image: 'https://placehold.co/600x400/7B3E19/FFFFFF?text=Foodie+Delight',
    rating: 4.8,
    reviews: 423,
    features: ['Menu Display', 'Reservation System', 'Gallery'],
    popular: true,
    icon: <Restaurant />,
    color: '#7B3E19',
    colors: {
      primaryColor: '#7B3E19',
      secondaryColor: '#E67E22',
      accentColor: '#F1C40F',
      backgroundColor: '#FFF9F5',
      textColor: '#4A2C1A',
      headingColor: '#7B3E19',
    },
  },
  {
    id: 6,
    name: 'Tech Startup',
    category: 'business',
    description: 'Modern template for tech companies and startups',
    image: 'https://placehold.co/600x400/283655/FFFFFF?text=Tech+Startup',
    rating: 4.9,
    reviews: 678,
    features: ['Hero Section', 'Feature Grid', 'Team Showcase'],
    popular: false,
    icon: <Code />,
    color: '#283655',
    colors: {
      primaryColor: '#283655',
      secondaryColor: '#4D648D',
      accentColor: '#1E81B0',
      backgroundColor: '#0A0F1A',
      textColor: '#E0E0E0',
      headingColor: '#FFFFFF',
    },
  },
];

const categories = [
  { value: 'all', label: 'All Templates', icon: <DesignServices /> },
  { value: 'business', label: 'Business', icon: <Business /> },
  { value: 'portfolio', label: 'Portfolio', icon: <DesignServices /> },
  { value: 'ecommerce', label: 'E-Commerce', icon: <Storefront /> },
  { value: 'education', label: 'Education', icon: <School /> },
  { value: 'restaurant', label: 'Restaurant', icon: <Restaurant /> },
];

const Designs = ({ setCurrentProject = () => {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('templateFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('templateFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      return newFavorites;
    });
    setSnackbarMessage(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };

  const handleUseTemplate = (template) => {
    setLoading(true);
    try {
      // Save the template colors to localStorage
      localStorage.setItem('selectedDesignColors', JSON.stringify(template.colors));

      const newProject = {
        id: Date.now(),
        name: template.name,
        type: template.category,
        lastEdited: new Date().toISOString().split('T')[0],
        status: 'draft',
        credits: 100,
        design: template.name,
        templateId: template.id,
        colors: template.colors,
      };

      if (setCurrentProject && typeof setCurrentProject === 'function') {
        setCurrentProject(newProject);
        setSnackbarMessage(`"${template.name}" template loaded successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Small delay to show success message before navigation
        setTimeout(() => {
          navigate('/studio');
        }, 500);
      } else {
        console.error('setCurrentProject is not a function');
        setSnackbarMessage('Error: Unable to create project. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setSnackbarMessage('Error creating project. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const displayedTemplates = filteredTemplates.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ bgcolor: '#080C14', minHeight: '100vh', pt: 2 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
            Browse Designs
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Choose from our collection of professionally designed templates. Each template comes
            with a complete color scheme that will be automatically applied.
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: G_START,
                  },
                },
              }}
              sx={{ '& input': { color: 'white' } }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <Chip
                  key={cat.value}
                  icon={cat.icon}
                  label={cat.label}
                  onClick={() => setSelectedCategory(cat.value)}
                  sx={{
                    bgcolor:
                      selectedCategory === cat.value
                        ? alpha(G_START, 0.2)
                        : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.1)'}`,
                    color: selectedCategory === cat.value ? G_START : 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      bgcolor: alpha(G_START, 0.1),
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <AnimatePresence>
            {displayedTemplates.map((template, index) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      background: `linear-gradient(135deg, ${template.colors.primaryColor}20, ${template.colors.secondaryColor}20)`,
                      border: `1px solid ${alpha(G_START, 0.2)}`,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 24px ${alpha(template.colors.primaryColor, 0.3)}`,
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={template.image}
                        alt={template.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                        }}
                      />
                      {template.popular && (
                        <Chip
                          label="Popular"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: G_START,
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                      <IconButton
                        onClick={() => handleFavorite(template.id)}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                      >
                        {favorites.includes(template.id) ? (
                          <Favorite sx={{ color: '#ff4d4d' }} />
                        ) : (
                          <FavoriteBorder sx={{ color: 'white' }} />
                        )}
                      </IconButton>
                    </Box>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(template.colors.primaryColor, 0.2),
                            width: 32,
                            height: 32,
                          }}
                        >
                          {template.icon}
                        </Avatar>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
                          {template.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                        {template.description}
                      </Typography>

                      {/* Color Palette Preview */}
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                        {Object.values(template.colors)
                          .slice(0, 5)
                          .map((color, idx) => (
                            <Tooltip key={idx} title={`Color ${idx + 1}`}>
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  bgcolor: color,
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                }}
                              />
                            </Tooltip>
                          ))}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating value={template.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          ({template.reviews})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {template.features.slice(0, 3).map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.05)',
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handlePreview(template)}
                        sx={{
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          '&:hover': { borderColor: G_START },
                        }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={loading ? <CircularProgress size={16} /> : <ArrowForward />}
                        onClick={() => handleUseTemplate(template)}
                        disabled={loading}
                        sx={{
                          background: `linear-gradient(135deg, ${template.colors.primaryColor}, ${template.colors.secondaryColor})`,
                          flex: 1,
                          '&:hover': { opacity: 0.9 },
                        }}
                      >
                        Use Template
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'rgba(255,255,255,0.7)',
                  '&.Mui-selected': {
                    background: GRAD,
                    color: 'white',
                  },
                },
              }}
            />
          </Box>
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: '#0A0F1A',
              borderRadius: '16px',
              border: `1px solid ${alpha(G_START, 0.3)}`,
            },
          }}
        >
          {selectedTemplate && (
            <>
              <DialogTitle sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {selectedTemplate.name}
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Box
                  component="img"
                  src={selectedTemplate.image}
                  alt={selectedTemplate.name}
                  sx={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    mb: 2,
                  }}
                />
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
                  {selectedTemplate.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: G_START, mb: 1 }}>
                  Color Scheme:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {Object.entries(selectedTemplate.colors).map(([key, color]) => (
                    <Tooltip key={key} title={key}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: color,
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: '#fff', textShadow: '0 0 2px black' }}
                        >
                          {key.charAt(0)}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ color: G_START, mb: 1 }}>
                  Features:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {selectedTemplate.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating value={selectedTemplate.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {selectedTemplate.reviews} reviews
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Button
                  onClick={() => setDialogOpen(false)}
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  disabled={loading}
                  sx={{
                    background: `linear-gradient(135deg, ${selectedTemplate.colors.primaryColor}, ${selectedTemplate.colors.secondaryColor})`,
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Use This Template'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{
              width: '100%',
              bgcolor: '#1A1F2E',
              color: 'white',
              '& .MuiAlert-icon': { color: snackbarSeverity === 'success' ? G_END : G_START },
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Designs;
