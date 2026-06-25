// src/pages/Admin/UserManagement.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Typography,
  Tooltip,
  InputAdornment,
  Alert,
  Snackbar,
  LinearProgress,
  Switch,
  FormControlLabel,
  alpha,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  MoreVert,
  Block,
  CheckCircle,
  Email,
  AdminPanelSettings,
  Person,
  PersonAdd,
  FilterList,
  Download,
  Refresh,
  Lock,
  LockOpen,
  VerifiedUser,
} from '@mui/icons-material';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { adminService } from '../../services/admin';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    credits: 50,
  });

  // Add AutoAnimate hooks for various animated elements
  const [tableBodyRef] = useAutoAnimate();
  const [filtersRef] = useAutoAnimate();
  const [headerRef] = useAutoAnimate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      showNotification('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      credits: user.credits,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await adminService.updateUser(selectedUser.id, formData);
      showNotification('User updated successfully');
      loadUsers();
      setEditDialogOpen(false);
    } catch (error) {
      showNotification('Failed to update user', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteUser(selectedUser.id);
      showNotification('User deleted successfully');
      loadUsers();
      setDeleteDialogOpen(false);
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  const handleInviteUser = async () => {
    try {
      await adminService.inviteUser(formData);
      showNotification('Invitation sent successfully');
      loadUsers();
      setInviteDialogOpen(false);
      setFormData({ name: '', email: '', role: 'user', status: 'active', credits: 50 });
    } catch (error) {
      showNotification('Failed to send invitation', 'error');
    }
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminService.updateUser(user.id, { status: newStatus });
      showNotification(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      loadUsers();
    } catch (error) {
      showNotification('Failed to update user status', 'error');
    }
  };

  const handleAdjustCredits = async (userId, amount) => {
    try {
      await adminService.adjustCredits(userId, amount);
      showNotification(`Credits ${amount > 0 ? 'added' : 'removed'} successfully`);
      loadUsers();
    } catch (error) {
      showNotification('Failed to adjust credits', 'error');
    }
  };

  const handleExportUsers = () => {
    const csv = convertToCSV(filteredUsers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Users exported successfully');
  };

  const convertToCSV = (data) => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Credits', 'Joined'];
    const rows = data.map((user) => [
      user.name,
      user.email,
      user.role,
      user.status,
      user.credits,
      new Date(user.createdAt).toLocaleDateString(),
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#EF4444';
      case 'moderator':
        return '#F59E0B';
      case 'premium':
        return G_END;
      default:
        return G_START;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return G_END;
      case 'suspended':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return 'rgba(255,255,255,0.5)';
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Optional: Add CSS animation for initial page load
  const containerAnimation = {
    animation: 'fadeInUp 0.5s ease-out',
  };

  return (
    <Box sx={{ p: 3 }} ref={headerRef} style={containerAnimation}>
      {/* Header Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setInviteDialogOpen(true)}
            sx={{ background: GRAD }}
          >
            Invite User
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportUsers}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Export
          </Button>
          <IconButton onClick={loadUsers} sx={{ color: 'white' }}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Filters - with auto-animate */}
      <div ref={filtersRef}>
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'rgba(255,255,255,0.5)' }} />
                    </InputAdornment>
                  ),
                  sx: { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role"
                  sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                  sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                {filteredUsers.length} users found
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </div>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'auto',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>User</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>Role</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>Status</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>Credits</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>Joined</TableCell>
              <TableCell sx={{ color: 'rgba(255,255,255,0.6)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={tableBodyRef}>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                  <LinearProgress sx={{ width: 200, mx: 'auto' }} />
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(getRoleColor(user.role), 0.2) }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: 'white', fontWeight: 500 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRoleColor(user.role), 0.2),
                        color: getRoleColor(user.role),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(user.status), 0.2),
                        color: getStatusColor(user.status),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: 'white' }}>{user.credits}</Typography>
                      <Tooltip title="Add Credits">
                        <IconButton
                          size="small"
                          onClick={() => handleAdjustCredits(user.id, 50)}
                          sx={{ color: G_END }}
                        >
                          +
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                          sx={{ color: G_START }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleUserStatus(user)}
                          sx={{ color: user.status === 'active' ? '#F59E0B' : G_END }}
                        >
                          {user.status === 'active' ? (
                            <Lock fontSize="small" />
                          ) : (
                            <LockOpen fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user)}
                          sx={{ color: '#EF4444' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: 'white',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            '& .MuiTablePagination-selectIcon': { color: 'white' },
          }}
        />
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2, '& input': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2, '& input': { color: 'white' } }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
                sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
                sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Credits"
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              sx={{ '& input': { color: 'white' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} variant="contained" sx={{ background: GRAD }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Delete User</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" sx={{ bgcolor: '#EF4444' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Invite New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2, '& input': { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2, '& input': { color: 'white' } }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
                sx={{ color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="moderator">Moderator</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Initial Credits"
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
              sx={{ '& input': { color: 'white' } }}
            />
            <Alert severity="info" sx={{ mt: 2, bgcolor: alpha(G_START, 0.1) }}>
              An invitation email will be sent to the user with instructions to create their
              account.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setInviteDialogOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Cancel
          </Button>
          <Button onClick={handleInviteUser} variant="contained" sx={{ background: GRAD }}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ bgcolor: '#0D1220', color: 'white' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
