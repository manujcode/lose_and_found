# Admin Dashboard for Lost and Found Application

This folder contains components for the admin dashboard functionality of the Lost and Found application.

## Features

- **Admin Item Manager**: Allows admins to view and delete both lost and found items
- **Delivered Items Manager**: Enables admins to view and manage delivered items (both lost and found)
- **Admin Authentication**: Only users with emails listed in the admin email list can access the admin dashboard
- **Search & Filter**: Admins can search for items by title, description, or reporter name and filter by category

## Components

1. **AdminDashboard.jsx**: The main dashboard component that displays the admin interface
2. **AdminItemManager.jsx**: Component for managing lost and found items
3. **AdminDeliveredItems.jsx**: Component for managing delivered items
4. **AdminRoute.jsx**: Route protection component that verifies admin access

## How to Add Admin Users

Currently, admin access is controlled by a list of authorized email addresses defined in two files:

1. `src/AppForAdmin/AdminRoute.jsx`
2. `src/AppAfterLogin/Navbar.jsx`

To add an admin user:

1. Add the user's email to the `ADMIN_EMAILS` array in both files:

```javascript
const ADMIN_EMAILS = [
  'admin@example.com',
  'your.email@example.com', // Add new admin email here
];
```

2. In a production environment, you should implement a more secure method for admin authentication, such as:
   - Storing admin roles in your database
   - Using environment variables to store admin emails
   - Implementing a proper role-based access control system

## Accessing the Admin Dashboard

Users with admin privileges will see an "Admin" button in the navigation bar. Clicking this button will redirect them to the admin dashboard at `/admin`.

For testing purposes, add your own email to the `ADMIN_EMAILS` array to gain admin access.

## Managing Delivered Items

The admin dashboard includes a dedicated section for managing delivered items:

1. Navigate to the "Delivered Items" tab in the admin dashboard
2. View delivered items in either a card (mobile) or table (desktop) layout
3. Search for specific delivered items using the search bar
4. Delete delivered items when they are no longer needed
5. View delivery details including:
   - Delivery reason
   - Delivery date
   - Item details
   - Reporter information

The delivered items section provides a clean interface for managing completed transactions and maintaining the database. 