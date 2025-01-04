import React from "react";
import "./Footer.css"; // Import CSS file for styling
import {
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import LOGOFULL from "../../../assets/IT Portfolios PNG .png";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white d-flex justify-content-center">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 col-md-4 d-flex flex-column align-items-center">
            <img
              src={LOGOFULL}
              alt="IT Portfolio Logo"
              className="footer-logo w-20 h-50"
            />
            <div>
              <p className="content-footer m-auto">Your trusted partner for managing your digital assets.</p>
            </div>
          </div>

          <div className="col-12 col-md-4 d-flex flex-column  ContactUs">
            <h3>Contact Us</h3>
            <address>
              1234 Tech Lane
              <br />
              Silicon Valley, CA 94043
              <br />
              United States
            </address>
          </div>

          {/* Social Media Icons Section (Center aligned for small screens) */}
          <div className="col-12 col-md-4 d-flex flex-column ">
            <div className="social-icons mb-3">
              <p className="social-media-heading">Social Media</p>
              <a href="#" className="text-white mx-2">
                <FaYoutube />
              </a>
              <a href="#" className="text-white mx-2">
                <FaFacebook />
              </a>
              <a href="#" className="text-white mx-2">
                <FaInstagram />
              </a>
              <a href="#" className="text-white mx-2">
                <FaTwitter />
              </a>
              <a href="#" className="text-white mx-2">
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>
      </div>
      <button
        className="scroll-to-top btn btn-secondary btn-sm"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <span className="scroll-icon">↑</span>
        {/* Tooltip */}
        <span className="tooltip-text">Scroll to top</span>
      </button>
    </footer>
  );
};

export default Footer;
