# Demo Login System

This application includes a demo login system for demonstration purposes.

## How to Use

### Login Credentials

- **Email**: Any valid email address (e.g., `demo@example.com`, `user@test.com`)
- **Password**: `1234` (fixed password for all demo accounts)

### Features

1. **Demo Login**: Users can log in with any email address using the password "1234"
2. **24-Hour Session**: Login credentials expire after 24 hours
3. **Automatic Redirect**: Unauthenticated users are automatically redirected to the login page
4. **Persistent Sessions**: Login state is stored in localStorage and persists across browser sessions
5. **Logout Functionality**: Users can log out using the logout button in the sidebar

### User Experience

1. **First Visit**: When users first visit the application, they will be redirected to the login page
2. **Login Screen**: The login page shows a demo notice explaining the login credentials
3. **Dashboard Access**: After successful login, users are redirected to the main dashboard
4. **Session Management**: The application automatically checks for valid sessions on page load
5. **Logout**: Users can log out using the logout button in the sidebar, which clears their session

### Technical Implementation

- **Authentication Context**: Uses React Context for global authentication state management
- **Protected Routes**: All main application routes are protected and require authentication
- **Local Storage**: Session data is stored in localStorage with expiration timestamps
- **Automatic Expiration**: Sessions automatically expire after 24 hours
- **Loading States**: Shows loading spinners while checking authentication status

### Security Notes

⚠️ **This is a demo system and should not be used in production!**

- The password is hardcoded and visible in the source code
- No real authentication or encryption is implemented
- Session data is stored in localStorage (not secure for production)
- This system is designed for demonstration purposes only

### Files Modified/Created

- `src/contexts/AuthContext.jsx` - Authentication context and logic
- `src/components/ProtectedRoute.jsx` - Route protection component
- `src/pages/Login.jsx` - Updated login component with demo functionality
- `src/components/Sidebar.tsx` - Added logout button and user info display
- `src/pages/Profile.tsx` - Updated to show logged-in user information
- `src/pages/DemoRedirect.jsx` - Demo redirect component
- `src/App.jsx` - Updated routing with authentication protection
