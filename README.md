# Secure Payment App

## 👤 Student Information
- Name: Lené Prinsloo  
- Student Number: ST10496124
- Application Development Security APDS7311

---

## 📌 Overview
This project is a secure customer international payments portal built using ASP.NET Core and React.

The system allows users to register, log in securely, and simulate international payments, with a strong focus on security principles.

---

## 🚀 Features
- User registration with password hashing  
- Secure login with JWT authentication  
- Protected API endpoints using `[Authorize]`  
- Input validation using regular expressions  
- Simulated international payment form  
- CI/CD pipeline using GitHub Actions  

---

## 🔐 Security
- Passwords are hashed and salted using `PasswordHasher`  
- Secure password verification during login  
- JWT tokens used for authentication and authorization  
- Input validation prevents invalid or malicious data  
- Security headers implemented (HSTS, X-Frame-Options, X-Content-Type-Options)  
- HTTPS enforced for secure communication  

---

## 🤖 Use of AI Tools
ChatGPT was used for:
- Research and understanding tools and concepts that were not fully understood  
- Assistance with resolving CI/CD pipeline and workflow errors  

All generated content was reviewed, understood, and adapted before implementation.

---

## ⚙️ How to Run

### Backend
```bash
cd SecureAPI
dotnet run --launch-profile https

### Frontend
```bash
cd client
npm install
npm start

## 🔄 DevSecOps Pipeline

The project includes a GitHub Actions CI pipeline that:

- Automatically builds the backend and frontend on each push
- Detects build errors early
- Improves reliability and security through automation

##🎯 Notes
- This project prioritizes security over UI design
- All critical functionality (authentication, validation, protection) is implemented in code