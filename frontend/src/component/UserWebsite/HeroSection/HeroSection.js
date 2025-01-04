import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HeroSection.css';
import ImageTop from '../../../assets/person-on-laptop-lightbulbs2.jpg'

const HeroSection = () => {
  return (
    <section className="hero-section bg-light text-dark">
      <div className="container HeroContainer">
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-md-6 text-center text-md-start">
            <h1 className="display-4 fw-bold">
              <span className="text-primary">SMART</span> BUSINESS <br />
              WITH <span className="text-primary">SMART</span> PEOPLE
            </h1>
            <p className="lead mt-3">
              Grow your business to the next level to improve your business performance to stay competitive.
            </p>
            <button className="btn Discuss_button btn-lg mt-3">Let's Discuss</button>
            <div className="d-flex justify-content-center justify-content-md-start mt-4">
              <div className="me-4 text-center">
                <h3 className="fw-bold">10+</h3>
                <p>Years Experience</p>
              </div>
              <div className="me-4 text-center">
                <h3 className="fw-bold">891</h3>
                <p>Cases Solved</p>
              </div>
              <div className="text-center">
                <h3 className="fw-bold">263</h3>
                <p>Business Partners</p>
              </div>
            </div>
          </div>

          {/* Image with Overlay */}
          <div className="col-md-6 position-relative text-center">
            <img src={ImageTop} alt="Business Woman" className="img-fluid w-100 h-100vh" />
          </div>
        </div>

        {/* Services Section */}
<div className="row text-center mt-5">
  <div className="col-md-3 service-item">
    <i className="bi bi-briefcase-fill display-5 text-primary mb-2"></i>
    <h5 className="fw-bold">Business Planning</h5>
    <p className="service-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
  <div className="col-md-3 service-item">
    <i className="bi bi-piggy-bank-fill display-5 text-primary mb-2"></i>
    <h5 className="fw-bold">Financial Planning</h5>
    <p className="service-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
  <div className="col-md-3 service-item">
    <i className="bi bi-graph-up-arrow display-5 text-primary mb-2"></i>
    <h5 className="fw-bold">Digital Marketing</h5>
    <p className="service-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
  <div className="col-md-3 service-item">
    <i className="bi bi-bar-chart-line-fill display-5 text-primary mb-2"></i>
    <h5 className="fw-bold">Market Analysis</h5>
    <p className="service-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </div>
</div>
      </div>
    </section>
  );
};

export default HeroSection;