# Admin Dashboard Documentation

## Overview

The Marc'd Admin Dashboard provides a comprehensive interface for managing contact submissions and waitlist entries. It features a modern, responsive design that matches the brand styling of the main website.

## Features

### 🔐 Authentication
- Secure login system with token-based authentication
- Protected routes that redirect to login if not authenticated
- Automatic logout functionality

### 📊 Dashboard Overview
- Real-time statistics showing total contact submissions and waitlist entries
- Animated cards with hover effects
- Responsive design that works on all devices

### 📋 Contact Submissions Management
- View all contact form submissions in a sortable table
- Search functionality to filter submissions
- Detailed view modal for each submission
- Status indicators (Read/Unread)
- Feedback type categorization with color-coded chips

### 👥 Waitlist Entries Management
- View all waitlist signups in a clean table format
- Search functionality to find specific entries
- Detailed view modal for each entry
- Export capabilities

### 🔍 Advanced Features
- Real-time search across all fields
- Pagination for large datasets
- Responsive table design
- Loading states and error handling
- Smooth animations and transitions

## Access

### Demo Credentials
- **Email:** admin@marcd.com
- **Password:** admin123

### URLs
- **Login Page:** `/signin` (shared with regular users)
- **Dashboard:** `/admin/dashboard`

## API Endpoints

The dashboard connects to the following Django backend endpoints:

### Contact Submissions
- `GET /api/contactus/` - Fetch all contact submissions
- `PATCH /api/contactus/{id}/` - Update contact status
- `DELETE /api/contactus/{id}/` - Delete contact submission

### Waitlist Entries
- `GET /api/waitlist-entries/` - Fetch all waitlist entries
- `DELETE /api/waitlist-entries/{id}/` - Delete waitlist entry

### Authentication
- Admin authentication is handled through the `/signin` route
- `POST /api/admin/logout/` - Admin logout

## File Structure

```
src/
├── pages/
│   ├── SignIn.jsx              # Shared login page (users + admins)
│   └── AdminDashboard.jsx      # Main dashboard component
├── components/
│   └── ProtectedRoute.jsx      # Route protection component
├── services/
│   └── adminApi.js            # API service functions
└── styles/
    └── admin.css              # Admin-specific styles
```

## Components

### SignIn (Shared Login)
- Clean, modern login form for both users and admins
- Password visibility toggle
- Error handling and validation
- Admin credentials: admin@marcd.com / admin123
- Automatic redirect to appropriate dashboard based on credentials

### AdminDashboard
- Tabbed interface for different data types
- Statistics cards with animations
- Searchable and paginated data tables
- Detail modals for viewing full information
- Responsive design for mobile devices

### ProtectedRoute
- Wraps components that require authentication
- Redirects to login if not authenticated
- Checks for valid admin token

## Styling

The admin dashboard uses a consistent design system:

### Color Palette
- **Primary Blue:** #3b82f6
- **Success Green:** #22c55e
- **Error Red:** #ef4444
- **Warning Orange:** #f59e0b
- **Background:** Dark gradient (#0f0f23 to #16213e)
- **Text:** White and light gray (#a1a1aa)

### Typography
- Modern, clean font stack
- Consistent hierarchy with proper spacing
- Responsive font sizes

### Animations
- Smooth fade-in animations
- Hover effects on interactive elements
- Loading states with spinners
- Transition effects for better UX

## Security Features

1. **Token-based Authentication:** Uses JWT tokens stored in localStorage
2. **Protected Routes:** All admin pages require authentication
3. **Automatic Logout:** Clears tokens on logout
4. **API Security:** All API calls include authentication headers

## Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Prerequisites
- Node.js 16+
- React 18+
- Material-UI 5+
- Framer Motion

### Installation
1. Ensure all dependencies are installed
2. Import the admin CSS file in your main App component
3. Add the admin routes to your router configuration
4. Set up the backend API endpoints

### Customization
- Modify colors in `admin.css`
- Update API endpoints in `adminApi.js`
- Customize table columns in `AdminDashboard.jsx`
- Add new features by extending the existing components

## Future Enhancements

- [ ] Export data to CSV/Excel
- [ ] Bulk actions (delete multiple entries)
- [ ] Advanced filtering options
- [ ] Real-time notifications
- [ ] User management for multiple admins
- [ ] Activity logs
- [ ] Data analytics and charts
- [ ] Email integration for responses

## Support

For technical support or questions about the admin dashboard, please contact the development team. 