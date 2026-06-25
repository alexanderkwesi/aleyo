// src/services/voiceAssistant.js
class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.callbacks = {
      onResult: () => {},
      onError: () => {},
      onEnd: () => {},
    };
    this.initRecognition();
  }

  initRecognition() {
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          this.callbacks.onResult(finalTranscript, true);
        } else if (interimTranscript) {
          this.callbacks.onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event) => {
        this.callbacks.onError(event.error);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd();
      };
    } else {
      console.warn('Speech recognition not supported');
    }
  }

  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  startListening(useAzure = false) {
    if (useAzure) {
      // For Azure, you would integrate Azure Speech SDK here
      console.log('Azure voice service would be used here');
      this.callbacks.onResult('Azure voice service integration demo', true);
    } else if (this.recognition) {
      try {
        this.recognition.start();
        this.isListening = true;
      } catch (error) {
        console.error('Error starting recognition:', error);
        this.callbacks.onError(error.message);
      }
    } else {
      this.callbacks.onError('Speech recognition not supported');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

// Create and export a singleton instance
const voiceServiceInstance = new VoiceService();
export { voiceServiceInstance as voiceService };
export default voiceServiceInstance;
