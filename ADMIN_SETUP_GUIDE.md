# Admin Setup Guide

## Overview

This guide explains how to set up and manage administrators in the BioMath Core platform.

## System Architecture

### Automatic Profile Creation

- **Trigger**: When a new user signs up via Supabase Auth, a profile is automatically created
- **Table**: `profiles` contains user information linked to `auth.users`
- **View**: `admin_users_view` provides a comprehensive view of users with their roles

### Role System

The platform has 4 system roles:

1. **super_admin** - Full system access with all permissions
2. **admin** - Manage content, users, and system settings
3. **editor** - Create and edit content
4. **viewer** - View-only access to content

## How to Assign Super Admin Role

### Option 1: Using SQL (First-time Setup)

If you need to manually assign super_admin to a user:

```sql
-- Find your user ID
SELECT id, email FROM profiles WHERE email = 'your-email@example.com';

-- Assign super_admin role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT
  'YOUR-USER-ID-HERE' as user_id,
  (SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1) as role_id,
  'YOUR-USER-ID-HERE' as assigned_by
WHERE NOT EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_id = 'YOUR-USER-ID-HERE'
  AND role_id = (SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1)
);
```

### Option 2: Using Admin Panel (Once you're admin)

1. Navigate to **Admin Panel** → **Access Control**
2. Go to **User Assignments** tab
3. Find the user in the list
4. Use the dropdown **"+ Assign role..."**
5. Select **super_admin**

## Access Control Features

### User Assignments Tab

**Features:**
- ✅ View all registered users with email and ID
- ✅ See current roles for each user
- ✅ Quick role assignment via dropdown menu
- ✅ Revoke roles with one click
- ✅ Search users by email, name, or ID
- ✅ View last login information

**Quick Role Assignment:**
- Each user card has a dropdown menu
- Only shows roles not yet assigned to the user
- Instant assignment - just select from the list

### Assign Role Modal

**Features:**
- 🟣 **System Roles** section with super_admin highlighted
- 🟢 **Custom Roles** section for user-created roles
- 📊 Shows number of users per role
- 🎨 Color-coded by role importance
- 📝 Full role descriptions

### Roles & Permissions Tab

**Features:**
- Create custom roles
- Assign granular permissions
- Edit role descriptions
- View users per role
- Cannot edit system roles

### Permission Matrix Tab

**Features:**
- View all available permissions
- Organized by category:
  - Content Management
  - User Management
  - System Administration
  - Email & Communications
  - Marketing & Documents

## Current Admin User

**Email:** dnainform@gmail.com
**Role:** super_admin ✅
**Status:** Active

## Common Issues & Solutions

### Users Not Visible

**Problem:** Admin panel shows "No users found"

**Solutions:**
1. Check if you're assigned admin or super_admin role
2. Verify RLS policies allow admins to view profiles
3. Check if profiles were created for auth.users

### Cannot Assign Roles

**Problem:** Role assignment fails

**Solutions:**
1. Ensure you have admin or super_admin role
2. Check RLS policies on user_roles table
3. Verify the role exists in the roles table

### Profile Not Created on Signup

**Problem:** New user signs up but no profile appears

**Solutions:**
1. Check if trigger `on_auth_user_created` exists
2. Verify function `handle_new_user()` is working
3. Run manual profile creation:

```sql
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT
  id,
  email,
  created_at,
  now()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

## Best Practices

### Security

1. **Limit Super Admins**: Only assign super_admin to trusted individuals
2. **Use Specific Roles**: Create custom roles for specific needs rather than giving admin to everyone
3. **Regular Audits**: Periodically review user roles and permissions
4. **Revoke Unused Access**: Remove roles from inactive users

### Role Assignment

1. **Start Small**: New users should get minimal permissions (viewer/editor)
2. **Escalate Gradually**: Increase permissions as trust is established
3. **Document Reasons**: Keep track of why roles were assigned
4. **Use Custom Roles**: Create role templates for common use cases

### User Management

1. **Monitor Activity**: Check last_sign_in_at regularly
2. **Clean Up**: Remove inactive users after 6-12 months
3. **Email Verification**: Ensure users verify their email
4. **Profile Completion**: Encourage users to complete their profiles

## Database Tables Reference

### profiles
- User profile information
- Linked to auth.users via id
- Contains email, name, country, privacy flags

### roles
- System and custom roles
- Contains name, description, permissions array
- System roles have is_system = true

### user_roles
- Links users to their roles
- Many-to-many relationship
- Tracks who assigned the role and when

### admin_users_view
- Aggregated view of users with roles
- Used by admin panel for user management
- Combines profiles, auth.users, and user_roles

## API Endpoints

The admin panel uses Supabase client to interact with:

- `admin_users_view` - Read user information
- `profiles` - Update user profiles
- `roles` - Manage roles
- `user_roles` - Assign/revoke roles

## Permissions System

Permissions are stored as an array of strings in roles.permissions:

**Example:**
```json
[
  "content.view",
  "content.create",
  "users.view",
  "system.analytics"
]
```

**Wildcard:**
- Super admins can have `["*"]` for all permissions

## Support

For issues or questions:
1. Check this guide first
2. Review database RLS policies
3. Check Supabase logs for errors
4. Contact system administrator
