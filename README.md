1.COMPLETE FILE STRUCTURE:
pracsphere-assignment/
│
├──  package.json                    
├──  pnpm-workspace.yaml            
├──  turbo.json                     
├── .gitignore                     
├──  README.md                      
├──  setup.sh                       
│
├──  apps/
│   └──  web/                       
│       ├──  package.json
│       ├──  tsconfig.json
│       ├──  tailwind.config.ts
│       ├──  postcss.config.js
│       ├──  next.config.js
│       ├──  .env.example
│       ├──  .env.local            
│       │
│       ├── app/
│       │   ├──  layout.tsx
│       │   ├──  page.tsx          
│       │   ├──  providers.tsx
│       │   ├──  globals.css
│       │   │
│       │   ├──  (auth)/
│       │   │   ├──  login/
│       │   │   │   └──  page.tsx
│       │   │   └──  signup/
│       │   │       └──  page.tsx
│       │   │
│       │   ├── (dashboard)/
│       │   │   ├──  layout.tsx    
│       │   │   ├──  dashboard/
│       │   │   │   └──  page.tsx
│       │   │   ├──  tasks/
│       │   │   │   └──  page.tsx
│       │   │   └── profile/
│       │   │       └──  page.tsx
│       │   │
│       │   └──  api/
│       │       ├──  auth/
│       │       │   ├──  [..nextauth]/
│       │       │   │   └── route.ts
│       │       │   └──  signup/
│       │       │       └──  route.ts
│       │       └──  tasks/
│       │           └──  route.ts
│       │
│       ├──  lib/
│       │   ├──  mongodb.ts       
│       │   └──  auth.ts          
│       │
│       └──  types/
│           └──  next-auth.d.ts    
│
└──  packages/
    ├──  ui/                       
    │   ├──  package.json
    │   ├──  tsconfig.json
    │   └──  src/
    │       ├──  index.ts
    │       ├──  Button.tsx
    │       ├──  Card.tsx
    │       ├──  Input.tsx
    │       ├──  Sidebar.tsx
    │       └──  Topbar.tsx
    │
    └──  config/                    
        ├──  tailwind/
        │   └──  index.js
        └──  typescript/
            ├──  base.json
            └──  nextjs.json

2. # Install Node.js 18+ 
# Download from: https://nodejs.org/

# Install pnpm globally
npm install -g pnpm@latest

3. # Install all packages 
pnpm install

4. Configure MongoDb Compass
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB
mongod 
In another terminal mongosh

5: Environment Variables
Create apps/web/.env.local:
# Database
MONGODB_URI=mongodb://localhost:27017/pracsphere
MONGODB_DB=pracsphere

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a0e4994129d5f18a2ef5357ba8c3f7a15f253c184ae3d1b569078e7dbe46e61f

# Email (Gmail)
EMAIL_USER=godadevi1301@gmail.com
EMAIL_PASS=ijdz ukkx qxsp eget
NODE_ENV=development
CRON_SECRET=NFVtpA5vGTynetw1Wnf8mIDxHV3TBwltJRZ8aqxeJoI

6. # Start all apps
pnpm dev

# Or start only web app
pnpm dev --filter=web

7. Open Browser
Navigate to: http://localhost:3000

![Landing Page](image.png) [Landing Page]
![SignUp page](image-8.png)
![Login Page](image-1.png)
![DashBoard with side bar and Top bar](image-2.png)
![Task DashBoard](image-3.png)
![Creating New Task](image-4.png)
![Profile DashBoard](image-5.png)
![Mongodb Tasks Collection](image-6.png)
![MongoDb Users Collection](image-7.png)



