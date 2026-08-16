import React, { useState } from 'react';
import './styles.css';

// Hero Banner Component with Logo
const HeroBanner = () => (
  <div className="hero-banner">
    <div className="hero-content">
      {/* LOGO - Replace /quickfix-logo.png with your logo file path */}
      <div className="hero-logo">
        <img src="/quickfix-logo.png" alt="QuickFix Logo" onError={(e) => {
          e.target.style.display = 'none';
        }} />
      </div>
      
      <h1 className="hero-quickfix">QUICKFIX</h1>
      <h2 className="hero-subtitle">Home services, made easy.</h2>
      <p className="hero-description">Book trusted professionals for your home.</p>
    </div>
  </div>
);

// OTP Login Component - MAIN ENTRY SCREEN
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
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            maxLength="10"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            required
          />
          <button type="submit" className="btn-otp">Get OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="login-form">
          <p className="otp-message">Enter OTP sent to {phone}</p>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
          />
          <button type="submit" className="btn-otp">Verify & Login</button>
          <button 
            type="button" 
            className="btn-back"
            onClick={() => {
              setShowOTP(false);
              setOtp('');
            }}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};

// Services Overview - Click to explore
const ServicesOverview = ({ onSelectService }) => {
  const services = [
    { id: 1, name: 'Electrical', icon: '⚡' },
    { id: 2, name: 'Plumbing', icon: '🚰' },
    { id: 3, name: 'AC & Appliances', icon: '❄️' },
    { id: 4, name: 'Home Help', icon: '🏠' },
    { id: 5, name: 'Home Renovation', icon: '🔧' },
    { id: 6, name: 'Moving & Packing', icon: '📦' },
    { id: 7, name: 'Security', icon: '🔐' }
  ];

  return (
    <div className="services-overview-section">
      <h3>Explore Services</h3>
      <p className="services-subtitle">View all our services - Click to explore</p>
      <div className="services-grid">
        {services.map(service => (
          <div
            key={service.id}
            className="service-card"
            onClick={() => onSelectService(service)}
          >
            <div className="service-icon">{service.icon}</div>
            <div className="service-name">{service.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// SubServices Overview - View only
const SubServicesOverview = ({ service, onBack }) => {
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
    <div className="subservices-view">
      <div className="view-header">
        <button className="btn-back-nav" onClick={onBack}>← Back</button>
        <h3>{service.name}</h3>
      </div>
      
      <p className="view-subtitle">Available services - Click to book</p>
      
      <div className="subservices-list">
        {(subservices[service.name] || []).map((sub, idx) => (
          <div key={idx} className="subservice-item">
            <div className="subservice-icon">{service.icon}</div>
            <div className="subservice-details">
              <h4>{sub}</h4>
              <p>Professional service in Salem</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Booking Interface - Only after OTP
const BookingInterface = ({ user, onBook, onLogout }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    description: ''
  });

  const services = [
    { id: 1, name: 'Electrical', icon: '⚡' },
    { id: 2, name: 'Plumbing', icon: '🚰' },
    { id: 3, name: 'AC & Appliances', icon: '❄️' },
    { id: 4, name: 'Home Help', icon: '🏠' },
    { id: 5, name: 'Home Renovation', icon: '🔧' },
    { id: 6, name: 'Moving & Packing', icon: '📦' },
    { id: 7, name: 'Security', icon: '🔐' }
  ];

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (selectedService && bookingData.date && bookingData.time) {
      onBook({
        service: selectedService.name,
        icon: selectedService.icon,
        date: bookingData.date,
        time: bookingData.time,
        description: bookingData.description
      });
      setSelectedService(null);
      setBookingData({ service: '', date: '', time: '', description: '' });
    }
  };

  if (selectedService) {
    return (
      <div className="booking-form-container">
        <div className="booking-header">
          <button className="btn-back-nav" onClick={() => setSelectedService(null)}>← Back</button>
          <h3>Book {selectedService.name}</h3>
        </div>

        <form onSubmit={handleSubmitBooking} className="booking-form">
          <div className="form-group">
            <label>Service Type</label>
            <input 
              type="text" 
              value={selectedService.name} 
              disabled 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Preferred Date</label>
            <input 
              type="date" 
              value={bookingData.date}
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Preferred Time</label>
            <input 
              type="time" 
              value={bookingData.time}
              onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Additional Details (Optional)</label>
            <textarea 
              value={bookingData.description}
              onChange={(e) => setBookingData({...bookingData, description: e.target.value})}
              placeholder="Tell us more about your service needs..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <button type="submit" className="btn-book-submit">Confirm Booking</button>
        </form>
      </div>
    );
  }

  return (
    <div className="booking-interface">
      <div className="booking-greeting">
        <h3>Welcome, {user.name}! 👋</h3>
        <p>Ready to book a service?</p>
      </div>

      <div className="location-info">
        📍 <strong>Salem, Tamil Nadu</strong>
      </div>

      <div className="booking-services">
        <h4>Select Service to Book</h4>
        <div className="book-services-grid">
          {services.map(service => (
            <div
              key={service.id}
              className="book-service-card"
              onClick={() => setSelectedService(service)}
            >
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

// My Bookings View
const MyBookingsView = ({ bookings, onClose }) => {
  return (
    <div className="my-bookings-view">
      <div className="bookings-header">
        <button className="btn-back-nav" onClick={onClose}>← Back</button>
        <h3>My Bookings</h3>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings-message">
          <p>No bookings yet. Book your first service!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, idx) => (
            <div key={idx} className="booking-history-card">
              <div className="booking-history-icon">{booking.icon}</div>
              <div className="booking-history-details">
                <h4>{booking.service}</h4>
                <p>📅 {booking.date} at {booking.time}</p>
                <p className="status-badge">Confirmed</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('booking'); // 'booking', 'service-overview', 'subservice-overview', 'bookings'
  const [selectedService, setSelectedService] = useState(null);
  const [bookings, setBookings] = useState([
    {
      service: 'Electrical Wiring',
      icon: '⚡',
      date: '2024-08-20',
      time: '10:00 AM'
    }
  ]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('booking');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('booking');
    setSelectedService(null);
  };

  const handleBookService = (bookingInfo) => {
    setBookings([...bookings, bookingInfo]);
    setCurrentView('booking');
    alert('✅ Booking confirmed! We will contact you shortly.');
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setCurrentView('subservice-overview');
  };

  // NOT LOGGED IN - Show Hero + Login
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <HeroBanner />
        <LoginSection onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // LOGGED IN - Show Top Bar + Current View
  return (
    <div className="app-container app-logged-in">
      <div className="top-bar">
        <button className="btn-menu">☰</button>
        <h1 className="app-title">QuickFix</h1>
        <button 
          className="btn-profile" 
          onClick={() => setCurrentView(currentView === 'bookings' ? 'booking' : 'bookings')}
        >
          📋
        </button>
      </div>

      {/* Services Overview - Educational */}
      {currentView === 'service-overview' && (
        <div className="container">
          <ServicesOverview onSelectService={handleSelectService} />
        </div>
      )}

      {/* Subservices Overview - Educational */}
      {currentView === 'subservice-overview' && selectedService && (
        <div className="container">
          <SubServicesOverview 
            service={selectedService}
            onBack={() => setCurrentView('service-overview')}
          />
        </div>
      )}

      {/* My Bookings */}
      {currentView === 'bookings' && (
        <div className="container">
          <MyBookingsView 
            bookings={bookings}
            onClose={() => setCurrentView('booking')}
          />
        </div>
      )}

      {/* Main Booking Interface */}
      {currentView === 'booking' && (
        <div className="container">
          <BookingInterface 
            user={user}
            onBook={handleBookService}
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
}
