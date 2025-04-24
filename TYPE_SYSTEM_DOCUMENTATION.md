# Dr. Reach Healthcare Platform Type System Documentation

## Table of Contents

- [Core Type System Architecture](#core-type-system-architecture)
- [Provider System](#provider-system)
- [User Management System](#user-management-system)
- [Appointment Management](#appointment-management)
- [Staff Management System](#staff-management-system)
- [Medical Records System](#medical-records-system)
- [Authentication System](#authentication-system)
- [Supporting Types](#supporting-types)
- [Status and Role Enums](#status-and-role-enums)
- [Relationships and Workflows](#relationships-and-workflows)
- [Form Schemas](#form-schemas)

## Core Type System Architecture

### Base Provider (`IBaseProvider`)

The foundation for all healthcare providers:

```typescript
interface IBaseProvider {
 id: string;
 type: EProviderType;
 name: string;
 address: IAddress[];
 contact: IContactInfo;
 operatingHours: IOperatingHours;
 rating?: number;
 reviews?: IReview[];
 isVerified: boolean;
 status: ProviderStatus;
 role?: EClinicRole | EHospitalStaffRole;
 clinicId?: string;
 permissions?: EClinicPermissions[];
 specialization?: string[] | EHospitalSpecialization[];
 departments?: string[];
 staffRole?: {
  type: "CLINIC" | "HOSPITAL";
  role: EClinicRole | EHospitalStaffRole;
 };
}
```

## Provider System

### Doctor System (`IDoctor`)

```typescript
interface IDoctor {
 id: string;
 platform_id?: string; // Platform registration ID for certification
 userId?: string; // User ID
 firstName: string;
 lastName: string;
 specialization: string[];
 degree: string[];
 experience: number;
 registrationNumber: string;
 clinic?: IClinicInfo[];
 availability?: IAvailability[];
 profileImage?: string;
 isVerified: boolean;
 status: EDoctorStatus;
 consultMode: EDoctorConsultMode[];
 consultationFee?: number;
 languages: string[];
 expertise?: string[];
 education: {
  degree: string;
  institution: string;
  year: number;
 }[];
 ratings?: {
  average: number;
  total: number;
 };
}

interface IClinicInfo {
 id: string;
 name: string;
 address: IAddress[];
 role: EClinicRole;
 startDate: Date;
 endDate?: Date;
 contact: IContactInfo[];
}

interface IAvailability {
 day: EDayOfWeek[];
 slots: {
  startTime: string;
  endTime: string;
  isBooked: boolean;
 }[];
 clinicId: string;
}
```

### Featured Doctor (`IFeaturedDoctor`)

```typescript
interface IFeaturedDoctor extends IDoctor {
 nextAvailable: string;
 availableSlots: number;
 consultationFee: number; // Required for featured doctors
 isBookmarked?: boolean;
 address: IAddress[];
 contact: IContactInfo[];
 featured: boolean;
 rating: number;
 totalRatings?: number;
 nextAvailableSlot?: {
  date: string;
  time: string;
 };
 languages?: string[];
}
```

### Hospital System (`Hospital`)

```typescript
interface Hospital {
 id: string;
 name: string;
 address: IAddress[];
 contact: IContactInfo;
 facilities: IHospitalFacility[];
 departments: IHospitalDepartment[];
 accreditation?: string[];
 operatingHours: IOperatingHours;
 emergencyServices: boolean;
 capacity?: IHospitalCapacity;
 staff?: IHospitalStaff;
 status: EHospitalStatus;
}
```

### Laboratory System (`Lab`)

```typescript
interface Lab {
 id: string;
 name: string;
 address: IAddress[];
 contact: LabContactInfo;
 services: LabService[];
 operatingHours: OperatingHours;
 accreditation?: string[];
 isHomeCollection: boolean;
 status: ELabStatus;
}
```

### Pharmaceutical System (`Pharmaceutical`)

```typescript
interface Pharmaceutical {
 id: string;
 name: string;
 address: IAddress[];
 contact: PharmacyContactInfo;
 license: string;
 operatingHours: OperatingHours;
 inventory: DrugInventory[];
 deliveryAvailable: boolean;
 status: EPharmacyStatus;
}
```

### Ambulance System (`Ambulance`)

```typescript
interface Ambulance {
 id: string;
 serviceProvider: string;
 vehicleNumber: string;
 vehicleType: EAmbulanceType;
 equipment: Equipment[];
 staff: AmbulanceStaff[];
 contact: AmbulanceContactInfo;
 currentLocation?: Coordinates;
 status: EAmbulanceStatus;
 availability: boolean;
}
```

### Clinic Staff Types

```typescript
interface IClinicStaff {
 id: string;
 clinicId: string;
 role: EClinicRole;
 permissions: EClinicPermissions[];
 joinDate: Date;
 contact: IContactInfo;
 availability: {
  regularHours: IOperatingHours;
  onCall: boolean;
 };
}

interface IReceptionist extends IClinicStaff {
 managedDoctors: string[]; // Array of doctor IDs
 appointmentManagement: {
  canSchedule: boolean;
  canReschedule: boolean;
  canCancel: boolean;
  canConfirm: boolean;
 };
}

interface IAssistantDoctor extends IClinicStaff {
 degree: string[];
 specialization: string[];
 registrationNumber: string;
 supervisingDoctor: string; // Primary doctor's ID
 canPrescribe: boolean;
 consultationRights: {
  independent: boolean;
  supervisedOnly: boolean;
 };
}

interface INurse extends IClinicStaff {
 certification: string[];
 specializations?: string[];
 dutyType: "FULL_TIME" | "PART_TIME" | "ON_CALL";
}

interface IAppointmentManager {
 clinicId: string;
 staffId: string;
 role: EClinicRole;
 permissions: EClinicPermissions[];
 actions: {
  lastModified: Date;
  modifiedBy: string;
  actionType: "SCHEDULE" | "RESCHEDULE" | "CANCEL" | "CONFIRM";
  appointmentId: string;
 }[];
}
```

### Provider Type Union

The `Provider` type combines all provider types with the base provider interface:

```typescript
type Provider =
 | (IBaseProvider & IDoctor)
 | (IBaseProvider & Hospital)
 | (IBaseProvider & Lab)
 | (IBaseProvider & Pharmaceutical)
 | (IBaseProvider & IClinicStaff);
```

## User Management System

### Base User (`IUser`)

```typescript
interface IUser {
 id: string;
 firstName: string;
 lastName: string;
 email: string;
 phone: string;
 dob: Date;
 gender: EGender;
 address: IAddress[];
 role: EUserRole;
 status: EUserStatus;
 profileImage?: string;
 createdAt: Date;
 updatedAt: Date;
}
```

### Patient (`IPatient`)

```typescript
interface IPatient extends IUser {
 medicalRecords?: IMedicalRecord[];
 emergencyContacts: IEmergencyContact[];
 insurance?: IInsurance;
 appointments?: string[];
 prescriptions?: string[];
 bloodGroup?: EBloodGroup;
 allergies?: string[];
}
```

### Medical History (`IMedicalHistory`)

```typescript
interface IMedicalHistory {
 conditions: IMedicalCondition[];
 surgeries?: ISurgery[];
 medications?: IMedication[];
 familyHistory?: string[];
 lifestyle?: ILifestyle;
}
```

## Appointment Management

### Appointment System

```typescript
interface Appointment {
 id: string;
 patientId: string;
 providerId: string;
 providerType: EProviderType;
 dateTime: Date;
 status: EAppointmentStatus;
 service: EAppointmentMode;
 reason?: string;
 notes?: string;
 payment?: PaymentInfo;
}

interface PaymentInfo {
 amount: number;
 status: EPaymentStatus;
 method?: string;
 transactionId?: string;
}
```

## Staff Management System

### Base Staff Member (`IBaseStaffMember`)

```typescript
interface IBaseStaffMember {
 id: string;
 firstName: string;
 lastName: string;
 contact: IContactInfo;
 joinDate: Date;
 status: EStaffStatus;
 qualification: string[];
 profileImage?: string;
 languages: string[];
 experience: {
  years: number;
  previousWorkplaces?: string[];
 };
 availability: {
  regularHours: IOperatingHours;
  emergencyAvailable: boolean;
  onCall: boolean;
  nextAvailableSlot?: Date;
 };
}
```

### Hospital Staff (`IHospitalStaffMember`)

```typescript
interface IHospitalStaffMember extends IBaseStaffMember {
 hospitalId: string;
 role: EHospitalStaffRole;
 department?: string;
 specialization: EHospitalSpecialization[];
 registrationNumber?: string;
 shifts: IHospitalShift[];
 permissions: EHospitalPermissions[];
 consultationFee?: number;
 patientLimit?: {
  daily: number;
  current: number;
 };
 expertise?: string[];
 education: {
  degree: string;
  institution: string;
  year: number;
 }[];
 ratings?: {
  average: number;
  total: number;
  reviews?: IStaffReview[];
 };
}
```

## Medical Records System

### Medical Record (`IMedicalRecord`)

```typescript
interface IMedicalRecord {
 id: string;
 patientId: string;
 providerId: string;
 providerType: EProviderType;
 recordType:
  | "CONSULTATION"
  | "PRESCRIPTION"
  | "LAB_RESULT"
  | "PROCEDURE"
  | "FOLLOW_UP";
 date: Date;
 diagnosis?: string[];
 symptoms?: string[];
 prescriptions?: {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
 }[];
 labResults?: {
  testName: string;
  result: string;
  normalRange?: string;
  interpretation?: string;
 }[];
 vitals?: {
  bloodPressure?: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
 };
 notes?: string;
 attachments?: {
  type: string;
  url: string;
  description?: string;
 }[];
 followUpDate?: Date;
 createdBy: string;
 updatedBy?: string;
 createdAt: Date;
 updatedAt?: Date;
}
```

## Authentication System

### Auth User (`IAuthUser`)

```typescript
interface IAuthUser {
 id: string;
 email: string;
 phone: string;
 name: string;
 userType: "Patient" | "Provider";
 providerType?: "Doctor" | "Hospital" | "Lab" | "Nursing" | "DoctorsAssistant";
 isVerified: boolean;
 createdAt: Date;
 updatedAt: Date;
}
```

## Supporting Types

### Common Types

- `ITimeSlot`: Time management
- `IOperatingHours`: Schedule management
- `IAddress`: Location information
- `IContactInfo`: Contact details
- `IReview`: Feedback system

### Operating Hours

```typescript
interface IOperatingHours {
 regular: ITimeSlot;
 weekends?: ITimeSlot;
 holidays?: ITimeSlot;
 emergency?: {
  available: boolean;
  hours: ITimeSlot;
 };
 departments?: {
  [departmentId: string]: ITimeSlot;
 };
}
```

## Status and Role Enums

### Provider Types (`EProviderType`)

```typescript
enum EProviderType {
 Doctor = "Doctor",
 Hospital = "Hospital",
 Lab = "Lab",
 Nursing = "Nursing",
 DoctorsAssistant = "DoctorsAssistant",
}
```

### User Roles (`EUserRole`)

```typescript
enum EUserRole {
 PATIENT = "Patient",
 DOCTOR = "Doctor",
 ADMIN = "Admin",
 SUPERADMIN = "SuperAdmin",
 HOSPITAL = "Hospital",
 LAB = "Lab",
 NURSING = "Nursing",
 DOCTORSASSISTANT = "DoctorsAssistant",
 PHARMACEUTICAL = "Pharmaceutical",
}
```

### Doctor Status and Consultation Modes

```typescript
enum EDoctorStatus {
 ONLINE = "Online",
 OFFLINE = "Offline",
 BUSY = "Busy",
 ON_LEAVE = "OnLeave",
 SUSPENDED = "Suspended",
}

enum EDoctorConsultMode {
 VIDEO = "Video",
 IN_PERSON = "InPerson",
 HOME_VISIT = "HomeVisit",
 CLINIC = "Clinic",
 HYBRID = "Hybrid",
}

enum EDayOfWeek {
 SUNDAY = "SUNDAY",
 MONDAY = "MONDAY",
 TUESDAY = "TUESDAY",
 WEDNESDAY = "WEDNESDAY",
 THURSDAY = "THURSDAY",
 FRIDAY = "FRIDAY",
 SATURDAY = "SATURDAY",
}

enum EClinicRole {
 OWNER = "Owner",
 ADMIN = "Admin",
 DOCTOR = "Doctor",
 STAFF = "Staff",
}

enum EClinicPermissions {
 MANAGE_STAFF = "ManageStaff",
 MANAGE_APPOINTMENTS = "ManageAppointments",
 MANAGE_PATIENTS = "ManagePatients",
 MANAGE_BILLING = "ManageBilling",
 VIEW_REPORTS = "ViewReports",
}
```

### Status Enums

- `EDoctorStatus`: Online, Offline, Suspended, etc.
- `EHospitalStatus`: Active, Inactive, Under Maintenance, etc.
- `EAppointmentStatus`: Scheduled, Confirmed, Completed, etc.
- `ELabStatus`: Active, Inactive, Suspended
- `EPharmacyStatus`: Active, Inactive, Suspended
- `EUserStatus`: Active, Inactive, Suspended, Pending

## Relationships and Workflows

### Provider-Patient Relationship

1. Providers (`IBaseProvider` derivatives) connect with patients (`IPatient`) through:

   - Appointments (`Appointment`)
   - Medical Records (`IMedicalRecord`)
   - Reviews (`IReview`)

2. Staff-Provider Relationship:

   - Staff members (`IBaseStaffMember`) are associated with providers
   - Different roles and permissions based on provider type
   - Specialized staff types for different provider categories

3. Appointment Workflow:

   - Created through `Appointment` interface
   - Links patient, provider, and service type
   - Includes payment processing
   - Status tracking through lifecycle

4. Medical Records Workflow:

   - Created by providers
   - Linked to patients
   - Different types (consultations, prescriptions, lab results)
   - Attachments and documentation support

5. Authentication Flow:

   - User authentication through `IAuthUser`
   - Role-based access control
   - Provider type-specific verification

6. Review and Rating System:

   - Providers can be reviewed (`IReview`)
   - Staff members can be rated
   - Verified visit tracking

7. Operating Hours and Availability:

   - Providers set operating hours (`IOperatingHours`)
   - Staff availability tracking
   - Emergency service handling

8. Department and Facility Management:
   - Hospitals manage departments (`IHospitalDepartment`)
   - Staff assignments to departments
   - Facility tracking and maintenance

The type system ensures:

- Complete type safety across the application
- Clear data structure definitions
- Consistent interface implementations
- Proper relationship mapping between entities
- Scalable provider management
- Comprehensive medical record tracking
- Efficient appointment scheduling
- Robust user role management

All type definitions include TypeScript features:

- Optional properties
- Union types
- Complex nested structures
- Proper type inheritance
- Enum-based status tracking
- Generic type support where needed

## Form Schemas

```typescript
// Doctor Management Forms
const addDoctorSchema = z.object({
 name: z.string().min(3, "Name must be at least 3 characters"),
 email: z.string().email("Invalid email address"),
 registrationNumber: z.string().min(3, "Registration number is required"),
 specialization: z
  .array(z.string())
  .min(1, "At least one specialization is required"),
 experience: z.number().min(0, "Experience must be a positive number"),
 phone: z.string().min(10, "Phone number must be at least 10 digits"),
 degree: z.array(z.string()).min(1, "At least one degree is required"),
});

type AddDoctorForm = z.infer<typeof addDoctorSchema>;
```
