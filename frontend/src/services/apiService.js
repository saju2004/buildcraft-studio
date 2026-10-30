const API_BASE_URL = 'http://127.0.0.1:8080/api';

export const apiService = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (e) {
      return { status: 'OFFLINE', error: e.message };
    }
  },

  async getProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return await res.json();
  },

  async getProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return await res.json();
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return await res.json();
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to update project');
    return await res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return true;
  },

  async duplicateProject(id) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/duplicate`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to duplicate project');
    return await res.json();
  },

  async calculateEstimate(projectData, currency = 'USD', rates = null) {
    const res = await fetch(`${API_BASE_URL}/estimates/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectData, currency, rates })
    });
    if (!res.ok) throw new Error('Failed to calculate estimate');
    return await res.json();
  },

  async generateAIPlan(prompt, plotWidth, plotLength, floors) {
    const res = await fetch(`${API_BASE_URL}/ai/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, plotWidth, plotLength, floors })
    });
    if (!res.ok) throw new Error('Failed to plan house with AI');
    return await res.json();
  }
};
