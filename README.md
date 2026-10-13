
# FSociety Frontend 🚀

### Build. Share. Solve. Grow.

> **FSociety-Frontend** — FSociety developer community platformasining React asosidagi foydalanuvchi interfeysi.

FSociety dasturchilarni yagona muhitda birlashtiradi. Developerlar muammolarini joylashtirishi, yechim topishi, loyihalarini namoyish etishi, hamkorlik qilishi va platformadagi faolligi orqali FCoin to'plashi mumkin.

Ushbu repository frontend ilovasini o'z ichiga oladi.

## 🔗 Repositories

| Repository | Vazifasi |
|---|---|
| [FSociety](https://github.com/dilmurodsadullayev/FSociety) | Django REST API Backend |
| [FSociety-Frontend](https://github.com/dilmurodsadullayev/FSociety-Frontend) | React Frontend |

---

## ✨ Features

### 🏠 1. Home

- Bosh sahifa
- Navbar va Footer
- Community ma'lumotlari
- Popular problems
- Featured content
- Project promotion spotlight
- Responsive layout
- Loading states

### 🔐 2. Authentication

- Login
- Register
- Logout
- Google OAuth
- GitHub OAuth
- Social authentication callback
- JWT cookie authentication
- Auth state management
- Protected routes
- Session handling

### 🐛 3. Problems

- Problems ro'yxati
- Problem qidirish
- Filter va pagination
- Problem yaratish
- Problem detail
- Problem tahrirlash
- My Problems
- Problem responses
- Solution editing
- Problem Star
- Answer Star
- Similar Problems
- Solution acceptance

### 🧑‍💻 4. User Profiles

- Shaxsiy profil
- Avatar
- Cover image
- Skills
- Level va rating ma'lumotlari
- User badges
- Portfolio
- User projects
- User posts
- User roadmaps
- Profile management

### 📁 5. Projects

- Projects sahifasi
- Project detail
- Project creation
- Project editing
- Project images
- Project comments
- Project stars
- Project collaboration
- Collaboration requests
- Project promotion

### 💰 6. FCoin

FCoin — FSociety platformasining virtual reward tizimi.

Frontend imkoniyatlari:

- FCoin balance
- FCoin history
- Transaction details
- Reward categories
- FCoin statistics
- FCoin activity visualization
- Promotion purchase bilan integratsiya

FCoin haqiqiy pul emas.

Coin miqdorlari va tranzaksiyalar backend service orqali boshqariladi.

### 🚀 7. Project Promotions

- Promotion plans
- Project promotion purchase
- Promotion status
- Promoted project listings
- Home promotion spotlight
- Owner management interface

Promotion narxi, davomiyligi va boshqa shartlar backend konfiguratsiyasidan olinadi.

### 📰 8. Community Posts

- Posts
- Post detail
- Post creation
- Post comments
- Post likes
- Comment likes
- Profile posts
- Community discussions

### 🗺️ 9. Roadmaps

- User roadmaps
- Roadmap creation and editing
- Roadmap cards
- Roadmap likes
- Profile roadmap section

### 🔔 10. Notifications

- Notification dropdown
- Notifications page
- Read / Unread UI
- Unread count
- WebSocket integration
- Real-time updates
- Notification state management

WebSocket endpoint:

```text
/ws/notifications/
```

### 🤖 11. Telegram Integration

- Telegram profile connection
- Telegram linking interface
- Bot integration
- Account connection status

### 📝 12. Feedback

- Feedback page
- Feedback form
- Bug reports
- Suggestions
- Praise
- Personal feedback information

### 📢 13. Site Updates

- Platform updates
- Changelog
- Update details
- Update likes

---

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| React Router 7 | Routing |
| Redux Toolkit | Global State Management |
| React Redux | Store Integration |
| Axios | HTTP Client |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Icons | Icons |
| Prism.js | Code Highlighting |
| React Simple Code Editor | Code Editing UI |
| React Hot Toast | Notifications |
| React Scripts 5 | Development and Build |
| WebSocket API | Real-time Communication |

**Build System:** Create React App (`react-scripts`)

Ushbu frontend hozircha Vite emas.

---

## 📂 Project Structure

```text
FSociety-Frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── ...
│
├── src/
│   ├── assets/ or assests/
│   ├── components/
│   ├── config/
│   ├── features/
│   ├── middleware/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── App.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
└── README.md
```

Izoh: loyiha ichidagi ayrim assetlar `src/assests/` nomli mavjud papkada joylashgan. Uni import yo'llarini yangilamasdan o'zgartirmang.

---

## 🚀 Getting Started

### Requirements

- Node.js
- npm
- FSociety Django Backend
- Backend API configuration

Node.js 20 LTS yoki loyiha dependency'lariga mos zamonaviy Node.js versiyasidan foydalanish tavsiya etiladi.

### 1. Clone Repository

```bash
git clone https://github.com/dilmurodsadullayev/FSociety-Frontend.git
cd FSociety-Frontend
```

### 2. Install Dependencies

```bash
npm ci
```

Agar lockfile mavjud bo'lmasa:

```bash
npm install
```

### 3. Environment Configuration

Frontend project root papkasida `.env` faylini yarating.

Local development uchun namuna:

```dotenv
REACT_APP_NAME=FSociety
REACT_APP_FULL_NAME=Fix Society

REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000/api

REACT_APP_WS_URL=ws://localhost:8000/ws/notifications/

REACT_APP_GOOGLE_CLIENT_ID=
REACT_APP_GITHUB_CLIENT_ID=

REACT_APP_GITHUB_URL=https://github.com/dilmurodsadullayev/FSociety-Frontend
```

OAuth funksiyalaridan foydalanish uchun Google va GitHub OAuth Client ID qiymatlarini sozlash kerak.

**Muhim:** `REACT_APP_` bilan boshlanuvchi qiymatlar frontend build ichida ko'rinishi mumkin. Bu yerga client secret, private token yoki database password kiritmang.

`.env` faylini GitHub'ga commit qilmang.

### 4. Start Development Server

```bash
npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

Frontend bilan backend turli originlarda ishlaganda CORS, cookie va CSRF konfiguratsiyasini moslashtirish kerak.

### 5. Production Build

```bash
npm run build
```

Build muvaffaqiyatli tugasa, production uchun statik fayllar `build/` papkasida hosil bo'ladi.

Eslatma: ayrim ESLint warnings mavjud bo'lishi mumkin. Warning va build failure bir xil narsa emas.

### 6. Tests

```bash
npm test
```

Bu React test runner'ni ishga tushiradi.

Frontend test coverage holati mavjud testlar va ularning natijalariga qarab baholanadi.

---

## 🛣️ Application Routes

Asosiy frontend sahifalari:

| Route | Sahifa |
|---|---|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |
| `/callback/:provider` | OAuth Callback |
| `/problems` | Problems |
| `/my-problems` | My Problems |
| `/problem-create` | Create Problem |
| `/problem/:id/detail` | Problem Detail |
| `/problem/:id/edit` | Edit Problem |
| `/feedback` | Feedback |
| `/fcoin` | FCoin |
| `/fcoin-history` | FCoin History |
| `/users` | Users |
| `/:username/profile` | User Profile |
| `/projects` | Projects |
| `/project/:projectId/detail` | Project Detail |
| `/notifications` | Notifications |
| `/:username/post/:slug/` | Post Detail |

Ilovada boshqa ichki yo'nalishlar ham mavjud.

Aniq routing konfiguratsiyasi `src/App.js` ichida joylashgan.

---

## 🔌 API Integration

Backend bilan aloqa service modullari orqali tashkil etilgan.

Asosiy service fayllari:

```text
src/services/
├── api.js
├── auth.js
├── badge.js
├── bot.js
├── coin.js
├── comments.js
├── config.js
├── feedback.js
├── notificationService.js
├── post.js
├── problemResponse.js
├── problems.js
├── profile.js
├── project.js
├── promotion.js
├── roadmap.js
├── updates.js
└── user.js
```

API konfiguratsiyasi:

```javascript
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_API_URL=http://localhost:8000/api
```

Frontend avtomatik ravishda backend API'ga murojaat qiladi.

Authenticated requestlarda backendning JWT cookie konfiguratsiyasiga mos credentials ishlatilishi kerak.

---

## 🗃️ State Management

Global state Redux Toolkit yordamida boshqariladi.

Store:

```text
src/store/index.js
```

Asosiy Redux state bo'limlari:

- Authentication
- Users
- Problems
- Problem Responses
- Projects
- Posts
- Roadmaps
- Badges
- FCoin
- Promotions
- Feedback
- Notifications
- Telegram
- Site Updates

Redux asosan bir nechta komponent o'rtasida umumiy ma'lumotlarni boshqarish uchun ishlatiladi.

---

## 🔔 Real-time Architecture

Frontend WebSocket yordamida backenddagi notification tizimiga ulanadi.

```text
React
  |
  | WebSocket
  v
Django Channels
  |
  v
NotificationConsumer
```

Local WebSocket URL:

```text
ws://localhost:8000/ws/notifications/
```

Production'da HTTPS ishlatilsa, odatda `wss://` konfiguratsiyasi kerak bo'ladi.

WebSocket ishlashi backend ASGI serveri va channel layer konfiguratsiyasiga bog'liq.

---

## 🎨 Design

FSociety UI quyidagi tamoyillarga asoslanadi:

- Responsive layout
- Developer-focused design
- Dark-themed interface
- Animations and transitions
- Reusable React components
- Skeleton loading
- Toast feedback
- Modal interfaces
- Code highlighting
- Form validation
- Mobile-friendly navigation

Asosiy styling:

- Tailwind CSS
- Component CSS
- Framer Motion
- Icon libraries

---

## 🔒 Frontend Security

Frontend quyidagi xavfsizlik yondashuvlariga amal qilishi kerak:

- JWT tokenlarni imkon qadar HttpOnly cookie bilan ishlatish
- API uchun credentials konfiguratsiyasi
- OAuth redirect URI mosligi
- Protected routes
- Backend permissions'ga tayanish
- API errors handling
- Xavfsiz environment configuration
- Production'da HTTPS va WSS

Frontend'dagi protected route server-side authorization o'rnini bosa olmaydi.

API ma'lumotlariga kirish huquqi backend tomonidan tekshirilishi kerak.

---

## 🗺️ Future Improvements

- [ ] Code Sandbox UI
- [ ] AI-assisted solutions
- [ ] Developer Duels
- [ ] Mentor interface
- [ ] Advanced user recommendations
- [ ] Accessibility improvements
- [ ] Bundle size optimization
- [ ] ESLint warnings cleanup
- [ ] Automated frontend regression tests
- [ ] Performance monitoring

Bu bo'limdagi imkoniyatlar roadmap hisoblanadi.

---

## 👨‍💻 Developer

**DimoDev**

GitHub: [@dilmurodsadullayev](https://github.com/dilmurodsadullayev)

Backend: [FSociety](https://github.com/dilmurodsadullayev/FSociety)

Frontend: [FSociety-Frontend](https://github.com/dilmurodsadullayev/FSociety-Frontend)

---

## ❤️ FSociety

**Fix Society — Where Developers Grow Together.**

> Learn. Build. Solve. Share.
