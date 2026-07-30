# FoodPoint — cPanel Deployment Guide

## Backend (api.uzaziclinic.co.tz)

### Step 1: Create Subdomain
1. Login to cPanel
2. Go to **Subdomains**
3. Create: `api.uzaziclinic.co.tz`
4. Set Document Root to: `api.uzaziclinic.co.tz`

### Step 2: Upload Files
1. Zip the entire `backend/` folder contents
2. Upload the zip to `api.uzaziclinic.co.tz/` via cPanel File Manager
3. Extract the zip — your structure should be:
   ```
   api.uzaziclinic.co.tz/
   ├── app/
   ├── bootstrap/
   ├── config/
   ├── database/
   ├── public/          ← THIS is your document root
   ├── resources/
   ├── routes/
   ├── storage/
   ├── vendor/
   ├── .env
   └── ...
   ```

### Step 3: Set Document Root to public/
1. In cPanel → **Subdomains**
2. Edit `api.uzaziclinic.co.tz`
3. Change Document Root to: `api.uzaziclinic.co.tz/public`

> If you cannot change the document root, use the root `.htaccess` (already created)
> which redirects all traffic to `backend/public/`.

### Step 4: Configure .env
1. Copy `.env.production` to `.env`
2. Update database credentials:
   ```
   DB_DATABASE=your_db_name
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   ```
3. Set `APP_URL=https://api.uzaziclinic.co.tz`

### Step 5: Set Permissions
Via cPanel Terminal or SSH:
```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### Step 6: Run Migrations
```bash
php artisan migrate --force
php artisan db:seed --force  # if you have seeders
```

### Step 7: Optimize for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Step 8: Create Super Admin (if not seeded)
```bash
php artisan tinker
>>> App\Models\User::create([
    'name' => 'Super Admin',
    'email' => 'admin@foodpoint.co.tz',
    'password' => 'YourSecurePassword',
    'role' => 'super_admin',
    'restaurant_id' => null,
]);
```

---

## Frontend (uzaziclinic.co.tz or foodpoint.co.tz)

### Option A: Deploy on Vercel
1. Push the `front/` folder to GitHub
2. Import the repo on Vercel
3. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://api.uzaziclinic.co.tz/api`
4. Deploy

### Option B: Deploy on cPanel
1. Build locally: `npm run build`
2. Upload the `.next/`, `public/`, `package.json`, `next.config.js` to your domain folder
3. Set up Node.js app in cPanel
4. Set env variable: `NEXT_PUBLIC_API_URL=https://api.uzaziclinic.co.tz/api`

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| API | `https://api.uzaziclinic.co.tz/api/` |
| Admin Login | `https://api.uzaziclinic.co.tz/login` |
| Admin Dashboard | `https://api.uzaziclinic.co.tz/dashboard` |
| Frontend | `https://uzaziclinic.co.tz` (or Vercel URL) |

## .htaccess Files

### Root `.htaccess` (if document root cannot be changed to public/)
Already created at project root — redirects all traffic to `backend/public/`.

### `backend/public/.htaccess`
Standard Laravel .htaccess — sends all requests to `index.php` (front controller).
