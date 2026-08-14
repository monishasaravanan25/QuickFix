import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

const API_BASE = 'http://127.0.0.1:4000';

function authHeader() {
  const auth = localStorage.getItem('quickfix-owner');
  if (!auth) return null;
  const { token } = JSON.parse(auth);
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function OwnerLayout({ children }) {
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState('Owner');

  useEffect(() => {
    const auth = localStorage.getItem('quickfix-owner');
    if (!auth) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(auth);
    setOwnerName(parsed.owner?.name || 'Owner');
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('quickfix-owner');
    navigate('/');
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Owner panel</p>
          <h1>QuickFix admin dashboard</h1>
          <p className="subtext">Welcome back, {ownerName}. Manage bookings, workers, customers, and categories.</p>
        </div>
        <button className="secondary-btn logout-btn" onClick={handleLogout}>Log out</button>
      </header>
      <nav className="owner-nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/bookings">Bookings</Link>
        <Link to="/workers">Workers</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/categories">Categories</Link>
      </nav>
      {children}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('owner@quickfix.com');
  const [password, setPassword] = useState('quickfix123');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch(`${API_BASE}/api/auth/owner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('quickfix-owner', JSON.stringify(data));
      navigate('/dashboard');
    } else {
      setMessage(data.message || 'Login failed');
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <p className="eyebrow">QuickFix Owner</p>
        <h1>Admin sign in</h1>
      </div>
      <div className="card stack">
        <form onSubmit={handleLogin} className="stack">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="primary-btn" type="submit">Sign in</button>
          {message ? <p className="message">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const headers = authHeader();
    if (!headers) return;

    fetch(`${API_BASE}/api/owner/dashboard`, { headers })
      .then((response) => response.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <OwnerLayout>
      <section className="card stats-card">
        {summary ? (
          <div className="stats-grid">
            <div className="stat-card"><strong>{summary.totalBookings}</strong><span>Total bookings</span></div>
            <div className="stat-card"><strong>{summary.pendingBookings}</strong><span>Pending</span></div>
            <div className="stat-card"><strong>{summary.assignedBookings}</strong><span>Assigned</span></div>
            <div className="stat-card"><strong>{summary.workerCount}</strong><span>Workers</span></div>
            <div className="stat-card"><strong>{summary.customerCount}</strong><span>Customers</span></div>
          </div>
        ) : (
          <p className="subtext">Loading dashboard...</p>
        )}
      </section>
    </OwnerLayout>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const headers = authHeader();
    if (!headers) return;

    fetch(`${API_BASE}/api/owner/bookings`, { headers })
      .then((response) => response.json())
      .then((data) => setBookings(data));

    fetch(`${API_BASE}/api/workers`)
      .then((response) => response.json())
      .then((data) => setWorkers(data));
  }, []);

  async function assignWorker(bookingId, workerId) {
    if (!workerId) return;
    const headers = authHeader();
    if (!headers) return;

    const response = await fetch(`${API_BASE}/api/owner/bookings/${bookingId}/assign`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ workerId })
    });
    if (response.ok) {
      const updated = await response.json();
      setBookings((items) => items.map((item) => item.id === updated.id ? updated : item));
      setMessage(`Assigned ${updated.assignedWorkerName} successfully.`);
    }
  }

  async function updateStatus(bookingId, status) {
    const headers = authHeader();
    if (!headers) return;

    const response = await fetch(`${API_BASE}/api/owner/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      const updated = await response.json();
      setBookings((items) => items.map((item) => item.id === updated.id ? updated : item));
      setMessage(`Booking status updated to ${updated.status}.`);
    }
  }

  return (
    <OwnerLayout>
      <div className="section-header">
        <h2>Bookings</h2>
        <span className="subtext">Review requests and assign workers manually.</span>
      </div>
      {message ? <div className="card"><p className="message">{message}</p></div> : null}
      {bookings.length === 0 ? (
        <div className="card empty-state"><p className="subtext">No bookings yet. Customer requests will appear here after booking confirmation.</p></div>
      ) : bookings.map((booking) => (
        <div className="card booking-card" key={booking.id}>
          <div className="booking-meta">
            <div>
              <p className="eyebrow">{booking.subcategory}</p>
              <p><strong>{booking.customerName}</strong></p>
              <p className="subtext">{booking.address}</p>
              <p className="subtext">{new Date(booking.scheduledAt).toLocaleString()}</p>
            </div>
            <span className={`status-pill ${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>{booking.status}</span>
          </div>
          <div className="grid-two gap-10">
            <select defaultValue="" onChange={(e) => assignWorker(booking.id, e.target.value)}>
              <option value="">Assign worker</option>
              {workers.map((worker) => <option key={worker.id} value={worker.id}>{worker.name} • {worker.specialty}</option>)}
            </select>
            <select defaultValue={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}>
              <option>Pending</option>
              <option>Assigned</option>
              <option>On the Way</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          {booking.assignedWorkerName ? (
            <div className="worker-card">
              <img className="worker-photo" src={booking.assignedWorkerPhoto} alt={booking.assignedWorkerName} />
              <div>
                <p><strong>{booking.assignedWorkerName}</strong></p>
                <p className="subtext">{booking.assignedWorkerExperience}</p>
                <p className="subtext">{booking.assignedWorkerPhone}</p>
                <p className="subtext">ETA: {booking.estimatedArrivalAt ? new Date(booking.estimatedArrivalAt).toLocaleString() : 'Pending'}</p>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </OwnerLayout>
  );
}

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', experience: '', specialty: '', photoUrl: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/workers`)
      .then((response) => response.json())
      .then((data) => setWorkers(data));
  }, []);

  async function saveWorker(e) {
    e.preventDefault();
    const payload = { ...form };
    const url = editing ? `${API_BASE}/api/workers/${editing.id}` : `${API_BASE}/api/workers`;
    const method = editing ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(payload)
    });
    if (!response.ok) return;
    const saved = await response.json();
    setWorkers((items) => {
      if (editing) {
        return items.map((item) => item.id === saved.id ? saved : item);
      }
      return [saved, ...items];
    });
    setForm({ name: '', phone: '', experience: '', specialty: '', photoUrl: '' });
    setEditing(null);
  }

  async function removeWorker(id) {
    const response = await fetch(`${API_BASE}/api/workers/${id}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    if (response.ok) {
      setWorkers((items) => items.filter((item) => item.id !== id));
    }
  }

  function startEdit(worker) {
    setEditing(worker);
    setForm({ name: worker.name, phone: worker.phone, experience: worker.experience, specialty: worker.specialty, photoUrl: worker.photoUrl || '' });
  }

  return (
    <OwnerLayout>
      <div className="section-header">
        <h2>Workers</h2>
        <span className="subtext">Add, edit, or remove workers on the platform.</span>
      </div>
      <form onSubmit={saveWorker} className="card stack">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
        <input placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
        <input placeholder="Photo URL" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
        <div className="grid-two gap-10">
          <button className="primary-btn" type="submit">{editing ? 'Save worker' : 'Add worker'}</button>
          {editing ? <button className="secondary-btn" type="button" onClick={() => { setEditing(null); setForm({ name: '', phone: '', experience: '', specialty: '', photoUrl: '' }); }}>Cancel</button> : null}
        </div>
      </form>
      {workers.length === 0 ? (
        <div className="card empty-state"><p className="subtext">No workers added yet.</p></div>
      ) : (
        workers.map((worker) => (
          <div className="card worker-row" key={worker.id}>
            <div>
              <p><strong>{worker.name}</strong></p>
              <p className="subtext">{worker.specialty}</p>
              <p className="subtext">{worker.phone}</p>
            </div>
            <div className="action-group">
              <button className="secondary-btn" type="button" onClick={() => startEdit(worker)}>Edit</button>
              <button className="delete-btn" type="button" onClick={() => removeWorker(worker.id)}>Remove</button>
            </div>
          </div>
        ))
      )}
    </OwnerLayout>
  );
}

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const headers = authHeader();
    if (!headers) return;

    fetch(`${API_BASE}/api/owner/customers`, { headers })
      .then((response) => response.json())
      .then((data) => setCustomers(data));
  }, []);

  return (
    <OwnerLayout>
      <div className="section-header">
        <h2>Customers</h2>
        <span className="subtext">View customers who booked through QuickFix.</span>
      </div>
      {customers.length === 0 ? (
        <div className="card empty-state"><p className="subtext">No customers found yet.</p></div>
      ) : customers.map((customer) => (
        <div className="card customer-row" key={customer.id}>
          <div>
            <p><strong>{customer.name}</strong></p>
            <p className="subtext">{customer.phone}</p>
          </div>
          <span className="subtext">Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </OwnerLayout>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', icon: '', subcategories: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const headers = authHeader();
    if (!headers) return;

    fetch(`${API_BASE}/api/owner/categories`, { headers })
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  async function saveCategory(e) {
    e.preventDefault();
    const headers = authHeader();
    if (!headers) return;
    const payload = {
      name: form.name,
      icon: form.icon || '🛠️',
      subcategories: form.subcategories.split(',').map((sub) => sub.trim()).filter(Boolean)
    };
    const url = editing ? `${API_BASE}/api/owner/categories/${editing.id}` : `${API_BASE}/api/owner/categories`;
    const method = editing ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });
    if (!response.ok) return;
    const saved = await response.json();
    setCategories((items) => {
      if (editing) {
        return items.map((item) => item.id === saved.id ? saved : item);
      }
      return [saved, ...items];
    });
    setForm({ name: '', icon: '', subcategories: '' });
    setEditing(null);
  }

  async function removeCategory(id) {
    const headers = authHeader();
    if (!headers) return;
    const response = await fetch(`${API_BASE}/api/owner/categories/${id}`, {
      method: 'DELETE',
      headers
    });
    if (response.ok) {
      setCategories((items) => items.filter((item) => item.id !== id));
    }
  }

  function startEdit(category) {
    setEditing(category);
    setForm({ name: category.name, icon: category.icon, subcategories: category.subcategories.join(', ') });
  }

  return (
    <OwnerLayout>
      <div className="section-header">
        <h2>Categories</h2>
        <span className="subtext">Add or update main categories and service lists.</span>
      </div>
      <form onSubmit={saveCategory} className="card stack">
        <input placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Icon emoji" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <textarea placeholder="Subcategories, comma separated" value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} rows="3" />
        <div className="grid-two gap-10">
          <button className="primary-btn" type="submit">{editing ? 'Save category' : 'Add category'}</button>
          {editing ? <button className="secondary-btn" type="button" onClick={() => { setEditing(null); setForm({ name: '', icon: '', subcategories: '' }); }}>Cancel</button> : null}
        </div>
      </form>
      {categories.length === 0 ? (
        <div className="card empty-state"><p className="subtext">No categories created yet.</p></div>
      ) : categories.map((category) => (
        <div className="card category-row" key={category.id}>
          <div>
            <p className="emoji">{category.icon}</p>
            <p><strong>{category.name}</strong></p>
            <p className="subtext">{category.subcategories.join(', ')}</p>
          </div>
          <div className="action-group">
            <button className="secondary-btn" type="button" onClick={() => startEdit(category)}>Edit</button>
            <button className="delete-btn" type="button" onClick={() => removeCategory(category.id)}>Delete</button>
          </div>
        </div>
      ))}
    </OwnerLayout>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </div>
  );
}
