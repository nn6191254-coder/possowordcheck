# SecureCheck Backend API

## Overview

The SecureCheck backend provides non-sensitive application content and administrative management. Password analysis stays entirely client-side and never travels to the API.

## Health

### GET /api/health

Returns server health.

Request:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "data": {
    "status": "healthy"
  }
}
```

## Security Tips

### GET /api/security-tips

Returns published tips.

Query parameters:

- category: optional filter such as passwords

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "tip-1",
      "title": "Use Long Passwords",
      "category": "passwords",
      "priority": "high",
      "isPublished": true,
      "description": "Longer passwords are harder for attackers to guess."
    }
  ]
}
```

### POST /api/admin/security-tips

Requires admin authentication.

### PUT /api/admin/security-tips/:id

Requires admin authentication.

### DELETE /api/admin/security-tips/:id

Requires admin authentication.

## Feedback

### POST /api/feedback

Request body:

```json
{
  "rating": 5,
  "message": "The analyzer was useful",
  "category": "general"
}
```

Validation:

- rating is an integer from 1 to 5
- message is 2 to 500 characters
- category is a supported enum value

## Contact

### POST /api/contact

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Need more detail",
  "message": "I would like to learn more about the product."
}
```

Validation:

- strict email validation
- name and subject length limits
- message size capped to 2000 characters

## Admin Authentication

### POST /api/admin/login

Request body:

```json
{
  "email": "admin@securecheck.local",
  "password": "ChangeMeStrongly!"
}
```

Returns a secure JWT and sets an HTTP-only cookie when appropriate.

### GET /api/admin/dashboard

Requires admin authentication.

## Error Handling

Errors are returned in a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

Common error codes include:

- VALIDATION_ERROR
- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- RATE_LIMITED
- SERVER_ERROR
