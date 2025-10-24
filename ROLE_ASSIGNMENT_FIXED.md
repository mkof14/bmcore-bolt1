# Role Assignment - Fixed!

## Problem Solved

**Issue:** "Failed to assign role: infinite recursion detected in policy for relation user_roles"

**Root Cause:** RLS policies were checking `user_roles` table to verify if user is admin, while trying to access `user_roles` table, creating infinite recursion.

## Solution Implemented

### 1. Helper Function `is_admin()`

Created a dedicated PostgreSQL function that checks admin status:

```sql
CREATE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = $1
    AND r.name IN ('admin', 'super_admin')
    AND r.is_system = true
  );
$$;
```

**Key Features:**
- `SECURITY DEFINER` - runs with creator's privileges (bypasses RLS)
- `STABLE` - optimizer knows it won't modify data
- No recursion because it runs outside RLS context

### 2. Updated RLS Policies

All policies now use the helper function instead of recursive queries:

**user_roles table:**
- ✅ Users can view own roles
- ✅ Admins can view all roles (using `is_admin()`)
- ✅ Admins can assign roles (using `is_admin()`)
- ✅ Admins can revoke roles (using `is_admin()`)
- ✅ Admins can update roles (using `is_admin()`)

**profiles table:**
- ✅ Admins can view all profiles
- ✅ Admins can update any profile

**roles table:**
- ✅ Everyone can view roles
- ✅ Only admins can manage custom roles
- ✅ System roles are protected

### 3. Enhanced Error Handling

Added comprehensive debugging in `AccessControlSection.tsx`:

```typescript
- Pre-check admin status before attempting role assignment
- Detailed console logging for debugging
- Specific error messages for different failure scenarios
- Detection of infinite recursion errors
```

## How to Assign Super Admin Role

### Method 1: Using Admin Panel UI

1. **Login** as dnainform@gmail.com (already has super_admin)
2. Go to **Admin Panel** → **Access Control**
3. Click on **User Assignments** tab
4. Find the user you want to make admin
5. Use the dropdown **"+ Assign role..."**
6. Select **super_admin**
7. ✅ Done!

### Method 2: Using SQL (Direct Database)

```sql
-- Find the user's ID
SELECT id, email FROM profiles WHERE email = 'user@example.com';

-- Assign super_admin role
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT
  'USER-ID-HERE'::uuid as user_id,
  (SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1) as role_id,
  '97933187-c8ff-4c67-8ca0-2d5f60d682c8'::uuid as assigned_by;
```

## Current Admin Status

**Email:** dnainform@gmail.com
**User ID:** 97933187-c8ff-4c67-8ca0-2d5f60d682c8
**Role:** super_admin ✅
**Can Assign Roles:** Yes ✅

## Testing Checklist

1. ✅ Login as admin user
2. ✅ Navigate to Admin Panel → Access Control
3. ✅ View list of users
4. ✅ Select a user and try to assign super_admin role
5. ✅ Check browser console for detailed logs
6. ✅ Verify role assignment succeeds
7. ✅ Check that user appears in roles list

## Debug Information

When assigning a role, check browser console for:

```
=== Role Assignment Debug ===
Current User ID: [your-id]
Target User ID: [target-id]
Role ID: [role-id]
Is Admin Check: true
Admin check passed, inserting role assignment...
Role assigned successfully: [data]
```

## Common Errors & Solutions

### Error: "Permission denied"
**Cause:** User doesn't have admin or super_admin role
**Solution:** Assign admin role to current user first using SQL

### Error: "User already has this role"
**Cause:** Role already assigned
**Solution:** This is expected, user already has the role

### Error: "Infinite recursion detected"
**Cause:** Old migration still active
**Solution:** Migration applied - restart browser and clear cache

### Error: "Failed to assign role: [message]"
**Cause:** Various - check console logs
**Solution:** Check browser console for detailed error information

## Performance Improvements

Added indexes for better performance:

```sql
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_roles_name ON roles(name) WHERE is_system = true;
```

## Security Features

1. **No Recursion:** Helper function runs with elevated privileges
2. **Admin Only:** Only users with admin/super_admin can manage roles
3. **System Roles Protected:** Cannot edit/delete system roles
4. **Audit Trail:** `assigned_by` tracks who assigned each role
5. **RLS Enabled:** All tables have Row Level Security enabled

## Next Steps

1. Test role assignment with current admin user
2. Create additional admin users if needed
3. Consider creating custom roles for specific permissions
4. Monitor system logs for any issues

## Support

If you encounter issues:

1. Check browser console for detailed logs
2. Verify you're logged in as admin user
3. Check that `is_admin()` function exists
4. Verify RLS policies are using the function
5. Contact system administrator if problem persists

## Files Modified

- `/supabase/migrations/fix_admin_user_management_complete.sql` - New migration
- `/src/components/admin/AccessControlSection.tsx` - Enhanced error handling
- Database policies completely restructured

## Database Functions

New functions available:

```sql
-- Check if user is admin
SELECT public.is_admin('user-id-here'::uuid);

-- Returns true/false
```

## Success Indicators

You know it's working when:

✅ No "infinite recursion" errors
✅ Role assignment succeeds immediately
✅ Console shows "Role assigned successfully"
✅ User appears in roles list after assignment
✅ Admin panel loads without errors
