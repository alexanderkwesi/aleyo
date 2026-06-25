import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.aleyo.app/v1';
const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true;

// Mock data
const mockProjects = [
  {
    id: 'proj_1',
    name: 'My Business Website',
    type: 'business',
    status: 'published',
    lastEdited: '2024-01-15T10:30:00Z',
    credits: 150,
    design: 'Modern Minimalist',
    templateId: 1,
    components: [],
    styles: {
      primaryColor: '#4F6EF7',
      secondaryColor: '#2DBCB6',
      fontFamily: 'Inter, sans-serif',
    },
  },
  {
    id: 'proj_2',
    name: 'Portfolio Site',
    type: 'portfolio',
    status: 'draft',
    lastEdited: '2024-01-14T15:45:00Z',
    credits: 75,
    design: 'Creative Agency',
    templateId: 2,
    components: [],
    styles: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#EC4899',
      fontFamily: 'Poppins, sans-serif',
    },
  },
];

const mockTemplates = [
  {
    id: 1,
    name: 'Modern Minimalist',
    category: 'business',
    description: 'Clean and professional design perfect for corporate websites',
    rating: 4.8,
    reviews: 234,
    features: ['Responsive', 'SEO Optimized', 'Fast Loading'],
    popular: true,
    previewUrl: '/previews/modern-minimalist',
  },
  // ... more templates
];

const mockIntegrations = [
  {
    id: 1,
    name: 'Stripe',
    category: 'payments',
    connected: false,
    apiKey: null,
    settings: {},
  },
  // ... more integrations
];

// API service with mock fallback
class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getProjects() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockProjects), 500);
      });
    }
    const response = await this.client.get('/projects');
    return response.data;
  }

  async getProject(id) {
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const project = mockProjects.find((p) => p.id === id);
          if (project) resolve(project);
          else reject(new Error('Project not found'));
        }, 300);
      });
    }
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProject = {
            id: `proj_${Date.now()}`,
            ...data,
            status: 'draft',
            lastEdited: new Date().toISOString(),
            components: [],
            styles: {
              primaryColor: '#4F6EF7',
              secondaryColor: '#2DBCB6',
              fontFamily: 'Inter, sans-serif',
              backgroundColor: '#0F172A',
              textColor: '#FFFFFF',
            },
          };
          mockProjects.unshift(newProject);
          resolve(newProject);
        }, 500);
      });
    }
    const response = await this.client.post('/projects', data);
    return response.data;
  }

  async updateProject(id, updates) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockProjects.findIndex((p) => p.id === id);
          if (index !== -1) {
            mockProjects[index] = {
              ...mockProjects[index],
              ...updates,
              lastEdited: new Date().toISOString(),
            };
            resolve(mockProjects[index]);
          } else {
            resolve(null);
          }
        }, 500);
      });
    }
    const response = await this.client.patch(`/projects/${id}`, updates);
    return response.data;
  }

  async deleteProject(id) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = mockProjects.findIndex((p) => p.id === id);
          if (index !== -1) mockProjects.splice(index, 1);
          resolve({ success: true });
        }, 500);
      });
    }
    const response = await this.client.delete(`/projects/${id}`);
    return response.data;
  }

  async getTemplates(category = 'all') {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = mockTemplates;
          if (category !== 'all') {
            filtered = mockTemplates.filter((t) => t.category === category);
          }
          resolve(filtered);
        }, 400);
      });
    }
    const response = await this.client.get('/templates', { params: { category } });
    return response.data;
  }

  async getIntegrations() {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockIntegrations), 300);
      });
    }
    const response = await this.client.get('/integrations');
    return response.data;
  }

  async connectIntegration(integrationId, config) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const integration = mockIntegrations.find((i) => i.id === integrationId);
          if (integration) {
            integration.connected = true;
            integration.settings = config;
          }
          resolve(integration);
        }, 800);
      });
    }
    const response = await this.client.post(`/integrations/${integrationId}/connect`, config);
    return response.data;
  }

  async saveDesign(projectId, designData) {
    if (USE_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const project = mockProjects.find((p) => p.id === projectId);
          if (project) {
            project.components = designData.components;
            project.styles = designData.styles;
          }
          resolve({ success: true });
        }, 1000);
      });
    }
    const response = await this.client.post(`/projects/${projectId}/design`, designData);
    return response.data;
  }
}

export const apiService = new ApiService();
export const projectService = apiService;
