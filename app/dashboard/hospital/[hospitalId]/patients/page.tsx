"use client";

import React from "react";
import { motion } from "framer-motion";
import { PatientManagement } from "@/components/dashboard/hospital/overview/patients";

const PatientsPage: React.FC = () => {
	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="container mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-4xl font-bold text-black-800 dark:text-white">Patient Management</h1>
				<div className="flex items-center space-x-2 text-sm text-gray-500">
					<span>Dashboard</span>
					<span>•</span>
					<span className="text-gray-900 dark:text-gray-100">Patients</span>
				</div>
			</div>

			<PatientManagement />
		</motion.main>
	);
};

export default PatientsPage;
