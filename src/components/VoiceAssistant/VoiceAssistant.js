// src/components/VoiceAssistant/VoiceAssistant.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Close,
  Lightbulb,
  Settings,
  ColorLens,
  DesignServices,
  Merge,
  Publish,
  Cloud,
  Psychology,
  Add,
  History,
  AutoAwesome,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import voiceService from '../../services/voiceAssistant';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const VoiceAssistant = ({ onCommand, currentContext = 'home', studioState, onStudioTransform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [voiceEngine, setVoiceEngine] = useState('web');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // Enhanced suggestions with AI-powered transformations
  const suggestionsList = {
    home: [
      {
        text: 'Create a modern business website',
        icon: <DesignServices />,
        action: { type: 'createTemplate', template: 'business' },
        description: 'Generate a complete business website',
      },
      {
        text: 'Design a creative portfolio',
        icon: <DesignServices />,
        action: { type: 'createTemplate', template: 'portfolio' },
        description: 'Showcase your work beautifully',
      },
      {
        text: 'Build an e-commerce store',
        icon: <DesignServices />,
        action: { type: 'createTemplate', template: 'ecommerce' },
        description: 'Start selling online',
      },
      {
        text: 'Make it colorful',
        icon: <ColorLens />,
        action: { type: 'changeTheme', theme: 'vibrant' },
        description: 'Add vibrant colors',
      },
    ],
    studio: [
      {
        text: 'Add a hero section',
        icon: <DesignServices />,
        action: { type: 'addComponent', component: 'hero' },
        description: 'Add hero section',
      },
      {
        text: 'Create a features section',
        icon: <DesignServices />,
        action: { type: 'addComponent', component: 'features' },
        description: 'Showcase your features',
      },
      {
        text: 'Add a contact form',
        icon: <DesignServices />,
        action: { type: 'addComponent', component: 'contact' },
        description: 'Interactive contact section',
      },
      {
        text: 'Create pricing tables',
        icon: <DesignServices />,
        action: { type: 'addComponent', component: 'pricing' },
        description: 'Show your pricing plans',
      },
      {
        text: 'Add an image gallery',
        icon: <DesignServices />,
        action: { type: 'addComponent', component: 'gallery' },
        description: 'Beautiful image gallery',
      },
      {
        text: 'Make it dark mode',
        icon: <ColorLens />,
        action: { type: 'changeTheme', theme: 'dark' },
        description: 'Switch to dark theme',
      },
      {
        text: 'Add animations',
        icon: <AutoAwesome />,
        action: { type: 'enableAnimations', value: true },
        description: 'Animate everything',
      },
      {
        text: 'Merge designs',
        icon: <Merge />,
        action: { type: 'mergeDesigns' },
        description: 'Combine designs',
      },
    ],
    gallery: [
      {
        text: 'Show modern designs',
        icon: <DesignServices />,
        action: { type: 'filterDesigns', category: 'modern' },
        description: 'Modern templates',
      },
      {
        text: 'Show minimalist designs',
        icon: <DesignServices />,
        action: { type: 'filterDesigns', category: 'minimalist' },
        description: 'Clean and simple',
      },
    ],
    integrations: [
      {
        text: 'Add Stripe payments',
        icon: <Settings />,
        action: { type: 'addIntegration', provider: 'Stripe' },
        description: 'Accept payments',
      },
      {
        text: 'Add Mailchimp newsletter',
        icon: <Settings />,
        action: { type: 'addIntegration', provider: 'Mailchimp' },
        description: 'Email marketing',
      },
    ],
  };

  const quickActions = [
    { icon: <Mic />, name: 'Voice Command', action: () => startListening() },
    { icon: <AutoAwesome />, name: 'AI Generate', action: () => startAIGeneration() },
    {
      icon: <ColorLens />,
      name: 'Change Theme',
      action: () => processVoiceCommand('change theme to modern'),
    },
    {
      icon: <DesignServices />,
      name: 'Add Section',
      action: () => processVoiceCommand('add hero section'),
    },
    { icon: <Merge />, name: 'Merge Designs', action: () => processVoiceCommand('merge designs') },
    { icon: <History />, name: 'Undo', action: () => processVoiceCommand('undo') },
  ];

  useEffect(() => {
    // Check if voiceService exists before setting callbacks
    if (voiceService && voiceService.setCallbacks) {
      voiceService.setCallbacks({
        onResult: (text, isFinal) => {
          if (isFinal) {
            setTranscript(text);
            processVoiceCommand(text);
            setIsListening(false);
            setIsProcessing(false);
          } else {
            setInterimTranscript(text);
          }
        },
        onError: (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
          setIsProcessing(false);
          showNotification(`Error: ${error}`, 'error');
          addResponse('assistant', `Sorry, I encountered an error: ${error}. Please try again.`);
        },
        onEnd: () => {
          setIsListening(false);
          setIsProcessing(false);
        },
      });
    } else {
      console.warn('Voice service not available');
    }

    updateSuggestions();
    generateAISuggestions();

    return () => {
      if (voiceService && voiceService.isListening) {
        voiceService.stopListening();
      }
    };
  }, [currentContext, studioState]);

  const generateAISuggestions = () => {
    // AI-powered suggestions based on current studio state
    const suggestions = [];

    if (studioState?.components?.length < 2) {
      suggestions.push({
        text: 'Add more sections to your page',
        icon: <Add />,
        action: { type: 'addComponent', component: 'features' },
        description: 'Enhance your page',
      });
    }

    if (studioState?.globalStyles?.primaryColor === '#4F6EF7') {
      suggestions.push({
        text: 'Try a different color scheme',
        icon: <ColorLens />,
        action: { type: 'changeColor', value: 'purple' },
        description: 'Change to purple theme',
      });
    }

    setAiSuggestions(suggestions.slice(0, 3));
  };

  const startAIGeneration = () => {
    addResponse(
      'assistant',
      '🤖 AI Generation mode activated. Tell me what kind of website you want to create!'
    );
    startListening();
  };

  const updateSuggestions = () => {
    const contextSuggestions = suggestionsList[currentContext] || suggestionsList.home;
    setSuggestions(contextSuggestions);
  };

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const addResponse = (type, content) => {
    setResponses((prev) => [
      ...prev,
      {
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const processVoiceCommand = async (command) => {
    const lower = command.toLowerCase();
    let reply = '';
    let actionToTrigger = null;
    let transformData = null;

    addResponse('user', command);

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Process commands
    if (lower.includes('create') && (lower.includes('website') || lower.includes('page'))) {
      const type = lower.includes('business')
        ? 'business'
        : lower.includes('portfolio')
          ? 'portfolio'
          : lower.includes('ecommerce') || lower.includes('shop')
            ? 'ecommerce'
            : 'modern';

      reply = `✨ Creating a beautiful ${type} website for you!`;
      actionToTrigger = { type: 'createTemplate', template: type };
      transformData = { fullTransform: true, template: type };
      showNotification(reply, 'success');
    } else if (
      lower.includes('add') &&
      (lower.includes('section') || lower.includes('component'))
    ) {
      const sectionType = lower.includes('hero')
        ? 'hero'
        : lower.includes('feature')
          ? 'features'
          : lower.includes('gallery')
            ? 'gallery'
            : lower.includes('contact')
              ? 'contact'
              : lower.includes('pricing')
                ? 'pricing'
                : 'hero';

      reply = `✨ Adding ${sectionType} section to your design.`;
      actionToTrigger = { type: 'addComponent', component: sectionType };
      transformData = { addComponent: sectionType };
      showNotification(reply, 'success');
    } else if (lower.includes('change') && (lower.includes('color') || lower.includes('theme'))) {
      const theme = lower.includes('dark')
        ? 'dark'
        : lower.includes('light')
          ? 'light'
          : lower.includes('blue')
            ? 'blue'
            : lower.includes('purple')
              ? 'purple'
              : 'modern';

      reply = `🎨 Applying ${theme} theme to your design.`;
      actionToTrigger = { type: 'changeTheme', theme: theme };
      transformData = { themeChange: theme };
      showNotification(reply, 'success');
    } else if (lower.includes('make') && lower.includes('responsive')) {
      reply = '📱 Making your design responsive for all devices.';
      actionToTrigger = { type: 'makeResponsive' };
      transformData = { responsive: true };
      showNotification(reply, 'success');
    } else if (lower.includes('add') && lower.includes('animation')) {
      reply = '✨ Adding animations to all sections.';
      actionToTrigger = { type: 'enableAnimations', value: true };
      transformData = { animations: true };
      showNotification(reply, 'success');
    } else if (lower.includes('improve') || lower.includes('enhance')) {
      reply = '🚀 Enhancing your design with modern best practices.';
      actionToTrigger = { type: 'enhanceDesign' };
      transformData = { enhance: true };
      showNotification(reply, 'success');
    } else if (lower.includes('undo')) {
      reply = '↩️ Undoing last action.';
      actionToTrigger = { type: 'undo' };
      showNotification(reply, 'info');
    } else if (lower.includes('preview')) {
      reply = '👁️ Opening preview mode.';
      actionToTrigger = { type: 'preview' };
      showNotification(reply, 'info');
    } else if (lower.includes('publish')) {
      reply = '🚀 Preparing to publish your website.';
      actionToTrigger = { type: 'publish' };
      showNotification(reply, 'info');
    } else if (lower.includes('help')) {
      reply = `🤖 I can help you transform your design! Try these commands:
• "Create a business website"
• "Add hero section"
• "Change theme to dark"
• "Make it responsive"
• "Add animations"
• "Improve design"
• "Undo last action"
• "Preview" or "Publish"`;
      showNotification('Check conversation for available commands', 'info');
    } else if (lower.includes('hello') || lower.includes('hi')) {
      reply = `👋 Hello! I'm your AI design assistant. I can help you create amazing websites. Try saying "Create a business website" or "Add hero section" to get started!`;
      showNotification(reply, 'info');
    } else {
      reply = `🤖 I heard: "${command}". I can help you create and transform designs. Try saying "Create a business website", "Add hero section", or "Change theme to dark".`;
      showNotification(reply, 'warning');
    }

    setTimeout(() => {
      addResponse('assistant', reply);
    }, 300);

    setIsProcessing(false);

    // Trigger action
    if (actionToTrigger && onCommand) {
      onCommand(actionToTrigger);
    }

    // Apply transformation to studio
    if (transformData && onStudioTransform) {
      onStudioTransform(transformData);
    }
  };

  const startListening = () => {
    try {
      if (!voiceService) {
        showNotification('Voice service not available', 'error');
        return;
      }

      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
      voiceService.startListening(voiceEngine === 'azure');
      showNotification('🎤 Listening... Speak your command', 'info');
    } catch (error) {
      console.error('Failed to start listening:', error);
      showNotification(error.message, 'error');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (voiceService) {
      voiceService.stopListening();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    processVoiceCommand(suggestion.text);
    if (suggestion.action && onCommand) {
      onCommand(suggestion.action);
    }
  };

  const clearConversation = () => {
    setResponses([]);
    showNotification('Conversation cleared', 'info');
  };

  const handleEngineChange = (event, newEngine) => {
    if (newEngine) {
      setVoiceEngine(newEngine);
      showNotification(`Switched to ${newEngine.toUpperCase()} voice engine`, 'info');
    }
  };

  return (
    <>
      {/* Speed Dial for Quick Actions */}
      <SpeedDial
        ariaLabel="Voice Assistant Speed Dial"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
        icon={<SpeedDialIcon icon={<Mic />} openIcon={<Close />} />}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
        open={speedDialOpen}
        FabProps={{
          sx: {
            background: GRAD,
            '&:hover': { background: GRAD, opacity: 0.9 },
          },
        }}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              setSpeedDialOpen(false);
            }}
            tooltipOpen
          />
        ))}
      </SpeedDial>

      {/* Main Voice Assistant Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            color: 'white',
            height: '85vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology sx={{ color: G_START }} />
            <Typography fontWeight={700}>AI Voice Assistant</Typography>
            {isListening && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: G_END,
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite',
                  }}
                />
                <Typography variant="caption" sx={{ color: G_END }}>
                  Listening
                </Typography>
              </Box>
            )}
            {isProcessing && (
              <Box sx={{ ml: 1 }}>
                <LinearProgress sx={{ width: 100, height: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>
            )}
          </Box>
          <Box>
            <IconButton
              onClick={clearConversation}
              sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}
              size="small"
            >
              <Close />
            </IconButton>
            <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', py: 2 }}
        >
          {/* Voice Engine Selector */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={voiceEngine}
              exclusive
              onChange={handleEngineChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  '&.Mui-selected': {
                    background: GRAD,
                    color: 'white',
                  },
                },
              }}
            >
              <ToggleButton value="web">
                <Mic sx={{ fontSize: 16, mr: 0.5 }} /> Web
              </ToggleButton>
              <ToggleButton value="azure">
                <Cloud sx={{ fontSize: 16, mr: 0.5 }} /> Azure
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AutoAwesome sx={{ fontSize: 16, color: G_END }} />
                AI Smart Suggestions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {aiSuggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    icon={suggestion.icon}
                    label={suggestion.text}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      bgcolor: 'rgba(79,110,247,0.1)',
                      borderColor: G_START,
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(79,110,247,0.2)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Listening Button */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Fab
              onClick={toggleListening}
              sx={{
                width: 80,
                height: 80,
                background: isListening ? G_END : GRAD,
                '&:hover': { background: isListening ? G_END : GRAD, opacity: 0.9 },
                animation: isListening ? 'pulse-ring 1.5s infinite' : 'none',
              }}
            >
              {isListening ? <MicOff sx={{ fontSize: 40 }} /> : <Mic sx={{ fontSize: 40 }} />}
            </Fab>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>
              {isListening ? 'Listening... Speak now' : 'Click to start speaking'}
            </Typography>
          </Box>

          {/* Current Transcript */}
          {(transcript || interimTranscript) && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  background: `rgba(79,110,247,0.1)`,
                  borderRadius: '12px',
                  border: `1px solid ${G_START}33`,
                }}
              >
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  You said:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                  "{transcript || interimTranscript}
                  {!transcript && interimTranscript && '...'}"
                </Typography>
              </Paper>
            </motion.div>
          )}

          {/* Conversation History */}
          {responses.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.6)' }}>
                Conversation
              </Typography>
              <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
                <AnimatePresence>
                  {responses.map((response, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: response.type === 'user' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: response.type === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          maxWidth: '80%',
                          background: response.type === 'user' ? GRAD : 'rgba(255,255,255,0.05)',
                          borderRadius:
                            response.type === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {response.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.6, display: 'block', mt: 0.5 }}
                        >
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Lightbulb sx={{ fontSize: 16, color: G_END }} />
                Suggested Commands
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="small"
                    variant="outlined"
                    startIcon={suggestion.icon}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '999px',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&:hover': { borderColor: G_START, background: `rgba(79,110,247,0.1)` },
                    }}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Button
            onClick={() => setIsOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.5)', borderRadius: '999px' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Mic />}
            onClick={toggleListening}
            disabled={isListening}
            sx={{
              background: GRAD,
              borderRadius: '999px',
              textTransform: 'none',
              '&:hover': { background: GRAD, opacity: 0.9 },
            }}
          >
            {isListening ? 'Listening...' : 'Start Voice Command'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            background: '#0D1220',
            border: `1px solid ${snackbar.severity === 'success' ? G_END : snackbar.severity === 'error' ? '#EF4444' : G_START}`,
            color: 'white',
            borderRadius: '12px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(62, 214, 124, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(62, 214, 124, 0); }
          100% { box-shadow: 0 0 0 0 rgba(62, 214, 124, 0); }
        }
      `}</style>
    </>
  );
};

export default VoiceAssistant;
