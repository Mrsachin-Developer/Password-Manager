# 🔐 Password Vault API (Day 10 Project)

A **zero-trust backend system** that securely stores and manages user credentials using **AES-256 encryption**, **JWT authentication**, and **ownership-based access control**.

This project is designed to teach **real-world backend security concepts**, not just CRUD operations.

---

## 🚀 Project Overview

This API allows users to store credentials (like website logins) in a secure vault where:

- Passwords are **never stored in plaintext**
- Each record is encrypted using **AES-256**
- Every record has a **unique IV (Initialization Vector)**
- Only the owner of the data can access or modify it
- Even a leaked database **cannot reveal secrets** without the encryption key

This simulates how professional tools like:
- 1Password
- Bitwarden
- Chrome Password Manager  
work internally.

---

## 🧠 Core Security Concept (Zero-Trust Design)

> The backend assumes the database can be compromised.  
> Security is enforced at the **field level**, not just the route level.

### Security Layers
```
JWT Authentication → Ownership Check → Field-Level Encryption
```

---

## 🏗️ Architecture

### Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT (Authentication)
- Node Crypto (AES Encryption)
- dotenv (Environment Variables)

---

## 🔐 Data Model

### Vault Schema
```json
{
  "user": "ObjectId (User Reference)",
  "siteName": "String",
  "siteUrl": "String",
  "login": "String",
  "encryptedPassword": "String",
  "iv": "String (hex)",
  "createdAt": "Date"
}
```

### Field Meaning
| Field | Purpose |
|-------|---------|
| `user` | Ownership & data isolation |
| `siteName` | Website name |
| `siteUrl` | Website link |
| `login` | Username/email for the site |
| `encryptedPassword` | AES-encrypted password |
| `iv` | Initialization Vector (used to decrypt) |

---

## 🔑 Encryption vs Hashing

| Feature | Hashing | Encryption |
|---------|----------|-------------|
| Reversible | ❌ No | ✅ Yes |
| Used For | Login passwords | Stored secrets |
| Example | bcrypt | AES-256 |

### This Project Uses
- **Hashing** → User login passwords
- **Encryption** → Vault-stored passwords

---

## 🔐 Encryption Design

### Algorithm
```
AES-256-CBC
```
- 256-bit encryption key
- Unique IV per record
- Secure against pattern attacks

### Encryption Flow
```
Plain Password
   ↓ encrypt(KEY, IV)
Encrypted Password → Stored in Database
```

### Decryption Flow
```
Encrypted Password
   ↓ decrypt(KEY, IV)
Plain Password → Sent to User
```

---

## 🔑 Key Management

### Where the key lives
- `.env` file
- Environment variables in production

### Where it NEVER lives
- Database
- Frontend
- GitHub
- Logs

### Rule
> If DB leaks → data safe  
> If key leaks → system compromised

---

## 📦 API Endpoints

### ➕ Add Vault Item
```
POST /api/v1/vault
```
**Body**
```json
{
  "siteName": "GitHub",
  "siteUrl": "https://github.com",
  "login": "user@email.com",
  "password": "mySecret123"
}
```

---

### 👀 Get Vault Items
```
GET /api/v1/vault
```
- Returns decrypted passwords
- Only returns data for logged-in user

---

### ✏️ Update Vault Item
```
PUT /api/v1/vault/:id
```
- Re-encrypts password if updated
- Ownership enforced

---

### 🗑 Delete Vault Item
```
DELETE /api/v1/vault/:id
```
- Only owner can delete

---

## 🔐 Authentication Flow

1. User logs in
2. Receives JWT token
3. Token sent in headers:
```
Authorization: Bearer <JWT>
```
4. Middleware verifies token
5. Controllers enforce ownership

---

## 🧪 Testing (Postman Flow)

1. Login → get JWT
2. Add vault item
3. Fetch vault items
4. Update password
5. Delete vault item

---

## 🧠 Concepts Learned

### Backend Engineering
- Zero-trust architecture
- Field-level security
- Secure key management
- Threat modeling

### Security
- AES encryption
- IV usage
- Hashing vs encryption
- JWT authentication
- Ownership enforcement

### MongoDB
- ObjectId ownership queries
- Secure schema design
- Data isolation

---

## ⚠️ Common Security Mistakes Avoided

- ❌ Storing plaintext passwords
- ❌ Storing encryption key in DB
- ❌ Returning secrets without auth
- ❌ Reusing IVs
- ❌ Trusting client-side security

---

## 📈 Future Enhancements

- Master password layer
- Password strength analysis
- Search & pagination
- Encrypted backups
- Password sharing (secure key exchange)

---

## 🧾 Resume-Ready Description

> Built a zero-trust password vault backend using AES-256 encryption with per-record IVs, JWT-based authentication, ownership-based access control, and secure environment-based key management to protect sensitive user credentials even in the event of database compromise.

---

## 🏁 Final Takeaway

> This project is not about storing passwords.  
> It’s about **designing systems that remain secure even after failure.**

---

## 📜 License
MIT License
