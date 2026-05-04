# Secure Payment App

## 👤 Student Information
- Name: Lené Prinsloo  
- Student Number: ST10496124
- Application Development Security (APDS7311)

---

## 📌 Overview
This project is a secure customer international payments portal built using ASP.NET Core (backend) and React (frontend).

The system allows users to:

- Register an account
- Log in securely
- Simulate international payments

The primary focus of this project is application security, including authentication, input validation, secure password storage, and automated build verification through CI/CD pipelines.

---

## 🚀 Features
- User registration with secure password hashing
- Secure login with JWT authentication
- Protected API endpoints using [Authorize]
- Input validation using regular expressions (Regex)
- Simulated international payment processing
- CI/CD pipeline using GitHub Actions

---

## 🔐 Security
This application follows key secure development principles:

### 🔑 Password Security
- Passwords are hashed and salted using PasswordHasher<User>
- Passwords are never stored in plain text
- Secure verification is performed during login

### 🔐 Authentication & Authorization
- JWT (JSON Web Token) authentication is used
- Tokens are issued upon successful login
- Protected endpoints require valid authorization headers

###🧾 Input Validation
- Regex validation is applied to:
  - Name fields
  - Account numbers
  - Payment amounts
- Prevents malformed or malicious input

### 🌐 Transport Security
- Application supports HTTPS (TLS encryption)
- Protects data in transit against interception (Man-in-the-Middle attacks)

### 🛡️ Security Headers

The backend implements security headers such as:

- HSTS (HTTP Strict Transport Security)
- X-Frame-Options (prevents clickjacking)
- X-Content-Type-Options (prevents MIME sniffing) 

---

## 🤖 Use of AI Tools
The following AI tools were used during development:
- ChatGPT
  - Used for research and clarification of unfamiliar security concepts
  - Assisted in resolving CI/CD pipeline and build workflow errors
  - Supported debugging of frontend and backend integration issues

All AI-generated suggestions were:
- Reviewed
- Understood
- Adapted before implementation

---

## ⚙️ How to Run

### Backend
```bash
cd SecureAPI
dotnet run --launch-profile https
```

The backend will run on:

- https://localhost:7028
- http://localhost:5238

### Frontend
```bash
cd client
npm install
npm start
```

## 🔄 DevSecOps Pipeline

This project includes a GitHub Actions CI pipeline that:

- Automatically builds backend and frontend on every push
- Detects compilation errors early
- Ensures code stability and reliability
- Supports continuous integration best practices

##🎯 Key Notes
- Security is prioritised over UI/visual design
- All authentication, validation, and protection mechanisms are implemented in code
- The system demonstrates core DevSecOps principles in practice

## 📦 Repository
GitHub: https://github.com/LeBeatrix/SecurePaymentApp/tree/main