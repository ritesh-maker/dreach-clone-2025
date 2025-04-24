import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Bell, MapPin } from "lucide-react";

const DeviceSettings: React.FC = () => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-[#125872] to-[#0e465a] text-primary-foreground p-6 -mt-6">
        <CardTitle className="text-2xl font-bold text-white">
          Device Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {[
          { label: "Push Notifications", icon: Bell },
          { label: "Location Services", icon: MapPin },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted-hover transition-colors"
          >
            <Label
              htmlFor={`device-${index}`}
              className="text-lg flex items-center cursor-pointer"
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.label}
            </Label>
            <Switch id={`device-${index}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DeviceSettings;
