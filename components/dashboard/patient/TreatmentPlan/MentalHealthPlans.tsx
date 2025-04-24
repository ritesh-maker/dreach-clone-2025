"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface MentalHealthPlan {
  id: string;
  name: string;
  date: string;
  type: "Therapy" | "Counseling" | "Stress Management" | "Mindfulness";
  status: "Active" | "Completed" | "Upcoming";
  goals: string[];
  objectives: string[];
}

interface MentalHealthPlansProps {
  plans: MentalHealthPlan[];
}

const MentalHealthPlans: React.FC<MentalHealthPlansProps> = ({ plans }) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const getStatusColor = (status: MentalHealthPlan["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: MentalHealthPlan["type"]) => {
    switch (type) {
      case "Therapy":
        return "bg-purple-100 text-purple-800";
      case "Counseling":
        return "bg-indigo-100 text-indigo-800";
      case "Stress Management":
        return "bg-pink-100 text-pink-800";
      case "Mindfulness":
        return "bg-teal-100 text-teal-800";
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-[#00598A] dark:to-gray-700  shadow-lg overflow-hidden">
      <CardHeader className="bg-white bg-opacity-70 backdrop-blur-sm">
        <CardTitle className="text-2xl font-bold text-violet-700 dark:text-violet-400 flex items-center">
          <Brain className="mr-2 h-6 w-6" />
          Mental Health Plans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Plan Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <React.Fragment key={plan.id}>
                  <TableRow>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{plan.date}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(plan.type)}>
                        {plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedPlan(
                            expandedPlan === plan.id ? null : plan.id,
                          )
                        }
                      >
                        {expandedPlan === plan.id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <AnimatePresence>
                    {expandedPlan === plan.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-4 bg-white bg-gradient-to-r dark:from-[#00598A] dark:to-gray-700  bg-opacity-50 rounded-md">
                              <h4 className="font-semibold mb-2">Goals:</h4>
                              <ul className="list-disc list-inside mb-4">
                                {plan.goals.map((goal, index) => (
                                  <li key={index}>{goal}</li>
                                ))}
                              </ul>
                              <h4 className="font-semibold mb-2">
                                Objectives:
                              </h4>
                              <ul className="list-disc list-inside">
                                {plan.objectives.map((objective, index) => (
                                  <li key={index}>{objective}</li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MentalHealthPlans;
