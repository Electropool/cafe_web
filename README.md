# XYZ Café - Modern Web Application

A premium, high-end cafe website built with React, Vite, and Tailwind CSS, featuring dynamic configuration via YAML files and a sleek, animated user interface.

## 🚀 Key Features
- **YAML-Based Configuration**: Easily update homepage content and menu items without touching the code.
- **Dynamic Menu Management**: Automatically binds photos based on naming conventions.
- **Premium Aesthetics**: Smooth transitions, gooey text morphing, and interactive elements.
- **Admin Dashboard**: Graphically manage menu items and visibility.
- **Dark/Light Mode**: Full theme support with persistence.

---

## 📁 Directory Structure
```text
cafe_web/
├── src/
│   ├── config/               # Configuration Folder
│   │   ├── homepage.yaml     # Titles, about section, footer, etc.
│   │   └── menu.yaml         # Menu categories and items
│   ├── contexts/             # State & Config Management
│   │   ├── ConfigContext.tsx # Parses YAML files
│   │   └── AdminContext.tsx  # Handles runtime menu state
│   ├── pages/                # Main application pages
│   └── components/           # Reusable UI components
└── public/
    └── menu_media/           # Media folder for menu item photos
```

---

## 🛠️ YAML Configuration

### 🏠 Homepage (`src/config/homepage.yaml`)
You can update the entire homepage content here:
- **Hero Section**: Title, subtitle, logo, and background video.
- **About Section**: Multi-section story with image and text positioning.
- **Gallery**: Vibe section with custom grid spans.
- **Footer**: Contact info, social links, and morphing text labels.

### 📜 Menu (`src/config/menu.yaml`)
Menu items are organized by categories. Photos are automatically binded using a specific naming convention:
- **Naming Pattern**: `menu__${domain}__${subdomain}__${slug}__${index}.jpg`
- **Example**: If `domain: beverage`, `subdomain: hot`, and `slug: tea`, the photos should be named:
  - `menu__beverage__hot__tea__0.jpg`
  - `menu__beverage__hot__tea__1.jpg`
- **Logic**: If you remove an item from the YAML, it disappears. If you duplicate and change the `slug`, it adds a new item with its own photos.

---

## 💻 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Hosting on VPS (Manual Setup)

### 1. Server Preparation
- Install Node.js, Nginx, and Git on your VPS.
- Clone the repository and run `npm install`.
- Build the project: `npm run build`.

### 2. Nginx Configuration
Create a site configuration in `/etc/nginx/sites-available/cafe`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/cafe_web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
- Enable the site: `ln -s /etc/nginx/sites-available/cafe /etc/nginx/sites-enabled/`.
- Test and restart Nginx: `nginx -t && systemctl restart nginx`.

### 3. SSL (HTTPS)
Use Certbot for free SSL:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Database Management
For a full-stack deployment with persistence:
- **SQLite**: No setup needed, just create a `.db` file in your backend folder.
- **PostgreSQL/MySQL**: Install on VPS, create a user and database, and connect via your backend environment variables.

---

## 🔒 Hosting on VPS with Cloudflare Tunnel (Recommended)

This method is more secure and doesn't require opening ports or managing Nginx/SSL manually.

### 1. Install Cloudflared
Follow [Cloudflare's guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) to install `cloudflared` on your VPS.

### 2. Authenticate
```bash
cloudflared tunnel login
```

### 3. Create Tunnel
```bash
cloudflared tunnel create cafe-tunnel
```

### 4. Configure Tunnel
Create a `config.yml` in `~/.cloudflared/`:
```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: yourdomain.com
    service: http://localhost:80  # Or the port your app is running on
  - service: http_status:404
```

### 5. Run the Tunnel
```bash
cloudflared tunnel run cafe-tunnel
```

### 6. DNS Routing
Go to the Cloudflare Dashboard -> Access -> Tunnels and point your domain to the tunnel.

---

## 🛠️ Database Setup for Advanced Hosting
If you decide to migrate from `localStorage` to a real database:
1. **Backend**: Create a simple Express.js or Fastify server.
2. **ORM**: Use Prisma or Drizzle for easy database management.
3. **Storage**:
   - **Local VPS**: Host SQLite or PostgreSQL.
   - **Managed**: Use Supabase or MongoDB Atlas for cloud-based database systems.
4. **Integration**: Update the `AdminContext` to fetch/post data to your backend API instead of `localStorage`.
