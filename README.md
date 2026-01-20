# Cost Manager RESTful Web Services

Final Project – Asynchronous Server-Side Development Course 

---

## Project Description

This project implements a **Cost Manager RESTful Web Services system** that enables managing users, costs, monthly reports, logs, and administrative information.

The system was developed according to the course requirements and follows a **four-process architecture**, allowing future separation into independent services or servers.

The project uses **Node.js, Express.js, MongoDB Atlas, Mongoose, and Pino**, and is fully deployed to the cloud.

---

## System Architecture

The project is divided into **four independent processes**, each responsible for a specific domain:

### 1. Users Process
- Add new users  
- Get details of a specific user  
- List all users  

### 2. Costs Process
- Add cost items  
- Generate monthly reports  
- Implements the *Computed Design Pattern*  

### 3. Logs Process
- Logs every HTTP request  
- Stores logs in MongoDB  

### 4. Admin Process
- Returns development team details  
- Data is not stored in the database  

Each process runs separately and can be deployed independently.

---

## Deployed Services (Render)

- **Users Service**  
  https://cost-manager-users-9kun.onrender.com  

- **Costs Service**  
  https://cost-manager-costs-4b42.onrender.com  

- **Logs Service**  
  https://cost-manager-logs-1q12.onrender.com  

- **Admin Service**  
  https://cost-manager-admin-ix1s.onrender.com  

---

## Database

- MongoDB Atlas (cloud-hosted)
- Collections:
  - users
  - costs
  - logs
  - report_cache
- `_id` is stored in MongoDB but never returned in API responses
- Supported categories:
  - food
  - health
  - housing
  - sports
  - education

---

## Computed Design Pattern

Monthly reports are cached **only for past months**.  
Since the system does not allow adding cost items with past dates, cached reports are immutable and safe to reuse.

Reports for the current or future months are always generated dynamically.

---

## API Endpoints

### Users Service

- **GET /api/users**  
  Returns all users

- **GET /api/users/:id**  
  Returns user details and total costs

- **POST /api/add**  
  Adds a new user

---

### Costs Service

- **POST /api/add**  
  Adds a new cost item  
  - Future dates are allowed  
  - Past dates are rejected  

- **GET /api/report?id=USER_ID&year=YYYY&month=MM**  
  Returns a monthly cost report grouped by categories

---

### Logs Service

- **GET /api/logs**  
  Returns all logged HTTP requests

---

### Admin Service

- **GET /api/about**  
  Returns development team details

---

## Testing

Unit tests were written for all endpoints using **Jest**.

The tests verify:
- Endpoint accessibility
- Basic request/response structure
- Validation handling

Tests are included in the project and are intended for code review purposes.

To run tests locally:

```bash
npm test

