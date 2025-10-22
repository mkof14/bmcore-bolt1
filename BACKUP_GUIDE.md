# BioMath Core - Complete Backup & Version Control Guide

## Current Version: v1.0.0-pre-optimization (2025-10-22)

This document explains how to create a complete backup of your project and establish version control.

---

## 🎯 Quick Backup Commands

### Option 1: Initialize Git Repository (Recommended)

```bash
# Navigate to project directory
cd /path/to/project

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: v1.0.0-pre-optimization - Complete BioMath Core before optimization"

# Create a tag for this version
git tag -a v1.0.0-pre-optimization -m "Stable version before SEO and UX optimizations"

# Create a backup branch
git branch backup/v1.0.0-pre-optimization

# Connect to GitHub (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/biomathcore.git

# Push to GitHub
git push -u origin main

# Push the tag
git push origin v1.0.0-pre-optimization

# Push the backup branch
git push origin backup/v1.0.0-pre-optimization
```

### Option 2: Create Local Backup Archive

```bash
# Create a timestamped backup
tar -czf biomath-core-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.env' \
  .

# Or using zip
zip -r biomath-core-backup-$(date +%Y%m%d-%H%M%S).zip . \
  -x "node_modules/*" "dist/*" ".env"
```

---

## 📋 Complete Backup Checklist

### 1. Code Backup

- [ ] **Git Repository**
  ```bash
  git init
  git add .
  git commit -m "Initial commit - v1.0.0-pre-optimization"
  git tag v1.0.0-pre-optimization
  ```

- [ ] **GitHub/GitLab/Bitbucket**
  - Create remote repository
  - Push code: `git push -u origin main`
  - Push tags: `git push --tags`
  - Verify in web interface

- [ ] **Local Archive**
  - Create .tar.gz or .zip
  - Store on external drive
  - Upload to cloud storage (Google Drive, Dropbox)

### 2. Database Backup (Supabase)

#### Method A: Supabase Dashboard (Easiest)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/txnwvaqzmtlhefcxilfu/database/backups)
2. Navigate to **Database** → **Backups**
3. Click **"Create backup"**
4. Download the backup file

#### Method B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref txnwvaqzmtlhefcxilfu

# Dump database
supabase db dump -f backup-$(date +%Y%m%d).sql

# Dump only schema
supabase db dump --schema-only -f schema-$(date +%Y%m%d).sql

# Dump only data
supabase db dump --data-only -f data-$(date +%Y%m%d).sql
```

#### Method C: Direct PostgreSQL Dump
```bash
# Get connection string from Supabase Dashboard
# Settings → Database → Connection string (URI)

# Full backup
pg_dump "postgresql://postgres:[PASSWORD]@db.txnwvaqzmtlhefcxilfu.supabase.co:5432/postgres" \
  > backup-full-$(date +%Y%m%d).sql

# Compressed backup
pg_dump "postgresql://postgres:[PASSWORD]@db.txnwvaqzmtlhefcxilfu.supabase.co:5432/postgres" \
  | gzip > backup-$(date +%Y%m%d).sql.gz
```

### 3. Environment Variables Backup

```bash
# Copy .env file to secure location
cp .env .env.backup

# Or create encrypted backup
gpg -c .env  # Creates .env.gpg (encrypted)
```

**IMPORTANT**: Store `.env` backup in a **secure location**, never in git!

### 4. Migration Files Backup

```bash
# Already in git, but create separate backup
tar -czf migrations-backup-$(date +%Y%m%d).tar.gz supabase/migrations/
```

### 5. Assets Backup (Images, Logos)

```bash
# Backup public folder
tar -czf public-assets-backup-$(date +%Y%m%d).tar.gz public/
```

---

## 🔄 Restore Procedures

### Restore Code from Git

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/biomathcore.git
cd biomathcore

# Checkout specific version
git checkout v1.0.0-pre-optimization

# Install dependencies
npm install

# Copy environment variables
cp .env.backup .env
```

### Restore Database from Backup

#### Using Supabase Dashboard
1. Go to Database → Backups
2. Select backup to restore
3. Click "Restore"

#### Using SQL file
```bash
# Using Supabase CLI
supabase db reset --linked

# Or using psql
psql "postgresql://postgres:[PASSWORD]@db.txnwvaqzmtlhefcxilfu.supabase.co:5432/postgres" \
  < backup-full-20251022.sql
```

---

## 📊 What's Included in This Version (v1.0.0-pre-optimization)

### Code Statistics
- **Total Lines of Code**: ~15,500
- **Components**: 52+
- **Pages**: 40+
- **Database Tables**: 60
- **Migrations**: 23

### Features Implemented
✅ Authentication (Supabase Auth)
✅ Subscription System (3 tiers)
✅ Payment Infrastructure (mock)
✅ Email Templates (38 templates)
✅ AI Health Assistant v2
✅ Second Opinion System
✅ Reports Engine
✅ Device Integration (structure)
✅ Admin Panel
✅ Member Zone (14 sections)
✅ Blog/News CMS
✅ Legal Pages (GDPR, HIPAA, Privacy)
✅ Vercel Deployment Ready

### Database Schema
- Users & Profiles
- Subscriptions & Plans
- Payment Transactions
- Email Templates
- Health Data (devices, sensors, readings)
- Reports & Settings
- Goals & Habits
- Medical Files
- Second Opinions
- Admin Content Management
- Roles & Permissions

---

## 🔐 Security Best Practices

### What to Backup
✅ Source code
✅ Database schema
✅ Database data
✅ Migration files
✅ Configuration files (without secrets)
✅ Documentation

### What NOT to Commit to Git
❌ `.env` file (secrets)
❌ `node_modules/`
❌ `dist/` (build output)
❌ API keys
❌ Private keys
❌ Database passwords
❌ User data exports

### Backup Storage Locations
1. **GitHub** (code only, public or private repo)
2. **External Hard Drive** (complete backup)
3. **Cloud Storage** (encrypted backups)
   - Google Drive
   - Dropbox
   - AWS S3
   - Backblaze B2

---

## 📅 Backup Schedule Recommendations

### Development Phase (Now)
- **Code**: Commit after every feature
- **Database**: Daily manual backup
- **Full backup**: Before major changes

### Production Phase (After Launch)
- **Code**: Auto-commit on deploy (CI/CD)
- **Database**:
  - Automated hourly snapshots
  - Daily full backups (retained 30 days)
  - Weekly backups (retained 1 year)
- **Full backup**: Monthly

---

## 🏷️ Version Tagging Convention

```bash
# Major releases
git tag -a v1.0.0 -m "Initial production release"

# Feature releases
git tag -a v1.1.0 -m "Added payment integration"

# Bug fixes
git tag -a v1.0.1 -m "Fixed authentication bug"

# Pre-releases
git tag -a v1.0.0-beta -m "Beta release"
git tag -a v1.0.0-rc1 -m "Release candidate 1"

# Milestone tags
git tag -a v1.0.0-pre-optimization -m "Stable before optimization"
git tag -a v1.0.0-post-optimization -m "After optimization phase"
```

---

## 📦 Backup Verification

After creating backups, verify they work:

```bash
# 1. Test code backup
mkdir test-restore
cd test-restore
tar -xzf ../biomath-core-backup-*.tar.gz
npm install
npm run build  # Should succeed

# 2. Test database backup
psql test_database < backup-full-20251022.sql  # Should restore

# 3. Check file integrity
md5sum biomath-core-backup-*.tar.gz  # Note the hash
# Later verify:
md5sum -c backup-checksums.txt
```

---

## 🚨 Emergency Recovery Plan

If something goes wrong:

### Code Issues
```bash
# Revert to last tag
git reset --hard v1.0.0-pre-optimization

# Or restore from backup branch
git checkout backup/v1.0.0-pre-optimization
```

### Database Issues
```bash
# Restore from latest backup
supabase db reset --linked
psql [CONNECTION_STRING] < latest-backup.sql
```

### Complete Disaster Recovery
1. Clone from GitHub
2. Restore database from Supabase backup
3. Copy .env from secure storage
4. Run migrations: `npm run migrate`
5. Test: `npm run build && npm run preview`

---

## 📝 Backup Manifest Template

Create a file `BACKUP_MANIFEST.md` for each backup:

```markdown
# Backup Manifest

**Date**: 2025-10-22
**Version**: v1.0.0-pre-optimization
**Created By**: [Your Name]

## Contents
- [x] Source code
- [x] Database dump
- [x] Migration files
- [x] Environment variables template
- [x] Documentation
- [x] Assets (logos, images)

## Files
- `biomath-core-backup-20251022.tar.gz` (12.5 MB)
- `database-backup-20251022.sql.gz` (2.3 MB)
- `migrations-backup-20251022.tar.gz` (0.5 MB)

## Hashes (MD5)
- Code: a1b2c3d4e5f6...
- Database: f6e5d4c3b2a1...

## Notes
Stable version before SEO and UX optimization phase.
All features working. Ready for Vercel deployment.
```

---

## 🎓 Next Steps After Backup

1. ✅ **Verify backup integrity**
2. ✅ **Push to GitHub with tag**
3. ✅ **Store backup in 2+ locations**
4. ✅ **Document backup location in team notes**
5. ✅ **Test restore procedure**
6. 🚀 **Ready to start optimization!**

---

## 📞 Support

If you need help with backups:
- GitHub Docs: https://docs.github.com
- Supabase Docs: https://supabase.com/docs/guides/database/backups
- PostgreSQL Docs: https://www.postgresql.org/docs/current/backup.html

---

**Remember**:
- 🔒 Keep backups secure
- 📅 Backup regularly
- ✅ Test restores periodically
- 📝 Document everything
- 🌍 Store in multiple locations (3-2-1 rule: 3 copies, 2 different media, 1 offsite)
