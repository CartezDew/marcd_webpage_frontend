import React from 'react';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import '../../styles/landing/footer.css';
import logo from '../../assets/Marc-d_Logo.png';

const Footer = () => {
    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <div className="footer-column">
                    <img src={logo} alt="Marc'd" className="footer-logo" />
                    <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                        Empowering safer, smarter parking for the road ahead.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-icon"><FaInstagram /></a>
                        <a href="#" className="social-icon"><FaFacebook /></a>
                        <a href="#" className="social-icon"><FaLinkedin /></a>
                        <a href="#" className="social-icon"><FaTwitter /></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul className="footer-links">
                        <li><a href="#">For Truckers</a></li>
                        <li><a href="#">For Facilitators</a></li>
                        <li><a href="#">For Tow Providers</a></li>
                        <li><a href="#">Safety & Security</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><a href="#">Our Story</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Legal</h4>
                    <ul className="footer-links">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} Marc'd. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
