import React, { useState } from 'react';
import './styles.css';

const HeroBanner = () => (
  <div className="hero-banner">
    <div className="hero-content">
      <div className="hero-logo">
        <img src="/quickfix-logo.png" alt="QuickFix Logo" onError={(e) => e.target.style.display = 'none'} />
      </div>
      <h1 className="hero-quickfix">QUICKFIX</h1>
      <h2 className="hero-subtitle">Home services, made easy.</h2>
      <p className="hero-description">Book trusted professionals for your home.</p>
    </div>
  </div>
);

const LoginSection = ({ onLoginSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const handleGetOTP = (e) => {
    e.preventDefault();
    if (name && phone.length === 10) {
      setShowOTP(true);
      alert('OTP sent to ' + phone);
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      onLoginSuccess({ name, phone });
    } else {
      alert('Invalid OTP. Try 123456');
    }
  };

  return (
    <div className="login-section">
      <h3>Customer Login</h3>
      {!showOTP ? (
        <form onSubmit={handleGetOTP} className="login-form">
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="tel" placeholder="Phone Number" maxLength="10" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} required />
          <button type="submit" className="btn-otp">Get OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="login-form">
          <p className="otp-message">Enter OTP sent to {phone}</p>
          <input type="text" placeholder="Enter 6-digit OTP" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} required />
          <button type="submit" className="btn-otp">Verify & Login</button>
          <button type="button" className="btn-back" onClick={() => { setShowOTP(false); setOtp(''); }}>Back</button>
        </form>
      )}
    </div>
  );
};

const SubcategoryView = ({ service, onBack, onBook }) => {
  const subservices = {
    'Electrical': ['Wiring', 'Installation', 'Repair', 'Maintenance'],
    'Plumbing': ['Leakage Fix', 'Pipe Installation', 'Drain Cleaning', 'Water Heating'],
    'AC & Appliances': ['AC Service', 'Refrigerator Repair', 'Washing Machine', 'Microwave'],
    'Home Help': ['Cooking', 'Cleaning', 'Laundry', 'Babysitting'],
    'Home Renovation': ['Painting', 'Flooring', 'Carpentry', 'Tile Work'],
    'Moving & Packing': ['House Shifting', 'Office Relocation', 'Packing', 'Loading'],
    'Security': ['CCTV Installation', 'Alarm System', 'Door Lock', 'Safe Installation']
  };

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <button className="btn-back-nav" onClick={onBack}>← Back</button>
        <h3>Subcategories - {service.name}</h3>
      </div>
      <div className="subservices-list">
        {(subservices[service.name] || []).map((sub, idx) => (
          <div key={idx} className="subservice-item">
            <div className="subservice-icon">{service.icon}</div>
            <div className="subservice-details">
              <h4>{sub}</h4>
              <p>Professional service in Salem</p>
            </div>
            <button className="btn-book" onClick={() => onBook({ service: sub, icon: service.icon })}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MyBookingsView = ({ bookings, onClose }) => {
  return (
    <div className="my-bookings-view">
      <div className="bookings-header">
        <button className="btn-back-nav" onClick={onClose}>← Back</button>
        <h3>My Bookings</h3>
      </div>
      {bookings.length === 0 ? (
        <div className="no-bookings-message"><p>No bookings yet! Start booking services.</p></div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, idx) => (
            <div key={idx} className="booking-history-card">
              <div className="booking-history-icon">{booking.icon}</div>
              <div className="booking-history-details">
                <h4>{booking.service}</h4>
                <p>📅 Booked on {new Date().toLocaleDateString()}</p>
                <p className="status-badge">Confirmed ✓</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BookingInterface = ({ user, onBook, onLogout }) => {
  const [selectedService, setSelectedService] = useState(null);
  
  const services = [
    { id: 1, name: 'Electrical', icon: '⚡' },
    { id: 2, name: 'Plumbing', icon: '🚰' },
    { id: 3, name: 'AC & Appliances', icon: '❄️' },
    { id: 4, name: 'Home Help', icon: '🏠' },
    { id: 5, name: 'Home Renovation', icon: '🔧' },
    { id: 6, name: 'Moving & Packing', icon: '📦' },
    { id: 7, name: 'Security', icon: '🔐' }
  ];

  if (selectedService) {
    return (
      <div className="container">
        <SubcategoryView 
          service={selectedService}
          onBack={() => setSelectedService(null)}
          onBook={(booking) => {
            onBook(booking);
            setSelectedService(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="booking-greeting">
        <h3>Welcome, {user.name}! 👋</h3>
        <p>Ready to book a service?</p>
      </div>

      <div className="location-info">📍 Salem, Tamil Nadu</div>

      <div className="booking-services">
        <h4>Select Service to Book</h4>
        <div className="book-services-grid">
          {services.map(service => (
            <div key={service.id} className="book-service-card" onClick={() => setSelectedService(service)}>
              <div className="book-service-icon">{service.icon}</div>
              <div className="book-service-name">{service.name}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="btn-logout" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showBookings, setShowBookings] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setShowBookings(false);
  };

  const handleBook = (booking) => {
    setBookings([...bookings, booking]);
    alert('✅ Booking confirmed! We will contact you shortly.');
  };

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <HeroBanner />
        <LoginSection onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app-container app-logged-in">
      <div className="top-bar">
        <button className="btn-menu">☰</button>
        <h1 className="app-title">QuickFix</h1>
        <button className="btn-profile" onClick={() => setShowBookings(!showBookings)}>📋</button>
      </div>

      <div className="container">
        {showBookings ? (
          <MyBookingsView bookings={bookings} onClose={() => setShowBookings(false)} />
        ) : (
          <BookingInterface user={user} onBook={handleBook} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}