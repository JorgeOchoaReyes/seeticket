
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import type { Ticket } from "~/types";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export const TicketGenrator = ({
  triggerClose,
  workspaceId,
  ticketGroupId,
  selectedTicket
}: {
    triggerClose: () => Promise<void>,
    workspaceId: string,
    ticketGroupId: string,
    selectedTicket: Ticket | null,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Ticket, "id" | "completedAt">>({
    title: "",
    description: "",
    duetime:  "",
    dueDate: Date.now(),
    repeatingTask: false,  
    priority: "medium",
    weeklySchedule: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createTicketMutation = api.workspace.addTicket.useMutation(); 

  useEffect(() => {
    if (selectedTicket) {
      setFormData({
        title: selectedTicket.title,
        description: selectedTicket.description,
        duetime: selectedTicket.duetime,
        dueDate: selectedTicket.dueDate,
        repeatingTask: selectedTicket.repeatingTask,
        priority: selectedTicket.priority,
        weeklySchedule: selectedTicket.weeklySchedule,
      });
    }
    return () => {
      setFormData({
        title: "",
        description: "",
        duetime:  "",
        dueDate: Date.now(),
        repeatingTask: false,  
        priority: "medium",
        weeklySchedule: [],
      });
    };
  }, [selectedTicket]);

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
      ? [...formData?.weeklySchedule ?? [], day]
      : formData?.weeklySchedule?.filter((d) => d !== day);

    setFormData({
      ...formData,
      weeklySchedule: updatedSchedule,
    });
  };

  const handleDueTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const time = e.target.value;  
    setFormData({
      ...formData,
      duetime: time,
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
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
 
    const newTicket: Ticket = {
      id: selectedTicket ? selectedTicket.id : uuidv4(),
      ...formData,
      completedAt: null,
    };

    try { 
      const res = await createTicketMutation.mutateAsync({
        workspaceId,
        ticketGroupId,
        ticket: newTicket,
      });
      if(res) {
        toast.success("Ticket created successfully");
        await triggerClose();
        setFormData({
          title: "",
          description: "",
          duetime: "",
          dueDate: Date.now(),
          repeatingTask: false,
          priority: "medium",
          weeklySchedule: [],
        });
      } else {
        toast.error("Failed to create ticket");
      } 
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

            <div className="flex flex-row gap-4"> 
              <Label htmlFor="duedate">Repeating Task </Label>
              <Checkbox 
                id="duedate"
                checked={formData.repeatingTask}
                onCheckedChange={(checked) => setFormData({ ...formData, repeatingTask: typeof checked !== "string" ? checked : false })}
                className="w-4 h-4"                
              />
            </div>

            {
              !formData.repeatingTask ? (
                <div className="space-y-2">
                  <Label htmlFor="duedate">Due Date</Label>
                  <Input
                    id="duedate"
                    name="duedate"
                    type="date"
                    value={formatDateForInput(formData.dueDate ?? Date.now())}
                    onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value).getTime() })}
                  />
                </div>
              ) : <>
                <div className="space-y-2">
                  <Label htmlFor="duetime">Due Time {formData.duetime}</Label>
                  <Input
                    id="duetime"
                    name="duetime"
                    type="time"
                    value={formData.duetime}
                    onChange={handleDueTimeChange}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Weekly Schedule</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={formData?.weeklySchedule?.includes(day.id)}
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
              </>
            } 

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

          </CardContent>
          <CardFooter className="flex justify-between mt-5">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">{
              createTicketMutation.isPending ? 
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                "Save"
            }</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
