// Tutorials.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  alpha,
  useTheme,
  Dialog,
  DialogContent,
  IconButton,
  Rating,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {
  Search,
  PlayCircle,
  Code,
  DesignServices,
  Speed,
  Security,
  Payment,
  Analytics,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  School,
  VideoLibrary,
  Article,
  Quiz,
  Timer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with Website Builder',
    description: 'Learn the basics of creating your first website with our AI-powered builder',
    category: 'beginner',
    duration: '10 min',
    level: 'Beginner',
    rating: 4.8,
    views: 12340,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=Getting+Started',
    videoUrl: '#',
    sections: [
      { title: 'Introduction', duration: '1:30' },
      { title: 'Creating Your First Project', duration: '2:15' },
      { title: 'Choosing a Template', duration: '2:45' },
      { title: 'Editing Your Site', duration: '3:30' },
    ],
    icon: <PlayCircle />,
  },
  {
    id: 2,
    title: 'Mastering AI Design Tools',
    description: 'Use AI to generate stunning designs, layouts, and color schemes',
    category: 'design',
    duration: '15 min',
    level: 'Intermediate',
    rating: 4.9,
    views: 8920,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=AI+Design',
    videoUrl: '#',
    sections: [
      { title: 'AI Design Overview', duration: '2:00' },
      { title: 'Color Palette Generation', duration: '3:20' },
      { title: 'Layout Suggestions', duration: '4:10' },
      { title: 'Image Generation Tips', duration: '5:30' },
    ],
    icon: <DesignServices />,
  },
  {
    id: 3,
    title: 'Custom Code & Advanced Features',
    description: 'Add custom CSS, JavaScript, and integrate third-party services',
    category: 'advanced',
    duration: '20 min',
    level: 'Advanced',
    rating: 4.7,
    views: 5670,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=Custom+Code',
    videoUrl: '#',
    sections: [
      { title: 'Code Editor Overview', duration: '3:00' },
      { title: 'Adding Custom CSS', duration: '4:30' },
      { title: 'JavaScript Interactions', duration: '5:45' },
      { title: 'API Integration', duration: '6:45' },
    ],
    icon: <Code />,
  },
  {
    id: 4,
    title: 'SEO Optimization Guide',
    description: 'Optimize your website for search engines and improve visibility',
    category: 'seo',
    duration: '12 min',
    level: 'Intermediate',
    rating: 4.9,
    views: 15600,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=SEO+Guide',
    videoUrl: '#',
    sections: [
      { title: 'SEO Basics', duration: '2:30' },
      { title: 'Meta Tags & Descriptions', duration: '3:15' },
      { title: 'Keyword Strategy', duration: '3:45' },
      { title: 'Performance & Speed', duration: '2:30' },
    ],
    icon: <Analytics />,
  },
  {
    id: 5,
    title: 'E-commerce Setup',
    description: 'Create a fully functional online store with payment integration',
    category: 'ecommerce',
    duration: '18 min',
    level: 'Intermediate',
    rating: 4.8,
    views: 7450,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=E-commerce',
    videoUrl: '#',
    sections: [
      { title: 'Product Management', duration: '4:00' },
      { title: 'Shopping Cart Setup', duration: '3:30' },
      { title: 'Payment Gateway', duration: '5:00' },
      { title: 'Order Management', duration: '5:30' },
    ],
    icon: <Payment />,
  },
  {
    id: 6,
    title: 'Performance Optimization',
    description: 'Speed up your website and improve Core Web Vitals',
    category: 'performance',
    duration: '14 min',
    level: 'Advanced',
    rating: 4.8,
    views: 4320,
    thumbnail: 'https://placehold.co/600x340/2A2A2A/FFFFFF?text=Performance',
    videoUrl: '#',
    sections: [
      { title: 'Understanding Core Web Vitals', duration: '3:00' },
      { title: 'Image Optimization', duration: '3:30' },
      { title: 'Caching Strategies', duration: '4:00' },
      { title: 'Lazy Loading', duration: '3:30' },
    ],
    icon: <Speed />,
  },
];

const categories = [
  { value: 'all', label: 'All', icon: <VideoLibrary /> },
  { value: 'beginner', label: 'Beginner', icon: <School /> },
  { value: 'design', label: 'Design', icon: <DesignServices /> },
  { value: 'advanced', label: 'Advanced', icon: <Code /> },
  { value: 'seo', label: 'SEO', icon: <Analytics /> },
  { value: 'ecommerce', label: 'E-commerce', icon: <Payment /> },
  { value: 'performance', label: 'Performance', icon: <Speed /> },
];

const Tutorials = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  const handleOpenTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
    setExpandedSection(null);
    setDialogOpen(true);
  };

  const handleCompleteLesson = (lessonTitle) => {
    setCompletedLessons((prev) => (prev.includes(lessonTitle) ? prev : [...prev, lessonTitle]));
  };

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgress = (tutorial) => {
    if (!selectedTutorial) return 0;
    const total = selectedTutorial.sections.length;
    const completed = selectedTutorial.sections.filter((s) =>
      completedLessons.includes(s.title)
    ).length;
    return (completed / total) * 100;
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
            Tutorials & Learning
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Master website building with our comprehensive video tutorials
          </Typography>
        </motion.div>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search tutorials..."
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
          {filteredTutorials.map((tutorial, index) => (
            <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: alpha(G_START, 0.3),
                    },
                  }}
                  onClick={() => handleOpenTutorial(tutorial)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={tutorial.thumbnail}
                      alt={tutorial.title}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'rgba(0,0,0,0.7)',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayCircle sx={{ fontSize: 40, color: G_START }} />
                    </Box>
                    <Chip
                      label={tutorial.duration}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(G_START, 0.1), width: 28, height: 28 }}>
                        {tutorial.icon}
                      </Avatar>
                      <Chip
                        label={tutorial.level}
                        size="small"
                        sx={{
                          bgcolor: alpha(G_START, 0.2),
                          color: G_START,
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                      {tutorial.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                      {tutorial.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating value={tutorial.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {tutorial.views.toLocaleString()} views
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

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
              maxHeight: '90vh',
            },
          }}
        >
          {selectedTutorial && (
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    height: 240,
                    bgcolor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(135deg, ${alpha(G_START, 0.2)} 0%, #000 100%)`,
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                      width: 80,
                      height: 80,
                    }}
                  >
                    <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                  </IconButton>
                </Box>
                <IconButton
                  onClick={() => setDialogOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                  }}
                >
                  ✕
                </IconButton>
              </Box>

              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                  {selectedTutorial.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={selectedTutorial.level}
                    size="small"
                    sx={{ bgcolor: alpha(G_START, 0.2), color: G_START }}
                  />
                  <Chip
                    icon={<Timer />}
                    label={selectedTutorial.duration}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                  />
                  <Rating value={selectedTutorial.rating} precision={0.1} size="small" readOnly />
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                  {selectedTutorial.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>
                      Course Progress
                    </Typography>
                    <Typography variant="caption" sx={{ color: G_START }}>
                      {Math.round(getProgress())}% Complete
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': { background: GRAD },
                    }}
                  />
                </Box>

                <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                  Course Content
                </Typography>
                <List sx={{ bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  {selectedTutorial.sections.map((section, idx) => (
                    <React.Fragment key={section.title}>
                      <ListItem
                        button
                        onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                        sx={{
                          borderBottom:
                            idx < selectedTutorial.sections.length - 1
                              ? '1px solid rgba(255,255,255,0.05)'
                              : 'none',
                        }}
                      >
                        <ListItemIcon>
                          {completedLessons.includes(section.title) ? (
                            <CheckCircle sx={{ color: G_END }} />
                          ) : (
                            <PlayCircle sx={{ color: 'rgba(255,255,255,0.5)' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={section.title}
                          primaryTypographyProps={{ sx: { color: 'white' } }}
                          secondary={section.duration}
                          secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.5)' } }}
                        />
                        {expandedSection === idx ? (
                          <ExpandLess sx={{ color: 'white' }} />
                        ) : (
                          <ExpandMore sx={{ color: 'white' }} />
                        )}
                      </ListItem>
                      <Collapse in={expandedSection === idx} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, pl: 7, bgcolor: 'rgba(0,0,0,0.2)' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<PlayCircle />}
                            onClick={() => handleCompleteLesson(section.title)}
                            sx={{
                              borderColor: G_START,
                              color: G_START,
                              '&:hover': { bgcolor: alpha(G_START, 0.1) },
                            }}
                          >
                            {completedLessons.includes(section.title)
                              ? 'Watched'
                              : 'Mark as Watched'}
                          </Button>
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </DialogContent>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Tutorials;
