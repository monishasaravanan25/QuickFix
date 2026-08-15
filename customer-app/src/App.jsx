import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { buildBookingPayload } from './lib/booking';

const API_BASE = 'https://quickfix-serve.onrender.com';
function Home() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data || []);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategories([]);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem('quickfix-customer');
    if (!storage) return;
    const parsed = JSON.parse(storage);
    setPhone(parsed.phone || '');
    setName(parsed.name || '');
    fetch(`${API_BASE}/api/bookings/customer/${parsed.id}`)
      .then((response) => response.json())
      .then((data) => setLatestBookings((data || []).slice(0, 3)))
      .catch(() => setLatestBookings([]));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const categoryMatches = categories
      .filter((category) => category.name.toLowerCase().includes(query))
      .map((category) => ({ type: 'category', category }));

    const serviceMatches = categories.flatMap((category) =>
      (category.subcategories || [])
        .filter((subcategory) => subcategory.toLowerCase().includes(query))
        .map((subcategory) => ({ type: 'service', category, subcategory }))
    );

    setSearchResults([...serviceMatches, ...categoryMatches]);
  }, [searchQuery, categories]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!phone.trim()) {
      setMessage('Please enter a mobile number.');
      return;
    }

    const response = await fetch(`${API_BASE}/api/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('quickfix-customer', JSON.stringify({ id: data.customer.id, phone, name: data.customer.name }));
      setMessage('Login successful. You can now book a service.');
      navigate('/book');
    } else {
      setMessage(data.message || 'Unable to sign in.');
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">QuickFix</p>
          <h1>One app for every home service.</h1>
          <p className="subtext">Fast booking, trusted workers, and simple owner management.</p>
        </div>
      </header>

      <section className="card">
        <form className="stack" onSubmit={handleLogin}>
          <h3>Customer login</h3>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" />
          <button className="primary-btn" type="submit">Get OTP</button>
          {message ? <p className="message">{message}</p> : null}
        </form>
      </section>

      <section className="card">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search categories or services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {loadingCategories ? (
          <p className="subtext">Loading services…</p>
        ) : (
          <>
            {searchQuery.trim() ? (
              <div className="category-grid">
                {searchResults.length === 0 ? (
                  <p className="subtext">No results found for “{searchQuery}”.</p>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={item.type === 'service' ? `${item.category.id}-${item.subcategory}` : item.category.id}
                      className="category-card"
                      onClick={() => {
                        if (item.type === 'service') {
                          navigate('/book', { state: { categoryId: item.category.id, category: item.category.name, subcategory: item.subcategory } });
                        } else {
                          navigate(`/category/${item.category.id}`);
                        }
                      }}
                    >
                      <span className="icon">{item.category.icon}</span>
                      <strong>{item.type === 'service' ? item.subcategory : item.category.name}</strong>
                      <p className="subtext">{item.type === 'service' ? item.category.name : 'Category'}</p>
                    </button>
                  ))
                )}
              </div>
            ) : categories.length === 0 ? (
              <p className="subtext">No services are available yet. Please try again later.</p>
            ) : (
              <div className="category-grid">
                {categories.map((category) => (
                  <Link key={category.id} to={`/category/${category.id}`} className="category-card">
                    <span className="icon">{category.icon}</span>
                    <strong>{category.name}</strong>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="card stack">
        <h3>Quick actions</h3>
        <div className="grid-two">
          <Link className="secondary-btn" to="/bookings">My bookings</Link>
        </div>
      </section>
      {latestBookings.length > 0 ? (
        <section className="card stack">
          <div className="section-header">
            <h3>Recent bookings</h3>
            <Link className="subtle-link" to="/bookings">See all</Link>
          </div>
          {latestBookings.map((booking) => (
            <div className="booking-preview" key={booking.id}>
              <p><strong>{booking.subcategory}</strong></p>
              <p className="subtext">{booking.address}</p>
              <p className="subtext">{new Date(booking.scheduledAt).toLocaleString()}</p>
              <p className="status-pill">{booking.status}</p>
            </div>
          ))}
        </section>
      ) : null}
      <section className="card stack">
        <h3>Customer support</h3>
        <p className="subtext">Need help with your booking? Our support team is ready.</p>
        <a className="secondary-btn" href="tel:+18001234567">Call support</a>
      </section>
    </div>
  );
}

function CategoryPage() {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/api/categories/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCategory(data || null);
        setLoading(false);
      })
      .catch(() => {
        setSelectedCategory(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="page"><h2>Loading services…</h2></div>;
  }

  if (!selectedCategory) {
    return <div className="page"><h2>No services available</h2><p className="subtext">This category is currently empty.</p></div>;
  }

  const subcategories = selectedCategory.subcategories.some((subcategory) => subcategory === 'Other' || subcategory.toLowerCase().startsWith('other'))
    ? selectedCategory.subcategories
    : [...selectedCategory.subcategories, 'Other'];

  return (
    <div className="page">
      <h2>{selectedCategory.name}</h2>
      <p className="subtext">Select the service you need.</p>
      <div className="stack">
        {subcategories.map((subcategory) => (
          <button key={subcategory} className="primary-btn" onClick={() => navigate('/book', { state: { categoryId: selectedCategory.id, category: selectedCategory.name, subcategory } })}>
            {subcategory}
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [form, setForm] = useState({
    categoryId: location.state?.categoryId || '',
    category: location.state?.category || '',
    subcategory: location.state?.subcategory || '',
    otherDetails: '',
    address: '',
    scheduledAt: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storage = localStorage.getItem('quickfix-customer');
    if (storage) {
      setCustomer(JSON.parse(storage));
    }

    fetch(`${API_BASE}/api/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data || []);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategories([]);
        setLoadingCategories(false);
      });
  }, []);

  useEffect(() => {
    if (location.state?.categoryId && location.state?.subcategory) {
      setStep(2);
    }
  }, [location.state]);

  const progressLabel = useMemo(() => ({ 1: 'Service', 2: 'Address', 3: 'Time', 4: 'Confirm' }[step]), [step]);
  const selectedCategory = categories.find((entry) => entry.id === form.categoryId) || null;
  const subcategoryOptions = selectedCategory
    ? (selectedCategory.subcategories.some((subcategory) => subcategory === 'Other' || subcategory.toLowerCase().startsWith('other'))
      ? selectedCategory.subcategories
      : [...selectedCategory.subcategories, 'Other'])
    : [];

  async function submitBooking() {
    if (!customer) {
      setError('Please sign in first.');
      return;
    }

    if (!form.category || !form.subcategory || !form.address || !form.scheduledAt) {
      setError('Please complete all booking details before confirming.');
      return;
    }

    if (form.subcategory === 'Other' && !form.otherDetails.trim()) {
      setError('Please describe your requirement for Other.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = buildBookingPayload({
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      category: form.category,
      subcategory: form.subcategory,
      address: form.address,
      scheduledAt: form.scheduledAt,
      paymentMethod: form.paymentMethod,
      otherDetails: form.otherDetails.trim()
    });

    const response = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (response.ok) {
      navigate('/bookings', { state: { booking: data, message: 'Booking confirmed. The owner will review and assign a worker shortly.' } });
    } else {
      setError(data.message || 'Unable to create booking right now.');
    }
  }

  return (
    <div className="page">
      <div className="card">
        <p className="eyebrow">Step {step} of 4</p>
        <h2>{progressLabel}</h2>
      </div>

      {step === 1 ? (
        <div className="card stack">
          <label>Category</label>
          {loadingCategories ? (
            <p className="subtext">Loading available services…</p>
          ) : categories.length === 0 ? (
            <p className="subtext">No services are available right now.</p>
          ) : (
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value, category: e.target.options[e.target.selectedIndex].text, subcategory: '', otherDetails: '' })}>
              <option value="">Choose a category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          )}
          <label>Subcategory</label>
          {selectedCategory ? (
            <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value, otherDetails: '' })}>
              <option value="">Choose a subcategory</option>
              {subcategoryOptions.map((subcategory) => <option key={subcategory} value={subcategory}>{subcategory}</option>)}
            </select>
          ) : (
            <p className="subtext">Choose a category first.</p>
          )}
          <button className="primary-btn" onClick={() => setStep(form.subcategory ? 2 : 1)}>Next</button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="card stack">
          {form.subcategory === 'Other' ? (
            <>
              <label>Describe your requirement</label>
              <textarea value={form.otherDetails} onChange={(e) => setForm({ ...form, otherDetails: e.target.value })} rows="4" placeholder="Tell us what you need" />
              <label>Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows="4" placeholder="Enter your address" />
            </>
          ) : (
            <>
              <label>Address</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows="4" placeholder="Enter your address" />
            </>
          )}
          <button className="primary-btn" onClick={() => setStep(3)}>Next</button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="card stack">
          <label>Date & Time</label>
          <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
          <label>Payment</label>
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option>Cash on Delivery</option>
            <option>Online Payment</option>
          </select>
          <button className="primary-btn" onClick={() => setStep(4)}>Next</button>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="card stack">
          <h3>Confirm booking</h3>
          <div className="summary-box">
            <p><strong>Service:</strong> {form.category || 'Not selected'}</p>
            <p><strong>Subcategory:</strong> {form.subcategory || 'Not selected'}</p>
            <p><strong>Address:</strong> {form.address || 'Not provided'}</p>
            <p><strong>Time:</strong> {form.scheduledAt || 'Not selected'}</p>
            <p><strong>Payment:</strong> {form.paymentMethod}</p>
          </div>
          <p className="subtext">Your request will be sent to the owner for review and manual worker assignment.</p>
          {error ? <p className="message">{error}</p> : null}
          <button className="primary-btn" disabled={isSubmitting} onClick={submitBooking}>{isSubmitting ? 'Creating booking…' : 'Confirm booking'}</button>
        </div>
      ) : null}
    </div>
  );
}

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storage = localStorage.getItem('quickfix-customer');
    if (storage) {
      const parsed = JSON.parse(storage);
      fetch(`${API_BASE}/api/bookings/customer/${parsed.id}`)
        .then((response) => response.json())
        .then((data) => {
          setBookings(data || []);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="page">
      <h2>Booking history</h2>
      {loading ? (
        <div className="card"><p className="subtext">Loading your bookings…</p></div>
      ) : bookings.length === 0 ? (
        <div className="card">
          <p className="subtext">No bookings yet. Once you confirm a service, your booking history will appear here.</p>
          <Link className="primary-btn" to="/book">Book a service</Link>
        </div>
      ) : (
        bookings.map((booking) => (
          <div className="card stack" key={booking.id}>
            <div className="booking-header">
              <div>
                <p><strong>{booking.subcategory}</strong></p>
                <p className="subtext">{booking.address}</p>
              </div>
              <span className={`status-pill ${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>{booking.status}</span>
            </div>
            {booking.otherDetails ? <p className="subtext"><strong>Details:</strong> {booking.otherDetails}</p> : null}
            <p className="subtext">Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</p>
            {booking.assignedWorkerName ? (
              <div className="worker-card">
                <img className="worker-photo" src={booking.assignedWorkerPhoto} alt={booking.assignedWorkerName} />
                <div>
                  <p><strong>{booking.assignedWorkerName}</strong></p>
                  <p className="subtext">{booking.assignedWorkerExperience}</p>
                  <p className="subtext">{booking.assignedWorkerPhone}</p>
                  <p className="subtext">ETA: {booking.estimatedArrivalAt ? new Date(booking.estimatedArrivalAt).toLocaleString() : 'Preparing'}</p>
                </div>
              </div>
            ) : (
              <p className="subtext">Waiting for owner assignment.</p>
            )}
          </div>
        ))
      )}
      {location.state?.message ? <p className="message">{location.state.message}</p> : null}
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/book" element={<BookingFlow />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </div>
  );
}
