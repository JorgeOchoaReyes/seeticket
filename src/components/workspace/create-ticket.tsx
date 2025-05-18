
import type React from "react";

import { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { v4 as uuidv4 } from "uuid";

export interface Ticket {
  id: string
  title: string
  description: string
  duetime: number
  completedAt: number | null
  priority: "low" | "medium" | "high"
  weeklySchedule: string[]
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export default function CreateTicket() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Ticket, "id" | "completedAt">>({
    title: "",
    description: "",
    duetime: Date.now() + 86400000,  
    priority: "medium",
    weeklySchedule: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    }); 
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePriorityChange = (value: string) => {
    setFormData({
      ...formData,
      priority: value as "low" | "medium" | "high",
    });
  };

  const handleScheduleChange = (day: string, checked: boolean) => {
    const updatedSchedule = checked
      ? [...formData.weeklySchedule, day]
      : formData.weeklySchedule.filter((d) => d !== day);

    setFormData({
      ...formData,
      weeklySchedule: updatedSchedule,
    });
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const timestamp = new Date(e.target.value).getTime();
    setFormData({
      ...formData,
      duetime: timestamp,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.weeklySchedule.length === 0) {
      newErrors.weeklySchedule = "Select at least one day for the schedule";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
 
    const newTicket: Ticket = {
      id: uuidv4(),
      ...formData,
      completedAt: null,
    };

    try { 
      console.log("Submitting ticket:", newTicket); 
      alert("Ticket created successfully!");
      await router.push("/tickets");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };
 
  const formatDateForInput = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
          <CardDescription>Fill out the form to create a new task ticket.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter ticket title"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the task in detail"
                rows={4}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duedate">Due Date</Label>
              <Input
                id="duedate"
                name="duedate"
                type="date"
                value={formatDateForInput(formData.duetime)}
                onChange={handleDueDateChange}
              />
            </div>

            <div className="space-y-3">
              <Label>Priority</Label>
              <RadioGroup value={formData.priority} onValueChange={handlePriorityChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">
                    Low
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">
                    High
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Weekly Schedule</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.id}
                      checked={formData.weeklySchedule.includes(day.id)}
                      onCheckedChange={(checked) => handleScheduleChange(day.id, checked as boolean)}
                    />
                    <Label htmlFor={day.id} className="cursor-pointer">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.weeklySchedule && <p className="text-sm text-red-500">{errors.weeklySchedule}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
