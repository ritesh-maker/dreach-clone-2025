import {
	IDoctor,
	EDoctorStatus,
	EClinicRole,
	EClinicPermissions,
	IClinicStaff,
} from "./doctor.d.types";
import {
	Hospital,
	EHospitalStatus,
	EHospitalStaffRole,
	EHospitalSpecialization,
} from "./hospital.d.types";
import { Lab, ELabStatus } from "./lab.d.types";
import { Pharmaceutical, EPharmacyStatus } from "./pharmaceutical.d.types";
import { Ambulance, EAmbulanceStatus } from "./ambulance.d.types";

export enum EProviderType {
	DOCTOR = "Doctor",
	HOSPITAL = "Hospital",
	LAB = "Lab",
	NURSING = "Nursing",
	DOCTOR_ASSISTANT = "DoctorsAssistant",
}

export interface IAddress {
	id: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
}

export interface ITimeSlot {
	startTime: string;
	endTime: string;
}

export interface IOperatingHours {
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

export interface IContactInfo {
	phone: string[];
	email: string;
	website?: string;
	emergencyContact?: string;
}

export interface IReview {
	id: string;
	userId: string;
	rating: number;
	comment?: string;
	createdAt: Date;
	departmentId?: string;
	staffId?: string;
	treatmentType?: string;
	visitType?: "INPATIENT" | "OUTPATIENT" | "EMERGENCY";
	verifiedVisit: boolean;
}

export type ProviderStatus =
	| EDoctorStatus
	| EHospitalStatus
	| ELabStatus
	| EPharmacyStatus
	| EAmbulanceStatus;

export interface IBaseProvider {
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

export type Provider =
	| (IBaseProvider & IDoctor)
	| (IBaseProvider & Hospital)
	| (IBaseProvider & Lab)
	| (IBaseProvider & Pharmaceutical)
	| (IBaseProvider & IClinicStaff);
