import bcrypt from 'bcryptjs';

const categories = [
  { id: 'electrical', name: 'Electrical', icon: '⚡', subcategories: ['Electrician', 'Fan Installation', 'Light Installation', 'Switch & Socket Repair', 'House Wiring', 'Other'] },
  { id: 'plumbing', name: 'Plumbing', icon: '🚰', subcategories: ['Pipe Leakage', 'Tap Repair', 'Bathroom Fittings', 'Water Tank Cleaning', 'Motor Repair', 'Other'] },
  { id: 'ac', name: 'AC & Appliances', icon: '❄️', subcategories: ['AC Service', 'AC Installation', 'AC Repair', 'Washing Machine Repair', 'Refrigerator Repair', 'Other'] },
  { id: 'home-help', name: 'Home Help', icon: '🏠', subcategories: ['Cleaning', 'Cooking', 'Maid / Home Assistance', 'Gardening', 'Other Home Help'] },
  { id: 'home-renovation', name: 'Home Renovation', icon: '🛠️', subcategories: ['Painting & Wall Work', 'Tiles & Flooring', 'Wallpaper', 'Carpentry & Woodwork', 'Other Home Renovation'] },
  { id: 'moving', name: 'Moving & Packing', icon: '🚚', subcategories: ['Movers & Packers', 'Packing & Unpacking', 'Home Shifting', 'Office Shifting', 'Driver on Demand', 'Other'] },
  { id: 'security', name: 'Security', icon: '🔒', subcategories: ['CCTV Installation', 'CCTV Repair', 'Smart Lock Installation', 'Security Guard', 'Alarm System Setup', 'Other'] }
];

const customers = [];
const workers = [];
const bookings = [];
const ownerSeed = {
  id: 'owner-1',
  email: 'owner@quickfix.com',
  passwordHash: bcrypt.hashSync('quickfix123', 10),
  name: 'Owner Admin'
};

export const appState = {
  customers,
  workers,
  bookings,
  categories,
  owners: [ownerSeed]
};

export function getCategories() {
  return categories;
}

export function getServicesByCategory(categoryId) {
  return categories.find((item) => item.id === categoryId) || null;
}

export function verifyOwner(email, password) {
  const owner = appState.owners.find((entry) => entry.email === email);
  if (!owner) return null;
  return bcrypt.compareSync(password, owner.passwordHash) ? owner : null;
}

export function createCustomer(phone, name) {
  const existing = appState.customers.find((entry) => entry.phone === phone);
  if (existing) {
    existing.name = name || existing.name;
    return existing;
  }

  const customer = {
    id: `customer-${Date.now()}`,
    phone,
    name: name || 'New Customer',
    createdAt: new Date().toISOString()
  };
  appState.customers.push(customer);
  return customer;
}

export function listWorkers() {
  return appState.workers;
}

export function createWorker(payload) {
  const worker = {
    id: `worker-${Date.now()}`,
    name: payload.name,
    phone: payload.phone,
    experience: payload.experience,
    specialty: payload.specialty,
    createdAt: new Date().toISOString()
  };
  appState.workers.push(worker);
  return worker;
}

export function updateWorker(id, payload) {
  const worker = appState.workers.find((entry) => entry.id === id);
  if (!worker) return null;
  Object.assign(worker, payload);
  return worker;
}

export function deleteWorker(id) {
  const index = appState.workers.findIndex((entry) => entry.id === id);
  if (index === -1) return false;
  appState.workers.splice(index, 1);
  return true;
}

export function createBooking(payload) {
  const booking = {
    id: `booking-${Date.now()}`,
    customerId: payload.customerId,
    customerName: payload.customerName,
    phone: payload.phone,
    category: payload.category,
    subcategory: payload.subcategory,
    otherDetails: payload.otherDetails || null,
    address: payload.address,
    scheduledAt: payload.scheduledAt,
    paymentMethod: payload.paymentMethod || 'Cash on Delivery',
    status: 'Pending',
    assignedWorkerId: null,
    assignedWorkerName: null,
    assignedWorkerPhone: null,
    assignedWorkerExperience: null,
    assignedWorkerPhoto: null,
    estimatedArrivalAt: null,
    createdAt: new Date().toISOString()
  };
  appState.bookings.push(booking);
  return booking;
}

export function listBookings() {
  return appState.bookings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getCustomerBookings(customerId) {
  return appState.bookings.filter((booking) => booking.customerId === customerId);
}

export function getCustomerById(customerId) {
  return appState.customers.find((entry) => entry.id === customerId) || null;
}

export function listCustomers() {
  return appState.customers.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createCategory(payload) {
  const id = payload.id || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (appState.categories.find((entry) => entry.id === id)) {
    return null;
  }

  const category = {
    id,
    name: payload.name,
    icon: payload.icon || '🛠️',
    subcategories: payload.subcategories || []
  };

  appState.categories.push(category);
  return category;
}

export function updateCategory(categoryId, payload) {
  const category = appState.categories.find((entry) => entry.id === categoryId);
  if (!category) return null;
  category.name = payload.name || category.name;
  category.icon = payload.icon || category.icon;
  category.subcategories = payload.subcategories || category.subcategories;
  return category;
}

export function deleteCategory(categoryId) {
  const index = appState.categories.findIndex((entry) => entry.id === categoryId);
  if (index === -1) return false;
  appState.categories.splice(index, 1);
  return true;
}

export function assignWorkerToBooking(bookingId, workerId) {
  const booking = appState.bookings.find((entry) => entry.id === bookingId);
  const worker = appState.workers.find((entry) => entry.id === workerId);
  if (!booking || !worker) return null;
  booking.assignedWorkerId = worker.id;
  booking.assignedWorkerName = worker.name;
  booking.assignedWorkerPhone = worker.phone;
  booking.assignedWorkerExperience = worker.experience;
  booking.assignedWorkerPhoto = worker.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=0f5fff&color=ffffff`;
  booking.estimatedArrivalAt = new Date(Date.now() + 45 * 60000).toISOString();
  booking.status = 'Assigned';
  return booking;
}

export function updateBookingStatus(bookingId, status) {
  const booking = appState.bookings.find((entry) => entry.id === bookingId);
  if (!booking) return null;
  booking.status = status;
  return booking;
}

export function getDashboardSummary() {
  return {
    totalBookings: appState.bookings.length,
    pendingBookings: appState.bookings.filter((booking) => booking.status === 'Pending').length,
    assignedBookings: appState.bookings.filter((booking) => booking.status === 'Assigned').length,
    workerCount: appState.workers.length,
    customerCount: appState.customers.length
  };
}
