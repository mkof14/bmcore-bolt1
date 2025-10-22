# 🚀 Quick Start - Backup & Release

## TL;DR - Create Backup Right Now

```bash
# Option 1: Automatic (recommended)
./scripts/create-release.sh

# Option 2: Manual
git init
git add .
git commit -m "feat: v1.0.0-pre-optimization - Stable before optimization"
git tag -a v1.0.0-pre-optimization -m "Stable version before optimization"
git branch backup/v1.0.0-pre-optimization
```

---

## Complete 5-Minute Backup Process

### Step 1: Create Code Backup (1 min)
```bash
cd /path/to/project
./scripts/create-release.sh
```

### Step 2: Push to GitHub (2 min)
```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/biomathcore.git
git push -u origin main
git push origin v1.0.0-pre-optimization
git push origin backup/v1.0.0-pre-optimization
```

### Step 3: Backup Database (2 min)
```bash
# Install Supabase CLI if needed
npm install -g supabase

# Run backup script
./scripts/backup-database.sh
```

Done! You now have:
- ✅ Code in GitHub with tag
- ✅ Backup branch
- ✅ Database backup in `/backups` folder

---

## Verify Backup

```bash
# Check git
git log --oneline -3
git tag -l
git branch -a

# Check backups folder
ls -lh backups/
```

---

## Restore from Backup (If Needed)

### Restore Code
```bash
git checkout v1.0.0-pre-optimization
# or
git checkout backup/v1.0.0-pre-optimization
```

### Restore Database
```bash
cd backups
gunzip full-backup-*.sql.gz
psql [YOUR_CONNECTION_STRING] < full-backup-*.sql
```

---

## What Gets Backed Up?

### Code Repository
- ✅ All source files
- ✅ Configuration files
- ✅ Migration files
- ✅ Documentation
- ❌ node_modules (excluded)
- ❌ .env (excluded - backup separately!)

### Database
- ✅ Full dump (schema + data)
- ✅ Schema only
- ✅ Data only
- ✅ Migration files

---

## Store Backups In

1. **GitHub** - Code only (done automatically)
2. **External Drive** - Complete copy
3. **Cloud Storage** - Encrypted backups
   - Google Drive
   - Dropbox
   - AWS S3

---

## Emergency Recovery

If something breaks:

```bash
# Revert code
git reset --hard v1.0.0-pre-optimization

# Restore database
cd backups
./restore-latest.sh  # (create this script if needed)
```

---

## Next Steps After Backup

1. ✅ Verify backup works
2. ✅ Store in multiple locations
3. 🚀 Start optimization phase!

---

## Need Help?

See detailed guides:
- `BACKUP_GUIDE.md` - Complete backup documentation
- `DEPLOYMENT.md` - Deployment to Vercel
- `VERSION.md` - Version history

---

**Remember**:
- 🔒 Never commit `.env` file
- 📅 Backup before major changes
- ✅ Test restore procedure
- 🌍 Store in 3 locations (3-2-1 rule)
