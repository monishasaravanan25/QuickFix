import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyToken, signToken } from './auth.js';
import {
  appState,
  createBooking,
  createCategory,
  createCustomer,
  createWorker,
  deleteCategory,
  deleteWorker,
  getCategories,
  getCustomerBookings,
  getDashboardSummary,
  getServicesByCategory,
  listBookings,
  listCustomers,
  listWorkers,
  updateBookingStatus,
  updateCategory,
  updateWorker,
  verifyOwner,
  assignWorkerToBooking
} from './store.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function requireOwner(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'owner') {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return payload;
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'QuickFix server is running' });
});

app.get('/api/overview', (_req, res) => {
  res.json({
    app: 'QuickFix',
    customerApp: true,
    ownerPanel: true,
    workerApp: false,
    message: 'Backend skeleton ready for MVP development'
  });
});

app.get('/api/categories', (_req, res) => {
  res.json(getCategories());
});

app.get('/api/categories/:categoryId', (req, res) => {
  const category = getServicesByCategory(req.params.categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  return res.json(category);
});

app.post('/api/auth/owner/login', (req, res) => {
  const { email, password } = req.body;
  const owner = verifyOwner(email, password);
  if (!owner) {
    return res.status(401).json({ message: 'Invalid owner credentials' });
  }
  return res.json({ token: signToken({ sub: owner.id, role: 'owner' }), owner: { id: owner.id, email: owner.email, name: owner.name } });
});

app.post('/api/customers/login', (req, res) => {
  const { phone, name } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }
  const customer = createCustomer(phone, name || 'Customer');
  return res.json({ customer, otp: '123456' });
});

app.post('/api/bookings', (req, res) => {
  const booking = createBooking(req.body);
  res.status(201).json(booking);
});

app.get('/api/bookings/customer/:customerId', (req, res) => {
  res.json(getCustomerBookings(req.params.customerId));
});

app.get('/api/workers', (req, res) => {
  res.json(listWorkers());
});

app.post('/api/workers', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const worker = createWorker(req.body);
  res.status(201).json(worker);
});

app.put('/api/workers/:id', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const worker = updateWorker(req.params.id, req.body);
  if (!worker) {
    return res.status(404).json({ message: 'Worker not found' });
  }
  return res.json(worker);
});

app.delete('/api/workers/:id', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const removed = deleteWorker(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Worker not found' });
  }
  return res.json({ message: 'Worker deleted' });
});

app.get('/api/owner/categories', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  res.json(getCategories());
});

app.post('/api/owner/categories', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const category = createCategory(req.body);
  if (!category) {
    return res.status(400).json({ message: 'Category already exists' });
  }
  res.status(201).json(category);
});

app.put('/api/owner/categories/:id', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const category = updateCategory(req.params.id, req.body);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json(category);
});

app.delete('/api/owner/categories/:id', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  const removed = deleteCategory(req.params.id);
  if (!removed) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.json({ message: 'Category removed' });
});

app.get('/api/owner/customers', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  res.json(listCustomers());
});

app.get('/api/owner/dashboard', (req, res) => {
  const auth = requireOwner(req, res);
  if (!auth) return;
  return res.json(getDashboardSummary());
});

app.get('/api/owner/bookings', (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'owner') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json(listBookings());
});

app.post('/api/owner/bookings/:id/assign', (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'owner') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const booking = assignWorkerToBooking(req.params.id, req.body.workerId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking or worker not found' });
  }
  return res.json(booking);
});

app.patch('/api/owner/bookings/:id/status', (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'owner') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const booking = updateBookingStatus(req.params.id, req.body.status);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  return res.json(booking);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`QuickFix server listening on port ${port}`);
});
