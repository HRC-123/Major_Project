
# NITJ Study Resources Hub


## Team 
Ramcharan Hanumanthu - 21103123 - [HRC-123]()

Chaitanya Reddy - 21103050 - [chaitugujjula00](https://github.com/chaitugujjula00)

Manya Singh - 21103085 - [FlyingManya](https://github.com/FlyingManya)
## Description
NITJ Study Resources Hub — your one-stop destination for academic excellence at Dr. B. R. Ambedkar National Institute of Technology Jalandhar. This platform is designed to empower students across all departments by providing easy access to curated study materials, including:

📄 Course Notes

📚 Lecture Slides & Presentations

📝 Previous Year Question Papers

📘 Assignment Solutions

📥 Project Reports and Lab Manuals

Whether you're preparing for semester exams, revising class concepts, or working on assignments, the NITJ Study Resources Hub is here to support your academic journey with organized, reliable, and peer-shared content.


## Features

🔍 Search & Filter resources by department, subject, or document type

🗂️ Department-wise & Subject-wise organization

📄 Upload & Download resources (PDF, DOCX, PPTX, etc.)

🔒 User Authentication via Google Oauth (Google Login)

👍 Like, Dislike, and Report inappropriate or outdated content

🎓 Designed by NITJ students, for NITJ students


## Tech Stack

**Frontend:** React, TailwindCSS

**Backend:** Node, Express

**Database & Storage:** Supabase

**Authentication:** Google OAuth

**Admin Controls:** AdminJS(formerly Admin Bro)



## Run Locally

Clone the project

```bash
git clone https://github.com/HRC-123/Major_Project
```

### Frontend
Go to Frontend

``` bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the project

``` bash
npm start
```

Open http://localhost:3000 in browser 


### Backend
Go to Backend

``` bash
cd backend
```

Install dependencies

```bash
npm install
```

Start the server

``` bash
node server.js
```

Server runs on port : 5000


### Admin

Go to Admin

``` bash
cd admin
```

Install dependencies

```bash
npm install
```

Start admin

``` bash
node index.js
```

Admin runs on port : 3001

Open http://localhost:3001 in browser 





## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Frontend


`REACT_APP_CLIENT_ID (Google)`

`REACT_APP_SERVER_URL (Server Url)`


### Backend

`REACT_APP_SUPABASE_URL`

`REACT_APP_SUPABASE_ANON_KEY`

`REACT_APP_SUPABASE_BUCKET`


### Admin Js

`ADMIN_COOKIE_SECRET`

`SESSION_SECRET`

`PORT = 3001`

`REACT_APP_SUPABASE_URL`

`REACT_APP_SUPABASE_ANON_KEY`

`REACT_APP_SUPABASE_BUCKET`

`DATABASE_URL`

`SUPABASE_DB_NAME`

`SUPABASE_DB_USER`

`SUPABASE_DB_PASSWORD`

`SUPABASE_HOST`

`ADMIN_EMAIL `

`ADMIN_PASSWORD `



## Contributing

We welcome contributions! Feel free to fork, open issues, or submit pull requests.


## 🌐 Links

🔗 [Website](https://nitj-study-resources-hub.onrender.com): NITJ Study Resources Hub
Explore and access study materials by department and subject.

🛠️ [Admin Panel](https://nitj-study-resources-hub-admin.onrender.com): Admin Dashboard
Manage users, documents, departments, and reported content (admin access only).

💻 [GitHub Repository](https://github.com/HRC-123/Major_Project): GitHub - Major_Project
Browse the source code for frontend, backend, and admin panel.

## Future Scope

🧠 **Smart Reporting System**

If a document is reported by many users, it will be automatically flagged with a warning like “⚠️ Reported by multiple users”, helping others avoid potentially misleading or inappropriate content.

🎓 **Support for More Programs**

Extend the platform to include resources for other academic programs such as M.Tech, MBA, M.Sc, and Ph.D., in addition to existing B.Tech courses.

🗨️ **Comment & Discussion Threads**

Allow students to comment on resources, ask questions, or share tips right below each document.

📊 **Student Contribution Leaderboard**

Recognize and reward active contributors through a leaderboard system based on uploads, helpful ratings, and engagement.


📤 **Bulk Upload & ZIP Support**

Allow users and faculty to upload multiple files at once with automated categorization.

🔐 **Faculty Portal & Verified Uploads**

Enable faculty to upload official course materials and past exam papers with a “verified” badge.

## Authors

- [Ramcharan](https://www.linkedin.com/in/ramcharanhanumanthu/)

- [Chaitanya](https://www.linkedin.com/in/chaitanya-reddy-gujjula-802940235/)

- [Manya](https://www.linkedin.com/in/manya-singh-a4452625a/)
