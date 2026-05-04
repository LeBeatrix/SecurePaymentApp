# Secure Payment App

## 👤 Student Information
- Name: Lené Prinsloo  
- Student Number: ST10496124
- Application Development Security (APDS7311)

---

## 📌 Overview
This project is a secure customer international payments portal built using **ASP.NET Core Web API (backend)** and **React (frontend)**.

The system allows users to:

- Register an account securely
- Log in using authentication mechanisms
- Access a protected payment module
- Simulate international payments

The primary focus of this project is **application security**, including authentication, authorization, input validation, and secure data handling.

---

## 🚀 Features
- Secure user registration with password hashing
- JWT-based authentication and authorization
- Protected API endpoints using `[Authorize]`
- Input validation using Regular Expressions (Regex)
- Secure international payment simulation
- Entity Framework Core with SQL Server (LocalDB)
- CI/CD pipeline using GitHub Actions

---

## 🏗️ System Architecture

### 🔹 Frontend
- React.js
- Handles user interaction, form validation, and API communication

### 🔹 Backend
- ASP.NET Core Web API
- Handles authentication, authorization, and business logic

### 🔹 Database
- SQL Server (LocalDB)
- Managed via Entity Framework Core (Code First approach)

---

## 🔐 Security Implementation

This application follows secure development best practices:

### 🔑 Password Security
- Passwords are hashed using `PasswordHasher<User>`
- No plain-text passwords are stored
- Secure password verification during login

---

### 🔐 Authentication & Authorization
- JWT (JSON Web Token) authentication is implemented
- Tokens are generated upon successful login
- Tokens are stored on the client side and used in API requests
- Protected endpoints require a valid `Authorization: Bearer <token>` header

---

### 🧾 Input Validation
- Regex validation is applied to:
  - Names
  - Account numbers
  - Payment details
- Prevents invalid and potentially malicious input

---

### 🌐 Transport Security
- HTTPS is used for secure communication
- Protects against **Man-in-the-Middle (MITM) attacks**

---

### 🛡️ Security Headers
The backend includes security headers such as:

- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (Clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)

---

## 🤖 Use of AI Tools
The following AI tools were used during development:

- ChatGPT
  - Assisted with understanding security concepts
  - Helped debug backend/frontend integration issues
  - Supported CI/CD pipeline troubleshooting

All AI-generated content was:
- Reviewed
- Understood
- Adapted before implementation

---

## ⚙️ How to Run

### 🔧 Backend
```bash
cd SecureAPI
dotnet run --launch-profile https
```

The backend will run on:

- https://localhost:7028


### Frontend
```bash
cd client
npm install
npm start
```

The frontend will run on:

- http://localhost:3000

## 🔄 DevSecOps Pipeline

This project includes a GitHub Actions CI pipeline that:

- Automatically builds backend and frontend on every push
- Detects compilation errors early
- Ensures code stability and reliability
- Supports continuous integration best practices

##🎯 Key Notes
- Security is prioritised over UI/visual design
- Authentication and authorization are fully implemented
- Database integration ensures persistent storage
- Demonstrates real-world secure application development practices

## 📦 Repository
GitHub: https://github.com/LeBeatrix/SecurePaymentApp/tree/main