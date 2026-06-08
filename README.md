# Secure International Payments System

## 👤 Student Information

* **Name:** Lené Prinsloo
* **Student Number:** ST10496124
* **Module:** Application Development Security (APDS7311)

---

# 📌 Project Overview

The Secure International Payments System is a web-based banking application developed using **ASP.NET Core Web API** and **React.js**.

The application simulates the process of international payments within a banking environment while implementing secure software development practices.

The system provides separate portals for customers and employees:

### Customer Functions

* Register a new customer account
* Log in securely
* Create international payment requests
* Submit payment requests for verification

### Employee Functions

* Log in using pre-created employee accounts
* View pending international payments
* Verify payment details
* Submit verified payments to SWIFT

The project focuses on implementing secure coding principles, authentication, authorization, input validation, secure communication, and DevSecOps practices.

---

# 🚀 Features

### Customer Portal

* Customer registration
* Customer login
* JWT authentication
* Protected payment submission

### Employee Portal

* Employee login
* View pending payments
* Verify payments
* Submit payments to SWIFT

### Security Features

* Password hashing using PasswordHasher
* JWT Authentication
* Authorization using [Authorize]
* Input validation using Regular Expressions
* Security headers
* HTTPS communication
* Rate limiting
* SQL Server database storage

### DevSecOps

* GitHub Repository
* GitHub Actions CI/CD
* CircleCI Pipeline
* SonarCloud Static Code Analysis

---

# 🏗️ System Architecture

## Frontend

**Technology:** React.js

Responsibilities:

* User Interface
* Form Validation
* API Communication
* JWT Storage
* Navigation between portals

---

## Backend

**Technology:** ASP.NET Core Web API

Responsibilities:

* Authentication
* Authorization
* Payment Processing
* Business Logic
* Security Controls

---

## Database

**Technology:** SQL Server (LocalDB)

Responsibilities:

* Customer Storage
* Payment Storage
* Payment Status Tracking

---

# 🔐 Security Implementation

## Password Hashing

Customer and employee passwords are hashed using:

```csharp
PasswordHasher<User>
PasswordHasher<Employee>
```

Benefits:

* No plaintext passwords stored
* Passwords cannot be reversed
* Secure credential verification

---

## Authentication

The application uses JWT authentication.

Upon successful login:

1. User credentials are validated.
2. JWT token is generated.
3. Token is stored in local storage.
4. Protected endpoints require a valid token.

Example:

```http
Authorization: Bearer <JWT Token>
```

---

## Authorization

Protected endpoints use:

```csharp
[Authorize]
```

Examples:

```csharp
GET /api/auth/secure
POST /api/payment/send
GET /api/payment/pending
```

Unauthorized users cannot access protected resources.

---

## Input Validation

Regular Expressions are used to validate:

### Customer Names

```regex
^[A-Za-z\s]{2,50}$
```

### Account Numbers

```regex
^\d{10,12}$
```

### SWIFT Codes

```regex
^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$
```

### Beneficiary Accounts

```regex
^\d{8,20}$
```

This prevents invalid and potentially malicious input.

---

## HTTPS Security

The application enforces HTTPS communication.

Benefits:

* Encrypts data in transit
* Prevents eavesdropping
* Protects against Man-in-the-Middle attacks

---

## Security Headers

The application implements security headers including:

* Strict-Transport-Security (HSTS)
* X-Frame-Options
* X-Content-Type-Options
* Content-Security-Policy
* Referrer-Policy
* Permissions-Policy

Benefits:

* Protection against clickjacking
* Protection against MIME sniffing
* Improved browser security

---

## Rate Limiting

The application includes a Fixed Window Rate Limiter.

Configuration:

* Permit Limit: 5 requests
* Window: 10 seconds

Benefits:

* Mitigates brute force attacks
* Reduces denial-of-service risks
* Prevents excessive requests

---

# 💳 Customer Workflow

1. Customer Registration
2. Customer Login
3. JWT Token Generated
4. Access Payment Portal
5. Submit Payment Request
6. Payment Stored in Database
7. Status Set To Pending

---

# 👨‍💼 Employee Workflow

1. Employee Login
2. JWT Token Generated
3. Access Employee Portal
4. View Pending Payments
5. Verify Payment Details
6. Submit Payment To SWIFT
7. Status Updated To Submitted To SWIFT

---

# 🔄 DevSecOps Pipeline

## GitHub Actions

The GitHub Actions pipeline automatically:

* Restores dependencies
* Builds backend
* Builds frontend
* Detects build errors

---

## CircleCI

CircleCI performs:

* Continuous Integration
* Automated builds
* Validation before deployment

---

## SonarCloud

SonarCloud performs:

* Static Code Analysis
* Security Hotspot Detection
* Reliability Analysis
* Maintainability Analysis

Security Hotspots were reviewed during development.

---

# 🤖 Use of AI Tools

ChatGPT was used to:

* Understand security concepts
* Assist with troubleshooting
* Support CI/CD configuration
* Explain secure coding practices
* Debug authentication and authorization issues

All generated content was reviewed, understood, tested, and adapted before implementation.

---

# ⚙️ Running the Application

## Backend

```bash
cd SecureAPI
dotnet run --launch-profile https
```

Backend URL:

```text
https://localhost:7028
```

---

## Frontend

```bash
cd client
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# 📸 Evidence Included

The submission document contains evidence of:

### Customer Portal

* Registration Page
* Login Page
* Registration Success
* Login Success

### Payment Processing

* Payment Form
* Payment Submission
* SQL Database Records

### Employee Portal

* Employee Login
* Pending Payments
* Verified Payments
* SWIFT Submission

### Security

* JWT Protected Endpoint
* Swagger Security Configuration
* Security Headers
* Rate Limiter Configuration

### DevSecOps

* GitHub Repository
* GitHub Actions
* CircleCI Build Success
* SonarCloud Analysis
* Security Hotspots Review

---

# 📦 Repository

GitHub Repository:

https://github.com/LeBeatrix/SecurePaymentApp

---

# 🎥 Demonstration Videos

### YouTube Demo 1

https://youtu.be/-FVZMidnrs8

### YouTube Demo 2

https://youtu.be/ltc5CnhO8lg

---

# 🎯 Key Learning Outcomes

This project provided practical experience in:

* Secure Software Development
* Authentication and Authorization
* JWT Security
* Secure Coding Practices
* Input Validation
* Database Security
* DevSecOps
* Static Code Analysis
* CI/CD Pipelines

---

# 🏁 Conclusion

The Secure International Payments System successfully demonstrates the implementation of modern security practices within a banking application environment.

The project incorporates secure authentication, authorization, password hashing, input validation, HTTPS communication, security headers, rate limiting, and DevSecOps practices through GitHub Actions, CircleCI, and SonarCloud.

The completed solution provides a secure and realistic simulation of an international payments workflow while meeting the requirements of Application Development Security (APDS7311).

---

# References

1.	Microsoft. (2025) ASP.NET Core documentation. Available at: https://learn.microsoft.com/aspnet/core (Accessed: 6 June 2026).
2.	Microsoft. (2025) Authentication and authorization in ASP.NET Core. Available at: https://learn.microsoft.com/aspnet/core/security/authentication (Accessed: 6 June 2026).
3.	Microsoft. (2025) PasswordHasher<TUser> Class. Available at: https://learn.microsoft.com/dotnet/api/microsoft.aspnetcore.identity.passwordhasher-1 (Accessed: 6 June 2026).
4.	Microsoft. (2025) Entity Framework Core Documentation. Available at: https://learn.microsoft.com/ef/core (Accessed: 6 June 2026).
5.	Microsoft. (2025) Rate Limiting Middleware in ASP.NET Core. Available at: https://learn.microsoft.com/aspnet/core/performance/rate-limit (Accessed: 6 June 2026).
6.	National Institute of Standards and Technology (NIST). (2020) SP 800-63B: Digital Identity Guidelines – Authentication and Lifecycle Management. Gaithersburg, MD: National Institute of Standards and Technology. Available at: https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final (Accessed: 6 June 2026). 
7.	OWASP Foundation. (2025) OWASP Top 10 Web Application Security Risks. Available at: https://owasp.org/www-project-top-ten/ (Accessed: 6 June 2026). 
8.	OWASP Foundation. (2023) OWASP API Security Top 10 – 2023. Available at: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ (Accessed: 6 June 2026). 
9.	SonarSource. (2025) SonarCloud Documentation. Available at: https://docs.sonarcloud.io (Accessed: 6 June 2026).
10.	Circle Internet Services, Inc. (2025) CircleCI Documentation. Available at: https://circleci.com/docs (Accessed: 6 June 2026).
11.	GitHub. (2025) GitHub Actions Documentation. Available at: https://docs.github.com/actions (Accessed: 6 June 2026).
12.	React Team. (2025) React Documentation. Available at: https://react.dev (Accessed: 6 June 2026).
13.	JWT.io. (2025) Introduction to JSON Web Tokens. Available at: https://jwt.io/introduction (Accessed: 6 June 2026).

---
