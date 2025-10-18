🏡 TripHaven

TripHaven is a modern full-stack web application inspired by Airbnb, built using the MERN stack (MongoDB, Express, React, Node.js) with TypeScript for end-to-end type safety.

The platform allows users to list, discover, and manage vacation rentals — offering the core Airbnb-like experience (without payments).

✨ Features
🧭 Core

🔐 User Authentication (Signup, Login, Logout) using JWT & Cookies

🏠 Property Listings — Create, edit, and view listings

📸 Image Uploads — Integrated with Cloudinary

🌎 Responsive UI — Clean, modern design for all screen sizes

💬 Validation — Zod schema validation for safe data handling

🗂️ Protected Routes — Auth middleware for secure endpoints

⚙️ Backend Highlights

🧱 Node.js + Express.js + TypeScript

🗄️ MongoDB + Mongoose

🔑 JWT authentication with refresh tokens

☁️ Cloudinary integration for media uploads

🧾 Nodemailer for email verification and password resets

🧰 Scalable folder structure for real-world production apps

💻 Frontend Highlights (coming soon)

⚛️ React + TypeScript

🌐 Axios for API communication

🧭 React Router for navigation

💅 TailwindCSS for styling

🛠️ Tech Stack
Layer	Technology
Frontend	React, TypeScript, TailwindCSS
Backend	Node.js, Express.js, TypeScript
Database	MongoDB (Mongoose)
Auth	JWT, Cookies
Validation	Zod
File Uploads	Multer + Cloudinary
Email Service	Nodemailer
Deployment	(Planned: Render / Vercel)
📁 Folder Structure
triphaven/
├── backend/
│   ├── src/
│   │   ├── config/          # env, database, mail, cloudinary
│   │   ├── controllers/     # route handlers
│   │   ├── middlewares/     # authentication, validation, error handling
│   │   ├── models/          # mongoose schemas
│   │   ├── routes/          # express routes
│   │   ├── utils/           # helpers (email, file delete, etc.)
│   │   └── app.ts           # express setup
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── frontend/ (coming soon)

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/<your-username>/triphaven.git
cd triphaven/backend

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173

4️⃣ Run the development server
npm run dev

🧪 Example API Routes
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login user
POST	/api/auth/logout	Logout user
GET	/api/properties	Get all listings
POST	/api/properties	Create a new listing (auth required)
🧱 Future Improvements

💳 Payment gateway integration (Stripe or PayPal)

🧭 Advanced search and filters

⭐ Reviews and ratings system

💬 Real-time chat between hosts and guests

🗺️ Map integration (Google Maps / Leaflet)

🧑‍💻 Author

Faiyaz
🌐 Web Developer | Passionate about building full-stack, scalable web apps
📧 Email me

💼 LinkedIn

💻 GitHub
