# Backend Technical Documentation - API Guide

This document provides a comprehensive guide to the backend API of **The Gathering**. It includes details on all available endpoints, their access requirements, and JSON samples for requests and responses.

## Base URL

`http://localhost:5000/api`

---

## 🔐 Auth Module

Handles user registration, login, and email verification.

### 1. Register User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response (201)**:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "isVerified": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### 2. Login User

- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Response (200)**:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "isVerified": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### 3. Verify Email

- **URL**: `/auth/verify/:token`
- **Method**: `GET`
- **Access**: Public
- **Response (200)**:

```json
{
  "message": "Email verified successfully"
}
```

---

## 👤 User Module

User profile management.

### 1. Get Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Access**: Private (User Token Required)
- **Response (200)**:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "username": "johndoe",
  "email": "john@example.com",
  "avatar": "url_to_avatar",
  "bio": "Hello world",
  "phoneNumber": "123456789",
  "role": "user",
  "isVerified": true
}
```

### 2. Update Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Access**: Private (User Token Required)
- **Request Body**:

```json
{
  "username": "newusername",
  "bio": "Updated bio",
  "avatar": "new_avatar_url"
}
```

---

## 📅 Event Module

Management of virtual and in-person events.

### 1. Get All Events

- **URL**: `/events`
- **Method**: `GET`
- **Access**: Public
- **Response (200)**:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c86",
      "title": "Welcome Gathering",
      "description": "Virtual welcome event",
      "type": "virtual",
      "date": "2026-03-01T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "12:00",
      "host": { "username": "admin" },
      "capacity": 100
    }
  ]
}
```

### 2. Create Event

- **URL**: `/events`
- **Method**: `POST`
- **Access**: Private (Any Registered User)
- **Request Body**:

```json
{
  "title": "My Community Event",
  "description": "A gathering for all",
  "type": "virtual",
  "date": "2026-04-15",
  "startTime": "14:00",
  "endTime": "16:00",
  "meetingLink": "https://zoom.us/j/123",
  "capacity": 50
}
```

### 3. Update/Delete Event

- **URL**: `/events/:id`
- **Method**: `PUT` / `DELETE`
- **Access**: Private (Owner or Admin)

### 4. Invite User

- **URL**: `/events/:id/invite`
- **Method**: `POST`
- **Access**: Private (Host/Owner)
- **Request Body**:

```json
{
  "email": "friend@example.com"
}
```

---

## 🎟️ Booking Module

Event participation management.

### 1. Book Event

- **URL**: `/bookings/event/:eventId` (or POST `/api/bookings/event/:eventId`)
- **Method**: `POST`
- **Access**: Private
- **Response (201)**:

```json
{
  "success": true,
  "data": {
    "event": "60d21b4667d0d8992e610c86",
    "user": "60d21b4667d0d8992e610c85",
    "status": "confirmed"
  }
}
```

### 2. Get My Bookings

- **URL**: `/bookings/my`
- **Method**: `GET`
- **Access**: Private

---

## 💬 Forum Module

Community discussions and posts.

### 1. Create Topic

- **URL**: `/forum/topics`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:

```json
{
  "title": "Discussion on Future Tech",
  "content": "What do you think about AGIs?",
  "category": "Technology"
}
```

### 2. Create Post (Reply)

- **URL**: `/forum/topics/:topicId/posts`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:

```json
{
  "content": "I think memory-safe languages are the future."
}
```

---

## 🛠️ Service Module

Marketplace for services provided by community members.

### 1. Get All Services

- **URL**: `/services`
- **Method**: `GET`
- **Access**: Public
- **Query Params**: `search`, `category`, `city`

### 2. Create Service

- **URL**: `/services`
- **Method**: `POST`
- **Access**: Private
- **Request Body**:

```json
{
  "name": "Graphic Design",
  "description": "Professional logo design",
  "category": "Design",
  "price": 50,
  "location": { "city": "Saigon" }
}
```

---

## 🏠 Room Module

Breakout rooms and space management for events.

### 1. Get Rooms by Event

- **URL**: `/rooms?event=:eventId` (or `/api/rooms?event=...`)
- **Method**: `GET`
- **Access**: Public
- **Response (200)**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "name": "General Room",
      "type": "general",
      "capacity": 50
    }
  ]
}
```

### 2. Create Room

- **URL**: `/rooms`
- **Method**: `POST`
- **Access**: Private (Event Owner or Admin)
- **Request Body**:

```json
{
  "name": "Breakout A",
  "description": "UI/UX Discussion",
  "event": "eventId_here",
  "type": "breakout",
  "capacity": 10
}
```

---

## 👑 Admin Management Module

System-wide administrative operations. Restricted to users with `admin` role.

### 1. Get System Stats

- **URL**: `/admin/stats`
- **Method**: `GET`
- **Access**: Private/Admin
- **Response**:

```json
{
  "success": true,
  "data": {
    "users": 150,
    "events": 45,
    "rooms": 12,
    "bookings": 320
  }
}
```

### 2. User Management

- **Routes**:
  - `GET /admin/users` - List all users
  - `GET /admin/users/:id` - Get user details
  - `PUT /admin/users/:id` - Update user (e.g., change role/status)
  - `DELETE /admin/users/:id` - Delete user
- **Access**: Private/Admin

---

## 📚 Resource Module

Digital library resources.

### 1. Get Resources

- **URL**: `/resources`
- **Method**: `GET`
- **Access**: Public
- **Query Params**: `search`, `type`, `format`
