# Dr. Reach Server Documentation

## Overview

This is the backend server for the Dr. Reach healthcare platform, built with NestJS and using Prisma ORM for database management. The server provides APIs for patient-doctor interactions, appointment management, and medical record keeping.

## Project Structure

```directory
src/
├── admin/          # Admin management functionality
├── auth/           # Authentication and authorization
├── service-providers/  # Healthcare provider management
├── user/           # User management and profiles
├── utils/          # Utility functions
└── storage/        # File storage management
```

## Core Features

- User Authentication & Authorization
- Healthcare Provider Management
- Appointment Scheduling
- Medical Records Management
- Admin Dashboard Support
- File Upload/Storage

## API Endpoints

### Authentication

The server implements a secure JWT (JSON Web Tokens) based authentication system with refresh token support. The authentication flow uses two types of tokens: access tokens and refresh tokens, providing a secure and efficient authentication mechanism.

#### Authentication Endpoints

```typescript
POST /auth/signup
Description: Register a new user
Request Body: {
    "email": string,
    "password": string
}
Response: {
    "user": UserObject,
    "message": "User created successfully"
}

POST /auth/login
Description: Authenticate user and receive tokens
Request Body: {
    "email": string,
    "password": string
}
Response: {
    "user": UserObject,
    "backendToken": {
        "accessToken": string,
        "refreshToken": string,
        "expiresIn": number  // Timestamp when the token expires
    }
}

POST /auth/refresh
Description: Get new access token using refresh token
Headers Required: {
    "Authorization": "Bearer <refresh_token>"
}
Response: {
    "accessToken": string,
    "refreshToken": string,
    "expiresIn": number
}
```

#### Token Management

1. **Access Token**

   - Duration: 24 hours
   - Used for authenticating API requests
   - Include in Authorization header as `Bearer <token>`
   - Contains user information and permissions

2. **Refresh Token**
   - Duration: 7 days
   - Used to obtain new access tokens
   - More secure, longer-lived token
   - Store securely on client side

#### Using Authentication

1. **Making Authenticated Requests**

   ```typescript
   Headers: {
       "Authorization": "Bearer <access_token>"
   }
   ```

2. **Token Expiration Handling**

   - When access token expires (401 response), use refresh token to get new tokens
   - If refresh token is expired, redirect to login

3. **Security Measures**

   - Tokens are signed with different secrets (ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET)
   - JWT validation includes signature verification and expiration checks
   - Implements protection against common attacks:
     - Token hijacking
     - Replay attacks
     - CSRF attacks

4. **Error Responses**

   ```json
   401 Unauthorized: {
       "statusCode": 401,
       "message": "Unauthorized",
       "error": "Invalid credentials" | "Invalid or expired token" | "Token is missing"
   }
   ```

#### Protected Routes

All API endpoints except `/auth/login` and `/auth/signup` require authentication. Protected routes will return:

- 401 if no token is provided
- 401 if the token is invalid or expired
- 403 if the user doesn't have sufficient permissions

#### Best Practices

1. Store tokens securely:
   - Access token in memory
   - Refresh token in secure HTTP-only cookie or secure storage
2. Clear tokens on logout
3. Implement token refresh mechanism before access token expires
4. Handle token validation errors gracefully
5. Never send tokens in URL parameters

### User Management

```typescript
POST   /user/signup                     # Create new user account
POST   /user/updateUser                 # Update user profile with optional profile image
POST   /user/applyForServiceProvider    # Apply to become a service provider
GET    /user/doctors                    # Get list of approved doctors
GET    /user/getApprovedServiceProviders # Get all approved service providers
GET    /user/findServiceProvidersByHomeVisit # Get providers offering home visits
GET    /user/findDoctorbyVideoConsultation  # Get doctors offering video consultations
GET    /user/getServiceProvider/:username   # Get specific provider details
GET    /user/getAppointments/:userId       # Get user's appointments
POST   /user/addReview                     # Add review for a service provider
GET    /user/getPopularDoctors            # Get list of popular doctors
```

### Service Provider Endpoints

```typescript
POST   /provider/updateServiceProvider     # Update provider profile
POST   /provider/updateSchedule            # Update availability schedule
POST   /provider/uploadProviderProfile     # Upload provider profile image
POST   /provider/checkProviderAvailability # Check provider's availability
POST   /provider/bookAppointment          # Book an appointment
POST   /provider/integratedBookAppointment # Book integrated care appointment
POST   /provider/actionOnPatients         # Approve/reject/cancel patient appointments
POST   /provider/addMedicalRecord         # Add medical record for patient
POST   /provider/addDocument              # Add provider documents
POST   /provider/removeDocument           # Remove provider documents
GET    /provider/getProviderById/:providerId # Get provider details
GET    /provider/getSchedule/:userId      # Get provider's schedule
GET    /provider/getServiceProvider       # Get provider details with availability
GET    /provider/getScheduleByHomeCare    # Get home care schedule
GET    /provider/getPatients/:providerId  # Get provider's patients
GET    /provider/getPatientMedicalByProvider # Get patient's medical records
GET    /provider/getPatientsMedicalBySelf   # Get self medical records
GET    /provider/getPatientsInfo          # Get patient information
```

### Admin Endpoints

```typescript
GET    /admin/getAllUsers              # Get list of all registered users
GET    /admin/getUnverifiedProvider   # Get list of unverified service providers
GET    /admin/getAppointments         # Get all appointments with optional filters
POST   /admin/actionOnProvider        # Approve/Reject service provider applications
```

#### Admin Endpoints Details

1. **Get All Users**

```typescript
GET /admin/getAllUsers
Response: List of all registered users in the system
```

2. **Get Unverified Providers**

```typescript
GET /admin/getUnverifiedProvider
Response: List of service providers pending verification
```

3. **Get Appointments**

```typescript
GET /admin/getAppointments
Query Parameters:
  - status: string (optional)
  - serviceProviderId: string (optional)
  - userId: string (optional)
  - page: number (default: 1)
  - limit: number (default: 10)
Response: {
  data: Appointment[],
  total: number,
  page: number,
  limit: number
}
```

4. **Action on Provider**

```typescript
POST /admin/actionOnProvider
Body: {
  userId: string,
  action: string,
  providerType: ProviderType
}
Description: Approve or reject service provider applications
ProviderType options: DOCTOR, NURSE, PHYSIOTHERAPIST, etc.
```

## File Upload

The server supports file uploads for:

- Profile images
- Medical records
- Provider documents

Files are stored in the `/uploads` directory with proper access controls.

## Environment Configuration

The server requires the following environment variables:

- `PORT`: Server port (default: 4000)
- `DATABASE_URL`: Prisma database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- Other environment-specific configurations

## CORS Configuration

The server is configured to accept requests from:

- <http://localhost:3000> (development)
- Other whitelisted origins as configured in main.ts

## Error Handling

The server implements standardized error responses:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Each error response includes:

```json
{
  "statusCode": number,
  "message": string,
  "error": string
}
```
