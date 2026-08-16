@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Poppins', sans-serif; background: #f5f5f5; }

.app { min-height: 100vh; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); }

/* HERO BANNER */
.hero-banner {
  background: linear-gradient(135deg, #0052CC 0%, #0042A0 100%);
  padding: 40px 20px;
  text-align: center;
  border-radius: 0 0 24px 24px;
}

.hero-logo img { max-width: 80px; max-height: 80px; margin-bottom: 12px; }

.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 4px;
  color: white;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.hero-description {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
}

/* LOGIN */
.login-box {
  background: white;
  margin: 30px auto;
  padding: 30px;
  border-radius: 16px;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.login-box h3 { font-size: 24px; font-weight: 700; margin-bottom: 24px; }

.login-box form { display: flex; flex-direction: column; gap: 16px; }

.login-box input {
  padding: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.btn-otp {
  padding: 14px;
  background: linear-gradient(135deg, #0052CC 0%, #003399 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
}

.btn-otp:hover { transform: translateY(-2px); }

.btn-back {
  padding: 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

/* TOP BAR */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.btn-menu, .btn-profile {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.app-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #0052CC, #FF6B35);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.container { max-width: 800px; margin: 0 auto; padding: 20px; }

/* GREETING & LOCATION */
.greeting-box {
  background: linear-gradient(135deg, #0052CC, #003399);
  color: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.greeting-box h3 { font-family: 'Montserrat', sans-serif; font-size: 24px; margin: 0 0 8px 0; }

.location {
  background: white;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  color: #0052CC;
}

/* SERVICES */
.services-box {
  background: white;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.services-box h4 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.service-btn {
  background: linear-gradient(135deg, #F0F7FF 0%, #E0EEFF 100%);
  border: 2px solid transparent;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
}

.service-btn:hover {
  border-color: #0052CC;
  transform: scale(1.05);
}

.service-icon { font-size: 36px; margin-bottom: 8px; }
.service-name { font-weight: 600; color: #0052CC; }

/* SUBCATEGORIES */
.subcat-box {
  background: white;
  padding: 24px;
  border-radius: 16px;
}

.subcat-box h3 { font-family: 'Montserrat', sans-serif; font-size: 24px; margin-bottom: 8px; }

.subcat-subtitle { color: #6b7280; margin-bottom: 20px; }

.subcat-buttons { display: flex; flex-direction: column; gap: 12px; }

.subcat-btn {
  background: #0052CC;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
}

.subcat-btn:hover { background: #003399; }

/* BOOKINGS */
.bookings-box {
  background: white;
  padding: 24px;
  border-radius: 16px;
}

.bookings-box h3 { font-family: 'Montserrat', sans-serif; font-size: 24px; margin: 16px 0; }

.booking-item {
  background: linear-gradient(135deg, #F0F7FF 0%, #E0EEFF 100%);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #0052CC;
  margin-bottom: 12px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.booking-item span:first-child { font-size: 36px; }
.booking-item h4 { font-weight: 600; margin-bottom: 4px; }
.booking-item p { font-size: 13px; color: #6b7280; }
.badge { display: inline-block; background: #10B981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 4px; }

/* LOGOUT */
.btn-logout {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
}

.btn-logout:hover { background: #e5e7eb; }