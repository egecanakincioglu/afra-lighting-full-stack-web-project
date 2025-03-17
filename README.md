# 🌟 Afra Lighting - Full Stack Web Project

Afra Lighting is a **modern, scalable, and secure** full-stack web project built with **Bun.js**, **Next.js**, **Prisma**, and various other cutting-edge technologies. This project is designed to deliver a **high-performance API** and a **responsive, user-friendly frontend**, focusing on security, modularity, and automation.

## 🚀 Features
- ✅ **Sleek and Modular Web Application** with Next.js & Bun.js
- ✅ **High-Performance Backend** using Express.js & Prisma
- ✅ **Secure Authentication** with JWT & bcrypt
- ✅ **Database Management** via Prisma ORM (supports PostgreSQL, MySQL, and SQLite)
- ✅ **Modern UI/UX** built with Tailwind CSS & Framer Motion
- ✅ **Automated CI/CD Workflows** with GitHub Actions
- ✅ **Cloud Deployment Ready** with PM2 for process management
- ✅ **SEO-Friendly** with Sitemap, Robots.txt, and Metadata Integration
- ✅ **Comprehensive API & Microservices** with gRPC & Protocol Buffers
- ✅ **File Handling & Processing** with Sharp, Formidable, and PDF.js
- ✅ **Email Notifications** via Nodemailer

---

## 📦 Installation & Setup

### **1. Clone the Repository**
```bash
git clone https://github.com/egecanakincioglu/afra-lighting-full-stack-web-project.git
cd afra-lighting-full-stack-web-project
```

### **2. Install Dependencies with Bun**
```bash
bun install
```

### **3. Setup Environment Variables**
Create a `.env` file in the root directory and configure it as follows:
```ini
JWT_PRIVATE_KEY=""
JWT_PUBLIC_KEY=""
NEXT_PUBLIC_SITE_URL="https://www.afralighting.com"
NEXT_PUBLIC_API_URL="https://www.afralighting.com/api"
NODE_ENV=production
EMAIL_SMTP="afralighting.com"
EMAIL_PORT=465
EMAIL_USER="company-email"
EMAIL_PASS="your-password"
```

### **4. Initialize the Database**
```bash
bun run db
```

### **5. Run the Development Server**
```bash
bun run dev
```

Your application will be available at: **`http://localhost:3000`**

---

## 🛠 Project Structure

```
afra-lighting/
│-- database/             # JSON-based storage (if used)
│-- prisma/               # Prisma ORM configurations & migrations
│-- public/               # Static assets (images, icons, manifest)
│-- server/uploads/       # File uploads directory
│-- src/
│   ├── @types/           # TypeScript type definitions
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Page layout components
│   ├── lib/              # Utility functions, helpers, API clients
│   ├── modules/          # Microservices, API handlers
│   ├── pages/            # Next.js pages (frontend)
│   ├── styles/           # SCSS & Tailwind CSS styles
│   ├── setup/            # Project configuration files
│   ├── middleware.ts     # Next.js middleware
│-- .gitignore            # Ignored files & directories
│-- ecosystem.config.js   # PM2 process configuration
│-- package.json          # Project metadata
│-- tsconfig.json         # TypeScript configuration
│-- tailwind.config.ts    # Tailwind CSS configuration
```

---

## 📜 Essential Scripts

| Command             | Description |
|---------------------|-------------|
| `bun run dev`      | Start the development server |
| `bun run build`    | Build the Next.js project |
| `bun run start`    | Start the production server |
| `bun run lint`     | Run TypeScript linting |
| `bun run db`       | Generate Prisma client |
| `bun run protoc`   | Compile protocol buffer files |
| `bun run prod`     | Install dependencies, generate DB & start PM2 |

---

## 🌐 Deployment
Afra Lighting supports deployment with **PM2, Docker, or cloud providers** like AWS, Vercel, or DigitalOcean.

### **Deployment with PM2 (Process Manager 2)**
```bash
pm install -g pm2
pm run prod:pm2
```

### **Deployment with Docker**
```bash
docker build -t afra-lighting .
docker run -p 3000:3000 afra-lighting
```

### **Deploy to Vercel**
```bash
vercel deploy
```

---

## 🛡 Security & Best Practices
Before deploying, run security audits and check for vulnerabilities:
```bash
bun audit
```
For dependency health checks:
```bash
bun run depCheck
```

---

## 🤝 Contribution Guide
We welcome contributions! To contribute:
1. **Fork the repository**.
2. **Create a new branch** (`git checkout -b feature-branch`).
3. **Commit your changes** (`git commit -m "Add new feature"`).
4. **Push to the branch** (`git push origin feature-branch`).
5. **Create a Pull Request**.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 📩 Contact
For any inquiries:
<br>
📧 **Email**: egecanakincioglu@outlook.com  
🌐 **Example Website**: [Afra Lighting](https://afralighting.com)
<br>
🌐 **Software Company**: [Flareye](https://flareye.com)

