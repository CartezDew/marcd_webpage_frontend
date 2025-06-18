import { Link, useLocation } from 'react-router-dom';
import { FaTruck, FaMapMarkedAlt, FaComments, FaClipboardList } from 'react-icons/fa';

function Nav() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-brand">
        <FaTruck style={{ marginRight: '0.5rem' }} />
        Marc'd Trucking
      </Link>
      
      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            <FaMapMarkedAlt style={{ marginRight: '0.5rem' }} />
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/truck-stops" 
            className={isActive('/truck-stops') ? 'active' : ''}
          >
            <FaTruck style={{ marginRight: '0.5rem' }} />
            Truck Stops
          </Link>
        </li>
        <li>
          <Link 
            to="/feedback" 
            className={isActive('/feedback') ? 'active' : ''}
          >
            <FaComments style={{ marginRight: '0.5rem' }} />
            Feedback
          </Link>
        </li>
        <li>
          <Link 
            to="/survey" 
            className={isActive('/survey') ? 'active' : ''}
          >
            <FaClipboardList style={{ marginRight: '0.5rem' }} />
            Survey
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
