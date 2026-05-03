# RecipeApp 

It's a full-stack recipe sharing application built with Next.js and Prisma.

## Technologies Used
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- PostgreSQL (Database)
- Prisma (ORM)
- JWT & bcryptjs (for custom authentication)

## Main Features
- **User Authentication:** Users can register, log in, and log out.
- **CRUD Operations:** Create, Read, Update, and Delete recipes.
- **Ownership Rule:** You can view all recipes, but you can only edit or delete the ones you created.
- **Search & Filters:** You can search recipes by name and filter them by difficulty on the home page.

---

## How to Run the Project Locally

Follow these exact steps to start the application.

### 1. Install dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 2. Set up Environment Variables
Because the `.env` file is ignored, you must create it manually in the root folder of the project.
Create a `.env` file and paste **exactly** this content into it:

```env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5433/recipes_db?schema=public"

JWT_SECRET="my-super-secret-key-that-nobody-knows"

JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLadmUwlObFgxLYyqd3PGlATXw
779n7h9RBNby22b3A8o7+6DSeBkFRsTu4OtWaGdA7lJd8zqjTMZ8brILKgzd6q8i
03HZgI42TKJ3+5jg0GHdjfRov90UjF/iC4SXnZE+3VrZWxBokjIdoIUJRsqVSZCa
chXjuxbWcizygW0FdwIDAQAB
-----END PUBLIC KEY-----"
```

### 3. Start the Database (Docker)
The project includes a `docker-compose.yml` file configured for port 5433. To start the PostgreSQL database, run:
```bash
docker compose up -d
```

### 4. Apply Database Migrations
Push the Prisma schema to the running database to create the required tables:
```bash
npx prisma migrate dev
```

### 5. Start the App
Run the development server:
```bash
npm run dev
```
Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Test Data (Optional)

**To add mock data:**
If you want to see some recipes right away, go to this link while the server is running:
[http://localhost:3000/api/seed](http://localhost:3000/api/seed)
This will instantly create 2 test users and 4 recipes.

**To remove mock data:**
If you want to clean up the database from these seed recipes later:
1. Open the browser DevTools (F12).
2. Go to the **Console** tab.
3. Paste this command and press Enter:
```javascript
fetch('/api/seed', { method: 'DELETE' }).then(res => res.json()).then(console.log)
```
This safely removes the test users and their recipes without touching your personal ones.