// src/services/admin.js
export const adminService = {
  getUsers: async () => {
    // Mock data for testing
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        credits: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        credits: 50,
        createdAt: new Date().toISOString(),
      },
    ];
  },
  updateUser: async (id, data) => {
    console.log('Updating user:', id, data);
    return { success: true };
  },
  deleteUser: async (id) => {
    console.log('Deleting user:', id);
    return { success: true };
  },
  inviteUser: async (data) => {
    console.log('Inviting user:', data);
    return { success: true };
  },
  adjustCredits: async (userId, amount) => {
    console.log('Adjusting credits:', userId, amount);
    return { success: true };
  },
};
