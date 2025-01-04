import React from 'react';
import './Footer.css'; // Add some CSS for styling if needed

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h3>AppSumo</h3>
          <p>Part of the Sumo family with TidyCal, FiveTaco, and SendFox.</p>
          <div className="footer-socials">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Join Plus</a></li>
            <li><a href="#">Help center</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Privacy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>AppSumo</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Affiliates</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Learn</h4>
          <ul>
            <li><a href="#">How to start an online business</a></li>
            <li><a href="#">What is the creator economy?</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Scroll to top</p>
      </div>
    </footer>
  );
}

export default Footer;
