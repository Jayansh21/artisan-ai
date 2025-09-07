# Artisan AI - Development Setup

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running  
- [Node.js](https://nodejs.org/) (v16 or above recommended)  
- [npm](https://www.npmjs.com/) package manager  

---

## 1. Install Dependencies
Run the following command in the project root to install required dependencies:

```bash
npm install
```
---

## 2. Start Database
Use Docker to start MongoDB:
```bash
cd artisan-ai
docker-compose up -d mongodb
```
---
## 3. Run Backend
Open Terminal 1 and start the backend server:
```bash
cd backend
npm run dev
```
---
## 4. Run Frontend
Open Terminal 2 and start the frontend:
```bash 
cd frontend
npm start
```
---


