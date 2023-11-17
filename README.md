# Express Authentication and Authorization (Multi Role)

Express API with basic routes:

- Express
- joi
- sequelize
- mysql2
- jwt
- dotenv
- nodemailer

---

## ABOUT

Berikut ini merupakan API management tugas dengan authentication dan authorization. Terdapat tabel user dan tabel task, hubungannya one-to-many, artinya setiap user dapat memiliki banyak task.

## Aksi yang Dapat Dilakukan

### Auth Actions

- **Login**
- **Register**

### Admin Actions

- **Get All Tasks**: Memperoleh daftar semua tugas.
- **Create Task**: Menambahkan tugas baru.
- **Update Task**: Mengubah informasi tugas.
- **Delete Task**: Menghapus tugas.
- **Get All Users**: Mendapatkan daftar semua pengguna.
- **Delete User**: Menghapus pengguna.

### User Actions

- **Get User by ID**: Memperoleh informasi pengguna berdasarkan ID.
- **Update User**: Mengubah informasi pengguna.
- **Change Password**: Mengganti kata sandi.
- **Update Task User**: Mengubah status tugas.

### Common Actions for Admin and User

- **Forgot Password**: Memulihkan kata sandi yang terlupakan melalui email.

## URL

SERVER

```
http://localhost:3000
```

LIST ENTITIES

1. [Auth](#Auth)
2. [Admin](#Admin)
3. [User](#User)

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (401)_

```
{
    "message": "Authentication failed, you need token"
}
```

_Response (403)_

```
{
    "message": "Invalid token",
    "error": "Token verification failed"
}
```

_Response (403 - Forbidden Access)_

```
{
    "message": "Unauthorized, only admin can hit this action"
}
```

_Response (404 - Not Found)_

```
{
    "message": "API not found"
}
```

---

# RESTful endpoints

## AUTH (LOGIN AND REGISTER)

### REGISTER (POST)

Example

```
localhost:3000/api/register
```

_Request Header_

```
not needed
```

_Request Body_

```
{
    "name": "user2",
    "password": "123456",
    "email": "user2@gmail.com",
    "phone": "081382822121",
    "domicile": "Jakarta"
}
```

_Response (201)_

```
{
    "data": {
        "role": 2,
        "id": 2,
        "name": "user2",
        "password": "$2a$10$ryV315AKOHqdGZPD2Z3oI.8Gek8lnuTnhHsVghB6Iv0BYxYan.Sa6",
        "email": "user2@gmail.com",
        "phone": "081382822121",
        "domicile": "Jakarta"
    },
    "message": "User created successfully"
}
```

_Response (400)_ -> All field required, exclude role, default role is 2 (user)

```
{
    "status": "Validation Failed",
    "message": "\"domicile\" is not allowed to be empty"
}
```

_Response (400)_

```
{
    "message": "Phone number already exists"
}
```

_Response (400)_

```
{
    "message": "Email has already exists"
}
```

---

### LOGIN (POST)

Example

```
localhost:3000/api/login
```

_Request Header_

```
not needed
```

_Request Body_

```
{
    "email": "user1@gmail.com",
    "password": "123456"
}
```

_Response (200)_

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MiwiaWF0IjoxNzAwMjA4OTc0LCJleHAiOjE3MDAyMTI1NzR9.6MLR8zDuBvtB1QXUc2jWMA5-CLtjfPjTTvjDf8QQy7Y",
    "message": "Login successful",
    "data": {
        "id": 1,
        "name": "user1",
        "role": 2
    }
}
```

_Response (400)_ -> All field required

```
{
    "status": "Validation Failed",
    "message": "\"email\" is not allowed to be empty"
}
```

_Response (400)_

```
{
    "message": "Invalid email or password"
}
```

---

## ADMIN

### GET ALL USER

Example

```
localhost:3000/api/admin/all-users
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": [
        {
            "id": 3,
            "name": "Sulthan",
            "email": "sulthan@gmail.com",
            "phone": "088812311221",
            "domicile": "Bogor",
            "role": 2,
            "tasks": [
                {
                    "id": 1,
                    "title": "Membuat web API",
                    "description": "Buat menggunakan express, dan buat dokumentasinya",
                    "status": "pending",
                    "userId": 3,
                    "userName": "Sulthan"
                }
            ]
        },
        {
            "id": 1,
            "name": "user1",
            "email": "user1@gmail.com",
            "phone": "081382829810",
            "domicile": "Jakarta",
            "role": 2,
            "tasks": []
        },
        {
            "id": 4,
            "name": "Taufiq",
            "email": "Taufiq@gmail.com",
            "phone": "081381426767",
            "domicile": "Jakarta",
            "role": 1,
            "tasks": []
        }
    ]
}
```

_Response (403)_

```
{
    "message": "Only admins can get all user"
}
```

_Response (400)_

```
{
    "message": "Email has already exists"
}
```

---

### DELETE USER (/api/admin/user/:userId)

Example

```
localhost:3000/api/admin/user/7
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "User deleted successfully"
}
```

_Response (403)_

```
{
    "message": "Only admins can get all tasks"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### CREATE TASK (/api/admin/task)

Example

```
localhost:3000/api/admin/task
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "title": "Membuaat UI mobile",
    "description": "Buat react native, deadline 1 minggu",
    "status": "pending",
    "userId": 3
}
```

_Response (200)_

```
{
    "task": {
        "id": 2,
        "title": "Membuaat UI mobile",
        "description": "Buat react native, deadline 1 minggu",
        "status": "pending",
        "userId": 3,
        "userName": "Sulthan"
    },
    "message": "Task created successfully"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### GET ALL TASK (/api/admin/task)

Example

```
localhost:3000/api/admin/task
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": [
        {
            "id": 1,
            "title": "Membuat web API",
            "description": "Buat menggunakan express, dan buat dokumentasinya",
            "status": "pending",
            "userId": 3,
            "userName": "Sulthan"
        },
        {
            "id": 2,
            "title": "Membuaat UI mobile",
            "description": "Buat react native, deadline 1 minggu",
            "status": "pending",
            "userId": 3,
            "userName": "Sulthan"
        }
    ]
}
```

_Response (403)_

```
{
    "message": "Only admins can get all tasks"
}
```

---

### UPDATE TASK (/api/admin/task/:taskId/user/:userId)

Example

```
localhost:3000/api/admin/task/2/user/3
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "title": "Membuaat UI mobile",
    "description": "Buat react native, deadline ditambah jadi 2 minggu",
    "status": "in-progress"
}
```

_Response (200)_

```
{
    "task": {
        "id": 2,
        "title": "Membuaat UI mobile",
        "description": "Buat react native, deadline ditambah jadi 2 minggu",
        "status": "in-progress",
        "userId": 3,
        "userName": "Sulthan"
    },
    "message": "Task updated successfully"
}
```

_Response (403)_

```
{
    "message": "Only admins can update tasks title and description"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

_Response (404)_

```
{
    "message": "Task not found"
}
```

_Response (404)_

```
{
    "message": "User has no task"
}
```

---

### DELETE TASK (/api/admin/task/:taskId/)

Example

```
localhost:3000/api/admin/task/2
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "Task deleted successfully"
}
```

_Response (403)_

```
{
    "message": "Only admins can delete tasks"
}
```

_Response (404)_

```
{
    "message": "Task not found"
}
```

---

## USER

### GET USER BY ID (/api/user/:userId)

Example

```
localhost:3000/api/admin/3
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data": {
        "id": 3,
        "name": "Sulthan",
        "email": "sulthan@gmail.com",
        "phone": "088812311221",
        "domicile": "Bogor",
        "role": 2,
        "tasks": [
            {
                "id": 1,
                "title": "Membuat web API",
                "description": "Buat menggunakan express, dan buat dokumentasinya",
                "status": "pending",
                "userId": 3
            },
            {
                "id": 3,
                "title": "Membuaat UI mobile",
                "description": "Buat react native, deadline 1 minggu",
                "status": "pending",
                "userId": 3
            }
        ]
    },
    "message": "Successfully get user by id"
}
```

_Response (403)_

```
{
    "message": "Forbidden: You can only view your own account"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### UPDATE USER (/api/user/update/:userId)

Example

```
localhost:3000/api/admin/3
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "name": "Sulthan updated",
    "domicile": "Jakarta Utara"
}
```

_Response (200)_

```
{
    "data": {
        "id": 3,
        "name": "Sulthan updated",
        "email": "sulthan@gmail.com",
        "phone": "088812311221",
        "domicile": "Jakarta Utara",
        "role": 2
    },
    "message": "Successfully updated user"
}
```

_Response (403)_

```
{
    "message": "Forbidden: You can only update your own account"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### UPDATE TASK USER (/api/user/:userId/task/:taskId)

Example

```
localhost:3000/api/user/3/task/1
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "status": "in-progress"
}
```

_Response (200)_

```
{
    "data": {
        "id": 1,
        "title": "Membuat web API",
        "description": "Buat menggunakan express, dan buat dokumentasinya",
        "status": "in-progress",
        "userId": 3,
        "userName": "Sulthan",
        "updatedAt": "2023-11-17T09:56:03.108Z"
    },
    "message": "Task status updated successfully"
}
```

_Response (403)_

```
{
    "message": "Forbidden: You can only update your own account"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### CHANGE PASSWORD (/api/user/password/:userId)

Example

```
localhost:3000/api/user/password/3
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "oldPassword": "123456",
    "newPassword": "1234567"
}
```

_Response (200)_

```
{
    "message": "Password updated successfully"
}
```

_Response (401)_

```
{
    "message": "Invalid old password"
}
```

_Response (403)_

```
{
    "message": "Forbidden: You can only change your own password"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---

### FORGOT PASSWORD (/api/user/forgot)

Example

```
localhost:3000/api/user/password/3
```

_Request Header_

```
Authorization: Bearer <JWT TOKEN>
```

_Request Body_

```
{
    "email": "taufiqoo.sa@gmail.com"
}
```

_Response (200)_

```
{
    "message": "Reset password email sent successfully"
}
```

_Response (404)_

```
{
    "message": "User not found"
}
```

---
