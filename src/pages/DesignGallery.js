import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CheckCircle,
  Merge,
  Search,
  ColorLens,
  Dashboard as LayoutIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const DesignGallery = ({ selectedDesigns, onDesignSelect, onMerge }) => {
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [previewDesign, setPreviewDesign] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const mockDesigns = [
      {
        id: 1,
        name: 'Modern Business',
        category: 'business',
        styles: { primary_color: G_START, secondary_color: G_MID },
        layout: { structure: 'Grid' },
        description: 'Perfect for corporate sites',
      },
      {
        id: 2,
        name: 'Creative Portfolio',
        category: 'portfolio',
        styles: { primary_color: '#8B5CF6', secondary_color: '#EC4899' },
        layout: { structure: 'Masonry' },
        description: 'Showcase your work beautifully',
      },
      {
        id: 3,
        name: 'Elegant Ecomm',
        category: 'ecommerce',
        styles: { primary_color: '#F59E0B', secondary_color: '#EF4444' },
        layout: { structure: 'Product Showcase' },
        description: 'Sell products with style',
      },
    ];
    setDesigns(mockDesigns);
    setFilteredDesigns(mockDesigns);
  }, []);

  useEffect(() => {
    let filtered = designs;
    if (searchTerm)
      filtered = filtered.filter((design) =>
        design.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (category !== 'all') filtered = filtered.filter((design) => design.category === category);
    setFilteredDesigns(filtered);
  }, [searchTerm, category, designs]);

  const categories = [
    'all',
    'business',
    'ecommerce',
    'portfolio',
    'blog',
    'landing',
    'corporate',
    'startup',
    'restaurant',
    'education',
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#080C14', minHeight: '100vh' }}>
      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search designs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} /> }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            },
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedDesigns.length > 0 && (
          <Button
            variant="contained"
            startIcon={<Merge />}
            onClick={onMerge}
            sx={{ background: GRAD, borderRadius: '999px', textTransform: 'none' }}
          >
            Merge {selectedDesigns.length} Design{selectedDesigns.length > 1 ? 's' : ''}
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredDesigns.map((design) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={design.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    '&:hover': { borderColor: G_START },
                  }}
                >
                  {selectedDesigns.includes(design.id) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        bgcolor: G_END,
                        borderRadius: '50%',
                        p: 0.5,
                      }}
                    >
                      <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  )}
                  <Box
                    sx={{
                      height: 200,
                      background: `linear-gradient(135deg, ${design.styles.primary_color}, ${design.styles.secondary_color})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '16px 16px 0 0',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                      {design.name}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                      {design.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                      {design.category}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<LayoutIcon />}
                        label={design.layout?.structure || 'Flexible'}
                        size="small"
                        sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                      <Chip
                        icon={<ColorLens />}
                        label={design.styles?.primary_color}
                        size="small"
                        sx={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                      />
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => setPreviewDesign(design)}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        borderRadius: '999px',
                        textTransform: 'none',
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant={selectedDesigns.includes(design.id) ? 'contained' : 'outlined'}
                      size="small"
                      fullWidth
                      onClick={() => onDesignSelect(design.id)}
                      sx={
                        selectedDesigns.includes(design.id)
                          ? { background: GRAD, borderRadius: '999px', textTransform: 'none' }
                          : {
                              borderColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              borderRadius: '999px',
                              textTransform: 'none',
                            }
                      }
                    >
                      {selectedDesigns.includes(design.id) ? 'Selected' : 'Select'}
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog
        open={!!previewDesign}
        onClose={() => setPreviewDesign(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>{previewDesign?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                height: 400,
                background: `linear-gradient(135deg, ${previewDesign?.styles?.primary_color}, ${previewDesign?.styles?.secondary_color})`,
                borderRadius: 2,
                p: 3,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: 'white' }}>
                Preview
              </Typography>
            </Box>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'white' }}>
              Layout Structure: {previewDesign?.layout?.structure}
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Font Family: {previewDesign?.styles?.font_family || 'Inter'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDesign(null)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onDesignSelect(previewDesign.id);
              setPreviewDesign(null);
            }}
            sx={{ background: GRAD, borderRadius: '999px', textTransform: 'none' }}
          >
            Select Design
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DesignGallery;
