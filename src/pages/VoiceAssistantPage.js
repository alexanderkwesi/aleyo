// VoiceAssistantBoxed.js - Complete fixed version
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Avatar,
  Divider,
  Tooltip,
  Zoom,
  Fade,
  Grow,
  Slide,
  Backdrop,
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
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
  Psychology,
  Add,
  ContactMail,
  ShoppingCart,
  GridOn,
  PhotoLibrary,
  History,
  AutoAwesome,
  Stop,
  CheckCircle,
  ErrorOutline,
  HelpOutline,
  RestartAlt,
  Share,
  Animation,
  Palette,
  Devices,
  SmartToy,
  RecordVoiceOver,
  Send as SendIcon,
  FolderOpen,
  GetApp,
  Code,
  Storage,
  Description,
  Clear,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// -------------------------------------------------------------------
// DESIGN SYSTEM
// -------------------------------------------------------------------
const COLORS = {
  primary: {
    start: '#4F6EF7',
    mid: '#2DBCB6',
    end: '#3ED67C',
    glow: 'rgba(79, 110, 247, 0.4)',
    dark: '#0D1220',
    surface: '#1A1F2E',
    border: 'rgba(255, 255, 255, 0.08)',
  },
  accent: {
    purple: '#A855F7',
    pink: '#EC4899',
    orange: '#F97316',
    yellow: '#EAB308',
    cyan: '#06B6D4',
  },
  state: {
    listening: '#3ED67C',
    processing: '#F97316',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
};

const GRADIENT_PRIMARY = `linear-gradient(135deg, ${COLORS.primary.start} 0%, ${COLORS.primary.mid} 50%, ${COLORS.primary.end} 100%)`;
const GRADIENT_DARK = `linear-gradient(135deg, ${COLORS.primary.dark} 0%, #0A0F18 100%)`;
const GRADIENT_ACCENT = `linear-gradient(135deg, ${COLORS.accent.purple} 0%, ${COLORS.accent.pink} 100%)`;

// -------------------------------------------------------------------
// Backend connection
// -------------------------------------------------------------------
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// -------------------------------------------------------------------
// WebSocket Manager for Real-time Communication (Moved outside component)
// -------------------------------------------------------------------
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.userId = null;
  }

  connect(userId) {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.userId = userId;
    this.isConnecting = true;
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/${userId}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { status: 'connected' });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.emit('disconnected', { status: 'disconnected' });
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.isConnecting = false;
      this.emit('error', error);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      this.emit('reconnect_failed', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);

    setTimeout(() => {
      if (this.userId) {
        console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect(this.userId);
      }
    }, delay);
  }

  send(data) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }
    console.warn('WebSocket not connected, message not sent');
    return false;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnecting = false;
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// -------------------------------------------------------------------
// Audio Visualizer Component
// -------------------------------------------------------------------
const AudioVisualizer = ({ isListening, isProcessing }) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      return;
    }

    let startTime = performance.now();
    const animate = (time) => {
      const elapsed = time - startTime;
      const level = ((Math.sin(elapsed * 0.015) + 1) / 2) * 0.8 + Math.random() * 0.2;
      setAudioLevel(Math.min(1, Math.max(0.2, level)));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isListening]);

  if (!isListening && !isProcessing) return null;

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, height: 32 }}
    >
      {[...Array(8)].map((_, i) => {
        let height = 4;
        if (isListening) {
          const factor = Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5;
          height = 4 + audioLevel * 28 * factor;
        } else if (isProcessing) {
          height = 8 + Math.sin(Date.now() * 0.01 + i) * 4;
        }
        return (
          <motion.div
            key={i}
            animate={{ height: [height, height * 1.5, height] }}
            transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
            style={{
              width: 3,
              height: `${height}px`,
              backgroundColor: isListening ? COLORS.state.listening : COLORS.state.processing,
              borderRadius: 2,
            }}
          />
        );
      })}
    </Box>
  );
};

// -------------------------------------------------------------------
// Message Bubble Component
// -------------------------------------------------------------------
const MessageBubble = ({ message, isUser, timestamp }) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '85%' }}>
        {!isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: GRADIENT_PRIMARY,
              boxShadow: `0 0 10px ${COLORS.primary.glow}`,
            }}
          >
            <Psychology sx={{ fontSize: 18 }} />
          </Avatar>
        )}
        <Paper
          elevation={0}
          sx={{
            p: 1.75,
            background: isUser ? GRADIENT_PRIMARY : 'rgba(255, 255, 255, 0.05)',
            borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
            backdropFilter: isUser ? 'none' : 'blur(10px)',
            border: isUser ? 'none' : `1px solid ${COLORS.primary.border}`,
          }}
        >
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {message}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.5,
              fontSize: '0.65rem',
              textAlign: 'right',
            }}
          >
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Paper>
        {isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: GRADIENT_ACCENT,
              fontSize: '0.875rem',
              fontWeight: 'bold',
            }}
          >
            U
          </Avatar>
        )}
      </Box>
    </motion.div>
  );
};

// -------------------------------------------------------------------
// Command Chip Component
// -------------------------------------------------------------------
const CommandChip = ({ suggestion, onClick, isAI }) => {
  return (
    <Tooltip title={suggestion.description || suggestion.text} arrow placement="top">
      <Chip
        icon={suggestion.icon}
        label={suggestion.text}
        onClick={() => onClick(suggestion)}
        variant="outlined"
        sx={{
          borderColor: isAI ? COLORS.accent.purple : COLORS.primary.border,
          backgroundColor: isAI ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          color: 'white',
          '&:hover': {
            borderColor: isAI ? COLORS.accent.purple : COLORS.primary.start,
            backgroundColor: isAI ? 'rgba(168, 85, 247, 0.2)' : 'rgba(79, 110, 247, 0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease',
          },
          transition: 'all 0.2s ease',
          borderRadius: '12px',
          height: 36,
          '& .MuiChip-icon': {
            color: isAI ? COLORS.accent.purple : COLORS.primary.start,
          },
        }}
      />
    </Tooltip>
  );
};

// -------------------------------------------------------------------
// MAIN COMPONENT: VoiceAssistantBoxed
// -------------------------------------------------------------------
const VoiceAssistantBoxed = ({
  onCommand,
  currentContext = 'home',
  studioState,
  onStudioTransform,
  userId,
  onWebsiteGenerated,
}) => {
  // State Management
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [responses, setResponses] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [voiceEngine, setVoiceEngine] = useState('web');
  const [commandHistory, setCommandHistory] = useState([]);
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typingInput, setTypingInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [micPermission, setMicPermission] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState(null);
  const [showFiles, setShowFiles] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  // Create wsManager instance with useRef to avoid re-creation
  const wsManagerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize WebSocket Manager
  useEffect(() => {
    if (!wsManagerRef.current) {
      wsManagerRef.current = new WebSocketManager();
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses]);

  // Initialize WebSocket
  useEffect(() => {
    const wsManager = wsManagerRef.current;
    if (!wsManager || !userId) return;

    wsManager.on('connected', () => {
      setWsConnected(true);
      showNotification('Connected to voice assistant', 'success');
    });

    wsManager.on('disconnected', () => {
      setWsConnected(false);
      showNotification('Disconnected from voice assistant', 'warning');
    });

    wsManager.on('message', (data) => {
      handleWebSocketMessage(data);
    });

    wsManager.on('error', (error) => {
      console.error('WebSocket error:', error);
      showNotification('Connection error. Using HTTP fallback.', 'warning');
    });

    wsManager.on('reconnect_failed', () => {
      showNotification('Unable to connect to voice service. Using HTTP fallback.', 'error');
    });

    wsManager.connect(userId);

    return () => {
      wsManager.disconnect();
    };
  }, [userId]);

  // -----------------------------------------------------------------
  // Website Generation via AI
  // -----------------------------------------------------------------
  const generateWebsiteWithAI = async (command) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Analyzing your request...');
    setGeneratedFiles(null);

    try {
      const token = localStorage.getItem('authToken');

      // Step 1: Generate website structure
      setGenerationProgress(20);
      setGenerationStatus('Generating website structure...');

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          command: command,
          context: currentContext,
          studio_state: studioState || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate website');
      }

      const data = await response.json();
      setGenerationProgress(60);
      setGenerationStatus('Building website files...');

      // Step 2: Generate the actual files
      const filesResponse = await fetch(`${API_BASE_URL}/api/ai/generate-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          website_data: data,
          command: command,
        }),
      });

      if (!filesResponse.ok) {
        const errorData = await filesResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate website files');
      }

      const filesData = await filesResponse.json();
      setGenerationProgress(90);
      setGenerationStatus('Finalizing...');

      // Store generated files - ensure files array exists
      const files = filesData.files || [];
      setGeneratedFiles({
        ...filesData,
        files: files,
        tech_stack: filesData.tech_stack || 'React + Tailwind CSS',
      });

      setGenerationProgress(100);
      setGenerationStatus('✅ Website generated successfully!');

      // Add response
      const techStack = filesData.tech_stack || 'modern';
      const fileCount = files.length;
      addResponse(
        'assistant',
        `🎉 I've created a complete ${techStack} business website for you! The website includes ${fileCount} files with a professional design.`
      );

      // Show file list
      setShowFiles(true);

      // Notify parent
      if (onWebsiteGenerated) {
        onWebsiteGenerated(filesData);
      }

      showNotification('✅ Website generated successfully! Check the files below.', 'success');
    } catch (error) {
      console.error('Website generation error:', error);
      setGenerationStatus(`❌ Error: ${error.message}`);
      showNotification(`Failed to generate website: ${error.message}`, 'error');
      addResponse(
        'assistant',
        `❌ Sorry, I encountered an error: ${error.message}. Please try again.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.action) {
      case 'update_style':
        if (onStudioTransform) {
          onStudioTransform({ themeChange: 'custom', style: data.property, value: data.value });
        }
        addResponse('assistant', `✅ Updated ${data.property} to ${data.value}`);
        break;

      case 'add_component':
        if (onStudioTransform) {
          onStudioTransform({ addComponent: data.type });
        }
        addResponse('assistant', `✅ Added ${data.type} component`);
        break;

      case 'change_layout':
        if (onStudioTransform) {
          onStudioTransform({ layout: data.layout_type });
        }
        addResponse('assistant', `✅ Changed layout to ${data.layout_type}`);
        break;

      case 'apply_template':
        if (onCommand) {
          onCommand({ type: 'createTemplate', template: data.template?.id || 'modern' });
        }
        addResponse('assistant', `✅ Applied template: ${data.template?.id || 'modern'}`);
        break;

      case 'merge_complete':
        addResponse('assistant', '✅ Designs merged successfully!');
        break;

      default:
        if (data.response) {
          addResponse('assistant', data.response);
        }
    }
  };

  // Speech Recognition Setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showNotification('Speech recognition not supported in this browser', 'error');
      setIsTypingMode(true);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final) {
        setTranscript(final);
        processVoiceCommand(final);
        setIsListening(false);
        recognitionRef.current?.stop();
      } else if (interim) {
        setInterimTranscript(interim);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        showNotification('Microphone access denied. Please enable it or use typing mode.', 'error');
        setIsTypingMode(true);
      } else if (event.error === 'no-speech') {
        showNotification('No speech detected. Please try again.', 'warning');
      } else {
        showNotification(`Speech error: ${event.error}`, 'error');
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Check microphone permission
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        setMicPermission(permissionStatus.state);
        permissionStatus.addEventListener('change', () => setMicPermission(permissionStatus.state));
      } catch (error) {
        console.warn('Permission API not supported', error);
      }
    };
    checkMicPermission();
  }, []);

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 4000);
  };

  const addResponse = (type, content) => {
    setResponses((prev) => [
      ...prev,
      { type, content, timestamp: new Date(), id: Date.now() + Math.random() },
    ]);
  };

  // -----------------------------------------------------------------
  // Website Generation via AI
  // -----------------------------------------------------------------
  const generateWebsiteWithAI___ = async (command) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Analyzing your request...');
    setGeneratedFiles(null);

    try {
      const token = localStorage.getItem('authToken');

      // Step 1: Generate website structure
      setGenerationProgress(20);
      setGenerationStatus('Generating website structure...');

      const response = await fetch(`${API_BASE_URL}/api/ai/generate-website`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          command: command,
          context: currentContext,
          studio_state: studioState || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to generate website');
      }

      const data = await response.json();
      setGenerationProgress(60);
      setGenerationStatus('Building website files...');

      // Step 2: Generate the actual files
      const filesResponse = await fetch(`${API_BASE_URL}/api/ai/generate-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          website_data: data,
          command: command,
        }),
      });

      if (!filesResponse.ok) {
        throw new Error('Failed to generate website files');
      }

      const filesData = await filesResponse.json();
      setGenerationProgress(90);
      setGenerationStatus('Finalizing...');

      // Store generated files
      setGeneratedFiles(filesData);
      setGenerationProgress(100);
      setGenerationStatus('✅ Website generated successfully!');

      // Add response
      const techStack = filesData.tech_stack || 'modern';
      const fileCount = filesData.files?.length || 0;
      addResponse(
        'assistant',
        `🎉 I've created a complete ${techStack} business website for you! The website includes ${fileCount} files with a professional design.`
      );

      // Show file list
      setShowFiles(true);

      // Notify parent
      if (onWebsiteGenerated) {
        onWebsiteGenerated(filesData);
      }

      showNotification('✅ Website generated successfully! Check the files below.', 'success');
    } catch (error) {
      console.error('Website generation error:', error);
      setGenerationStatus(`❌ Error: ${error.message}`);
      showNotification(`Failed to generate website: ${error.message}`, 'error');
      addResponse(
        'assistant',
        `❌ Sorry, I encountered an error: ${error.message}. Please try again.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // -----------------------------------------------------------------
  // Download generated files
  // -----------------------------------------------------------------
  const downloadFiles = () => {
    if (!generatedFiles || !generatedFiles.files) return;

    // For each file, create a download
    generatedFiles.files.forEach((file) => {
      const content = file.content || '';
      const blob = new Blob([content], { type: file.mime_type || 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.path || file.name || 'file.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    showNotification(`${generatedFiles.files.length} files downloaded successfully!`, 'success');
  };

  // -----------------------------------------------------------------
  // Process voice command with website generation
  // -----------------------------------------------------------------
  const processVoiceCommand = async (command) => {
    addResponse('user', command);
    setCommandHistory((prev) => [{ command, timestamp: new Date() }, ...prev].slice(0, 20));
    setIsProcessing(true);

    // Check if it's a website generation command
    const lowerCommand = command.toLowerCase();
    if (
      (lowerCommand.includes('create') ||
        lowerCommand.includes('build') ||
        lowerCommand.includes('make') ||
        lowerCommand.includes('generate')) &&
      (lowerCommand.includes('website') ||
        lowerCommand.includes('site') ||
        lowerCommand.includes('business') ||
        lowerCommand.includes('store'))
    ) {
      await generateWebsiteWithAI(command);
      setIsProcessing(false);
      return;
    }

    // Regular command processing
    try {
      const token = localStorage.getItem('authToken');

      // Try Anthropic API
      const response = await fetch(`${API_BASE_URL}/api/ai/voice-command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          command: command,
          context: currentContext,
          studio_state: studioState || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addResponse('assistant', data.reply || 'Command processed.');

        if (data.action && onCommand) {
          onCommand(data.action);
        }
        if (data.transform && onStudioTransform) {
          onStudioTransform(data.transform);
        }
      } else {
        // Fallback to local processing
        const localResult = processCommandLocally(command);
        if (localResult.reply) {
          addResponse('assistant', localResult.reply);
        }
        if (localResult.actionToTrigger && onCommand) {
          onCommand(localResult.actionToTrigger);
        }
        if (localResult.transformData && onStudioTransform) {
          onStudioTransform(localResult.transformData);
        }
      }
    } catch (error) {
      console.error('Command processing error:', error);
      // Fallback to local
      const localResult = processCommandLocally(command);
      if (localResult.reply) {
        addResponse('assistant', localResult.reply);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // -----------------------------------------------------------------
  // Local command processing (fallback)
  // -----------------------------------------------------------------
  const processCommandLocally = (command) => {
    const lower = command.toLowerCase().trim();
    let reply = '';
    let actionToTrigger = null;
    let transformData = null;

    if (lower.match(/create|build|make|generate|new/)) {
      if (lower.match(/business|company|corporate/)) {
        reply =
          '✨ Creating a professional business website with hero, services, and contact sections.';
        actionToTrigger = { type: 'createTemplate', template: 'business' };
        transformData = { fullTransform: true, template: 'business' };
        showNotification('Building your business website...', 'success');
        // Trigger website generation
        generateWebsiteWithAI(command);
        return {
          reply: 'Generating your business website...',
          actionToTrigger: null,
          transformData: null,
        };
      } else if (lower.match(/portfolio|creative|artist/)) {
        reply = '🎨 Designing a stunning portfolio to showcase your work beautifully.';
        actionToTrigger = { type: 'createTemplate', template: 'portfolio' };
        transformData = { fullTransform: true, template: 'portfolio' };
        showNotification('Creating your portfolio...', 'success');
      } else if (lower.match(/ecommerce|shop|store/)) {
        reply = '🛒 Building a powerful e-commerce store with product grid and shopping cart.';
        actionToTrigger = { type: 'createTemplate', template: 'ecommerce' };
        transformData = { fullTransform: true, template: 'ecommerce' };
        showNotification('Setting up your online store...', 'success');
      } else {
        reply = '🚀 Creating a modern, responsive website tailored to your needs.';
        actionToTrigger = { type: 'createTemplate', template: 'modern' };
        transformData = { fullTransform: true, template: 'modern' };
        showNotification('Creating your modern website...', 'success');
      }
    } else if (lower.match(/add|insert/)) {
      if (lower.match(/hero|banner/)) {
        reply = '✨ Adding an animated hero section with a compelling headline.';
        actionToTrigger = { type: 'addComponent', component: 'hero', animated: true };
        transformData = { addComponent: 'hero' };
        showNotification('Adding hero section...', 'success');
      } else if (lower.match(/feature|service/)) {
        reply = '📦 Adding a 3-column features grid to highlight your services.';
        actionToTrigger = { type: 'addComponent', component: 'features', columns: 3 };
        transformData = { addComponent: 'features' };
        showNotification('Adding features section...', 'success');
      } else if (lower.match(/gallery|image/)) {
        reply = '🖼️ Adding a responsive image gallery with lightbox support.';
        actionToTrigger = { type: 'addComponent', component: 'gallery', layout: 'masonry' };
        transformData = { addComponent: 'gallery' };
        showNotification('Adding image gallery...', 'success');
      } else if (lower.match(/contact|form/)) {
        reply = '📧 Adding a contact form with validation and map integration.';
        actionToTrigger = { type: 'addComponent', component: 'contact', withMap: true };
        transformData = { addComponent: 'contact' };
        showNotification('Adding contact section...', 'success');
      } else if (lower.match(/pricing|plan/)) {
        reply = '💰 Adding elegant pricing tables with feature comparison.';
        actionToTrigger = { type: 'addComponent', component: 'pricing', plans: 3 };
        transformData = { addComponent: 'pricing' };
        showNotification('Adding pricing section...', 'success');
      } else {
        reply =
          '✨ What kind of section would you like to add? Try: hero section, features, gallery, contact form, or pricing tables.';
        showNotification(reply, 'info');
      }
    } else if (lower.match(/theme|color|style/)) {
      if (lower.match(/dark/)) {
        reply = '🌙 Switching to elegant dark mode theme.';
        actionToTrigger = { type: 'changeTheme', theme: 'dark' };
        transformData = { themeChange: 'dark' };
        showNotification('Applying dark theme...', 'success');
      } else if (lower.match(/light/)) {
        reply = '☀️ Switching to clean light theme.';
        actionToTrigger = { type: 'changeTheme', theme: 'light' };
        transformData = { themeChange: 'light' };
        showNotification('Applying light theme...', 'success');
      } else if (lower.match(/blue/)) {
        reply = '💙 Applying blue ocean color scheme.';
        actionToTrigger = { type: 'changeTheme', theme: 'blue' };
        transformData = { themeChange: 'blue' };
        showNotification('Applying blue theme...', 'success');
      } else if (lower.match(/purple/)) {
        reply = '💜 Applying purple nebula color scheme.';
        actionToTrigger = { type: 'changeTheme', theme: 'purple' };
        transformData = { themeChange: 'purple' };
        showNotification('Applying purple theme...', 'success');
      } else {
        reply = '🎨 I can change the theme to: dark, light, blue, or purple. Which would you like?';
        showNotification(reply, 'info');
      }
    } else if (lower.match(/responsive|mobile/)) {
      reply = '📱 Optimizing your design for all devices including mobile, tablet, and desktop.';
      actionToTrigger = { type: 'makeResponsive' };
      transformData = { responsive: true };
      showNotification('Making design responsive...', 'success');
    } else if (lower.match(/animation|animate/)) {
      reply = '✨ Adding smooth scroll animations and micro-interactions to all sections.';
      actionToTrigger = { type: 'enableAnimations', value: true };
      transformData = { animations: true };
      showNotification('Adding animations...', 'success');
    } else if (lower.match(/improve|enhance/)) {
      reply = '🚀 Enhancing your design with modern best practices.';
      actionToTrigger = { type: 'enhanceDesign' };
      transformData = { enhance: true };
      showNotification('Enhancing design...', 'success');
    } else if (lower.match(/help/)) {
      reply = `🤖 I'm your AI design assistant! Here's what I can do:

🌐 CREATE FULL WEBSITE: "Create a modern business website", "Build an e-commerce store"

🎨 CREATE: "Create a business website", "Build a portfolio"

➕ ADD: "Add hero section", "Add features grid", "Add image gallery", "Add contact form"

🎭 STYLE: "Change theme to dark", "Make it colorful"

⚡ OPTIMIZE: "Make it responsive", "Add animations", "Improve design"

Try any of these commands!`;
      showNotification('Check conversation for available commands', 'info');
    } else if (lower.match(/hello|hi/)) {
      reply = `👋 Hello! I'm Nova, your AI design assistant. I can help you create beautiful websites. Try saying "Create a modern business website" to get started!`;
      showNotification(reply, 'info');
    } else {
      reply = `🤖 I heard: "${command}". Try saying "Create a modern business website", "Add features section", or "Change theme to dark".`;
      showNotification(reply, 'warning');
    }

    return { reply, actionToTrigger, transformData };
  };

  // -----------------------------------------------------------------
  // Start/Stop Listening
  // -----------------------------------------------------------------
  const startListening = () => {
    try {
      if (micPermission === 'denied') {
        showNotification('Microphone access denied. Please enable it or use typing mode.', 'error');
        setIsTypingMode(true);
        return;
      }

      if (!recognitionRef.current) {
        showNotification('Speech recognition not available', 'error');
        return;
      }

      setIsListening(true);
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
      showNotification('🎤 Listening... Speak your command clearly', 'info');
    } catch (error) {
      showNotification(error.message || 'Failed to access microphone.', 'error');
      setIsListening(false);
      setIsTypingMode(true);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch (error) {
      console.warn('Error stopping recognition:', error);
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

  const handleTypingSubmit = () => {
    if (typingInput.trim()) {
      processVoiceCommand(typingInput);
      setTypingInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    processVoiceCommand(suggestion.text);
  };

  const clearConversation = () => {
    setResponses([]);
    setGeneratedFiles(null);
    setShowFiles(false);
    showNotification('Conversation cleared', 'info');
  };

  const handleEngineChange = (event, newEngine) => {
    if (newEngine) {
      setVoiceEngine(newEngine);
      const label = newEngine === 'anthropic' ? 'Anthropic AI' : 'Web';
      showNotification(`Switched to ${label} command engine`, 'info');
    }
  };

  // Generate AI suggestions
  const generateAISuggestions = () => {
    const suggestions = [];
    if (studioState?.components?.length < 2) {
      suggestions.push({
        text: 'Add more sections to your page',
        icon: <Add />,
        action: { type: 'addComponent', component: 'features' },
        description: 'Enhance your page',
        isAI: true,
      });
    }
    if (studioState?.globalStyles?.primaryColor === COLORS.primary.start) {
      suggestions.push({
        text: 'Try a different color scheme',
        icon: <ColorLens />,
        action: { type: 'changeColor', value: 'purple' },
        description: 'Switch to purple theme',
        isAI: true,
      });
    }
    if (
      studioState?.components?.some((c) => c.type === 'hero') &&
      !studioState?.components?.some((c) => c.type === 'cta')
    ) {
      suggestions.push({
        text: 'Add a call-to-action button',
        icon: <DesignServices />,
        action: { type: 'addCTA' },
        description: 'Improve conversions',
        isAI: true,
      });
    }
    setAiSuggestions(suggestions.slice(0, 3));
  };

  const updateSuggestions = () => {
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
          icon: <PhotoLibrary />,
          action: { type: 'createTemplate', template: 'portfolio' },
          description: 'Showcase your work beautifully',
        },
        {
          text: 'Build an e-commerce store',
          icon: <ShoppingCart />,
          action: { type: 'createTemplate', template: 'ecommerce' },
          description: 'Start selling online',
        },
        {
          text: 'Make it colorful',
          icon: <ColorLens />,
          action: { type: 'changeTheme', theme: 'vibrant' },
          description: 'Add vibrant colors',
        },
        {
          text: 'Apply dark mode',
          icon: <Palette />,
          action: { type: 'changeTheme', theme: 'dark' },
          description: 'Switch to elegant dark theme',
        },
        {
          text: 'Optimize for mobile',
          icon: <Devices />,
          action: { type: 'makeResponsive' },
          description: 'Make your design fully responsive',
        },
      ],
    };
    const contextSuggestions = suggestionsList[currentContext] || suggestionsList.home;
    setSuggestions(contextSuggestions);
  };

  useEffect(() => {
    updateSuggestions();
    generateAISuggestions();
  }, [currentContext, studioState]);

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '44px',
        maxWidth: 900,
        mx: 'auto',
        p: 3,
        background: GRADIENT_DARK,
        borderRadius: '32px',
        border: `2px solid ${COLORS.primary.border}`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px ${COLORS.primary.border}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${COLORS.primary.start}66`,
          boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px ${COLORS.primary.start}33`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${COLORS.primary.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <Psychology sx={{ color: COLORS.primary.start, fontSize: 32 }} />
          </motion.div>
          <Box>
            <Typography fontWeight={700} fontSize="1.3rem">
              Nova{' '}
              <span
                className="gradient-text"
                style={{
                  background: GRADIENT_PRIMARY,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                AI
              </span>
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Voice Design Assistant {wsConnected && '🟢'}
            </Typography>
          </Box>
          <AudioVisualizer isListening={isListening} isProcessing={isProcessing} />
          {isProcessing && <CircularProgress size={20} sx={{ color: COLORS.primary.mid }} />}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Clear conversation">
            <IconButton
              onClick={clearConversation}
              sx={{ color: 'rgba(255,255,255,0.5)' }}
              size="small"
            >
              <RestartAlt />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help">
            <IconButton
              onClick={() => setShowHelp(!showHelp)}
              sx={{ color: 'rgba(255,255,255,0.5)' }}
              size="small"
            >
              <HelpOutline />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Voice Engine & Typing Mode Toggle */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
        }}
      >
        <ToggleButtonGroup
          value={voiceEngine}
          exclusive
          onChange={handleEngineChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'rgba(255,255,255,0.6)',
              borderColor: COLORS.primary.border,
              '&.Mui-selected': {
                background: GRADIENT_PRIMARY,
                color: 'white',
              },
            },
          }}
        >
          <ToggleButton value="web">
            <Mic sx={{ fontSize: 14, mr: 0.5 }} /> Web
          </ToggleButton>
          <ToggleButton value="anthropic">
            <SmartToy sx={{ fontSize: 14, mr: 0.5 }} /> Anthropic
          </ToggleButton>
        </ToggleButtonGroup>
        <Button
          size="small"
          variant={isTypingMode ? 'contained' : 'outlined'}
          onClick={() => setIsTypingMode(!isTypingMode)}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            borderColor: COLORS.primary.border,
            color: 'white',
            background: isTypingMode ? GRADIENT_PRIMARY : 'transparent',
          }}
        >
          {isTypingMode ? '✏️ Typing Mode' : '🎤 Switch to Typing'}
        </Button>
      </Box>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 16 }}
          >
            <Paper
              sx={{
                p: 2,
                background: 'rgba(79, 110, 247, 0.1)',
                borderRadius: '16px',
                border: `1px solid ${COLORS.primary.border}`,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <AutoAwesome sx={{ fontSize: 14, color: COLORS.accent.purple }} /> Quick Commands
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  'Create a modern business website',
                  'Build an e-commerce store',
                  'Create a portfolio',
                  'Add hero section',
                  'Dark theme',
                  'Make responsive',
                ].map((cmd) => (
                  <Chip
                    key={cmd}
                    label={cmd}
                    size="small"
                    onClick={() => processVoiceCommand(cmd)}
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '&:hover': { background: 'rgba(79,110,247,0.2)' },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Progress */}
      {isGenerating && (
        <Box sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: 2,
              background: 'rgba(79, 110, 247, 0.1)',
              borderRadius: '16px',
              border: `1px solid ${COLORS.primary.border}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={24} sx={{ color: COLORS.primary.start }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{generationStatus}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={generationProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    mt: 1,
                    '& .MuiLinearProgress-bar': {
                      background: GRADIENT_PRIMARY,
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Generated Files Display */}
      {generatedFiles && showFiles && generatedFiles.files && generatedFiles.files.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Card
            sx={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.state.success}44`,
              borderRadius: '16px',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderOpen sx={{ color: COLORS.state.success }} />
                  Generated Files
                  <Chip
                    label={`${generatedFiles.files.length} files`}
                    size="small"
                    sx={{ ml: 1, background: COLORS.state.success }}
                  />
                </Typography>
                <Box>
                  <Button
                    size="small"
                    startIcon={<GetApp />}
                    onClick={downloadFiles}
                    variant="contained"
                    sx={{
                      background: GRADIENT_PRIMARY,
                      borderRadius: '20px',
                      textTransform: 'none',
                    }}
                  >
                    Download All
                  </Button>
                  <IconButton size="small" onClick={() => setShowFiles(false)} sx={{ ml: 1 }}>
                    <Clear />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
                Tech Stack: {generatedFiles.tech_stack || 'Modern'}
              </Typography>

              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {generatedFiles.files.map((file, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => {
                      showNotification(
                        `📄 ${file.path}: ${file.content?.length || 0} characters`,
                        'info'
                      );
                    }}
                    sx={{
                      borderBottom: `1px solid ${COLORS.primary.border}`,
                      '&:hover': { background: 'rgba(255,255,255,0.05)' },
                    }}
                  >
                    <ListItemIcon>
                      {file.path?.endsWith('.html') ? (
                        <Code sx={{ color: COLORS.primary.start }} />
                      ) : file.path?.endsWith('.css') ? (
                        <Palette sx={{ color: COLORS.accent.purple }} />
                      ) : file.path?.endsWith('.js') || file.path?.endsWith('.ts') ? (
                        <DesignServices sx={{ color: COLORS.accent.yellow }} />
                      ) : file.path?.endsWith('.json') ? (
                        <Storage sx={{ color: COLORS.accent.cyan }} />
                      ) : (
                        <Description />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={file.path || file.name || `file-${index}`}
                      secondary={`${file.content?.length || 0} characters`}
                      primaryTypographyProps={{ sx: { color: 'white', fontSize: '0.9rem' } }}
                      secondaryTypographyProps={{
                        sx: { color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Typing Mode */}
      {isTypingMode && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Paper
            sx={{
              p: 1.5,
              mb: 3,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              border: `1px solid ${COLORS.primary.border}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Close sx={{ color: COLORS.primary.start, fontSize: 20, mt: 1 }} />
              <div
                contentEditable
                role="textbox"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTypingSubmit();
                  }
                }}
                onInput={(e) => setTypingInput(e.currentTarget.textContent || '')}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  padding: '10px 0',
                  outline: 'none',
                  fontSize: '0.9rem',
                  minHeight: '40px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
                data-placeholder="Type your command here..."
                suppressContentEditableWarning
              />
              <Button
                variant="contained"
                onClick={handleTypingSubmit}
                sx={{
                  background: GRADIENT_PRIMARY,
                  borderRadius: '20px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Voice Button */}
      {!isTypingMode && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <motion.div
            animate={isListening ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Fab
              onClick={toggleListening}
              disabled={isGenerating}
              sx={{
                width: 88,
                height: 88,
                background: isListening ? COLORS.state.listening : GRADIENT_PRIMARY,
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'all 0.3s ease',
                animation: isListening ? 'pulse-ring 1.5s infinite' : 'none',
                boxShadow: isListening ? `0 0 20px ${COLORS.state.listening}` : 'none',
                '&.Mui-disabled': {
                  opacity: 0.5,
                },
              }}
            >
              {isListening ? <MicOff sx={{ fontSize: 40 }} /> : <Mic sx={{ fontSize: 40 }} />}
            </Fab>
          </motion.div>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 1.5 }}>
            {isListening
              ? 'Listening... Speak now'
              : isGenerating
                ? 'Generating website...'
                : 'Click to start speaking'}
          </Typography>
          {micPermission === 'denied' && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.state.error, mt: 0.5, display: 'block' }}
            >
              Microphone access denied. Use typing mode instead.
            </Typography>
          )}
          {!wsConnected && (
            <Typography
              variant="caption"
              sx={{ color: COLORS.state.warning, mt: 0.5, display: 'block' }}
            >
              Real-time connection unavailable. Using HTTP fallback.
            </Typography>
          )}
        </Box>
      )}

      {/* Transcript Display */}
      {(transcript || (interimTranscript && isListening)) && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Paper
            sx={{
              p: 2,
              mb: 3,
              background: `rgba(79, 110, 247, 0.15)`,
              borderRadius: '20px',
              border: `1px solid ${COLORS.primary.start}44`,
            }}
          >
            <Typography variant="caption" sx={{ color: COLORS.primary.start, letterSpacing: 1 }}>
              {transcript ? 'COMMAND RECOGNIZED' : 'LISTENING...'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
              "{transcript || interimTranscript}
              {!transcript && interimTranscript && '...'}"
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* Conversation History */}
      {responses.length > 0 ? (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <RecordVoiceOver sx={{ fontSize: 14 }} /> Conversation
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 3, pr: 1 }}>
            <AnimatePresence>
              {responses.map((response, index) => (
                <MessageBubble
                  key={response.id || index}
                  message={response.content}
                  isUser={response.type === 'user'}
                  timestamp={response.timestamp}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.3)' }}>
          <Psychology sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
          <Typography variant="body2">Your conversation will appear here</Typography>
          <Typography variant="caption">
            Try saying "Create a modern business website" to get started!
          </Typography>
        </Box>
      )}

      {/* Suggestions */}
      <Box sx={{ pt: 2, borderTop: `1px solid ${COLORS.primary.border}` }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Lightbulb sx={{ fontSize: 14, color: COLORS.state.warning }} /> Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { text: '🌐 Create modern business website' },
            { text: '🛒 Build e-commerce store' },
            { text: '🎨 Create portfolio' },
            { text: '➕ Add hero section' },
            { text: '🌙 Dark theme' },
            { text: '📱 Make responsive' },
          ].map((suggestion, index) => (
            <Chip
              key={index}
              label={suggestion.text}
              onClick={() => processVoiceCommand(suggestion.text)}
              variant="outlined"
              sx={{
                borderColor: COLORS.primary.border,
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: 'white',
                '&:hover': {
                  borderColor: COLORS.primary.start,
                  backgroundColor: 'rgba(79, 110, 247, 0.1)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease',
                },
                transition: 'all 0.2s ease',
                borderRadius: '12px',
                height: 36,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 2,
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${COLORS.primary.border}`,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          {responses.length} messages • {commandHistory.length} commands
          {generatedFiles && ` • 📁 ${generatedFiles.files?.length || 0} files`}
          {wsConnected && ' • 🟢 Connected'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Mic fontSize="small" />}
          onClick={toggleListening}
          disabled={isListening || isProcessing || isGenerating}
          sx={{
            background: GRADIENT_PRIMARY,
            borderRadius: '40px',
            textTransform: 'none',
            px: 3,
            '&:hover': { background: GRADIENT_PRIMARY, opacity: 0.9 },
          }}
        >
          {isGenerating
            ? 'Generating...'
            : isListening
              ? 'Listening...'
              : isProcessing
                ? 'Processing...'
                : 'Voice Command'}
        </Button>
      </Box>

      {/* Global Styles */}
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(62, 214, 124, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(62, 214, 124, 0); }
          100% { box-shadow: 0 0 0 0 rgba(62, 214, 124, 0); }
        }
        .gradient-text {
          background: ${GRADIENT_PRIMARY};
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{
            background: COLORS.primary.dark,
            border: `1px solid ${snackbar.severity === 'success' ? COLORS.state.success : snackbar.severity === 'error' ? COLORS.state.error : COLORS.primary.start}`,
            color: 'white',
            borderRadius: '16px',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoiceAssistantBoxed;
