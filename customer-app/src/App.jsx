import React, { useState } from 'react';
import './styles.css';

const App = () => {
  const [screen, setScreen] = useState('hero');
  const [otp, setOtp] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);

  const services = [
    { id: 1, name: 'Electrical', icon: '⚡' },
    { id: 2, name: 'Plumbing', icon: '🔧' },
    { id: 3, name: 'AC', icon: '❄️' },
    { id: 4, name: 'Home Help', icon: '🏠' },
    { id: 5, name: 'Renovation', icon: '🔨' },
    { id: 6, name: 'Moving', icon: '📦' },
    { id: 7, name: 'Security', icon: '🔒' }
  ];

  const subcategories = {
    'Electrical': ['Electrician', 'Fan Installation', 'Light Installation', 'Switch Repair', 'House Wiring', 'Other'],
    'Plumbing': ['Pipe Leakage', 'Tap Repair', 'Bathroom Fittings', 'Water Tank', 'Motor Repair', 'Other'],
    'AC': ['AC Service', 'AC Installation', 'AC Repair', 'Washing Machine', 'Refrigerator', 'Other'],
    'Home Help': ['Cleaning', 'Cooking', 'Maid', 'Gardening', 'Other'],
    'Renovation': ['Painting', 'Tiles', 'Wallpaper', 'Carpentry', 'Other'],
    'Moving': ['Movers', 'Packing', 'Home Shift', 'Office Shift', 'Driver', 'Other'],
    'Security': ['CCTV Install', 'CCTV Repair', 'Smart Lock', 'Security Guard', 'Alarm', 'Other']
  };

  const handleVerifyOtp = () => {
    if (otp === '123456') {
      setScreen('services');
      setOtp('');
    } else {
      alert('Invalid OTP. Please try 123456');
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setScreen('subcategories');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setScreen('booking');
  };

  const handleBook = () => {
    const booking = {
      id: Date.now(),
      service: selectedService.name,
      subcategory: selectedSubcategory,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      location: 'Salem'
    };
    setBookingHistory([booking, ...bookingHistory]);
    alert('✅ Booking confirmed!');
    setScreen('services');
    setSelectedService(null);
    setSelectedSubcategory(null);
  };

  const handleLogout = () => {
    setScreen('hero');
    setOtp('');
    setSelectedService(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="app">
      {/* Header */}
      {screen !== 'hero' && (
        <header className="header">
          <div className="header-left">
            <h1>QuickFix</h1>
          </div>
          <div className="header-right">
            <button 
              className="history-btn"
              onClick={() => setScreen('history')}
              title="Booking History"
            >
              📋
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>
      )}

      {/* Hero Screen */}
      {screen === 'hero' && (
        <div className="hero">
          <div className="hero-content">
            <div className="logo">⚙️</div>
            <h2>Home services, made easy</h2>
            <button 
              className="login-btn"
              onClick={() => setScreen('login')}
            >
              Login with OTP
            </button>
          </div>
        </div>
      )}

      {/* OTP Login Screen */}
      {screen === 'login' && (
        <div className="login-container">
          <div className="login-box">
            <h2>Login</h2>
            <p>Enter OTP (Test: 123456)</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="otp-input"
              maxLength="6"
              autoFocus
            />
            <button 
              className="verify-btn"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
            <button 
              className="back-btn"
              onClick={() => setScreen('hero')}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Services Screen */}
      {screen === 'services' && (
        <div className="services-container">
          <div className="location-bar">📍 Salem</div>
          <h2 className="services-title">Select a Service</h2>
          <div className="services-grid">
            {services.map(service => (
              <div
                key={service.id}
                className="service-card"
                onClick={() => handleServiceClick(service)}
              >
                <span className="service-icon">{service.icon}</span>
                <span className="service-name">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Screen */}
      {screen === 'subcategories' && selectedService && (
        <div className="subcategories-container">
          <div className="location-bar">📍 Salem</div>
          <h2 className="subcategories-title">{selectedService.name}</h2>
          <div className="subcategories-grid">
            {subcategories[selectedService.name].map((subcat, index) => (
              <button
                key={index}
                className="subcategory-btn"
                onClick={() => handleSubcategoryClick(subcat)}
              >
                {subcat}
              </button>
            ))}
          </div>
          <button 
            className="back-btn"
            onClick={() => setScreen('services')}
            style={{ marginTop: '20px' }}
          >
            ← Back to Services
          </button>
        </div>
      )}

      {/* Booking Screen */}
      {screen === 'booking' && selectedService && selectedSubcategory && (
        <div className="booking-container">
          <div className="location-bar">📍 Salem</div>
          <div className="booking-card">
            <h2>Confirm Booking</h2>
            <div className="booking-details">
              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Category:</strong> {selectedSubcategory}</p>
              <p><strong>Location:</strong> Salem</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
            </div>
            <button 
              className="book-btn"
              onClick={handleBook}
            >
              ✓ Confirm Booking
            </button>
            <button 
              className="back-btn"
              onClick={() => setScreen('subcategories')}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Booking History Screen */}
      {screen === 'history' && (
        <div className="history-container">
          <div className="location-bar">📍 Salem</div>
          <h2>📋 Booking History</h2>
          {bookingHistory.length === 0 ? (
            <p className="empty-history">No bookings yet. Start by selecting a service!</p>
          ) : (
            <div className="history-list">
              {bookingHistory.map(booking => (
                <div key={booking.id} className="history-item">
                  <h3>{booking.service} - {booking.subcategory}</h3>
                  <p>📅 <strong>Date:</strong> {booking.date}</p>
                  <p>🕐 <strong>Time:</strong> {booking.time}</p>
                  <p>📍 <strong>Location:</strong> {booking.location}</p>
                </div>
              ))}
            </div>
          )}
          <button 
            className="back-btn"
            onClick={() => setScreen('services')}
            style={{ marginTop: '20px' }}
          >
            ← Back to Services
          </button>
        </div>
      )}
    </div>
  );
};

export default App;