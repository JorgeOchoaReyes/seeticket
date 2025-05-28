"use client";

import { HelpCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ticket } from "~/types";
import { useState, useEffect } from "react";
import { getPriorityColor, formatDate } from "~/utils/help";
import { cn } from "~/lib/utils";

export const TicketCardDs = ({
  ticket,
  onClickHandler,
  onClickDetails,
  onRecallTicket,
  urgentThresholdMinutes = 60, // Default to 1 hour before due date
}: {
  ticket: Ticket
  onClickHandler: () => void
  onClickDetails: () => void
  onRecallTicket: () => void
  urgentThresholdMinutes?: number
}) => {
  const [tappedOnce, setTappedOnce] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const checkUrgency = () => {
      if (!ticket.dueDate || ticket.completedAt) {
        setIsUrgent(false);
        return;
      }

      const now = new Date();
      const currentTime = now.getTime();
 
      let fullDueDateTime: number;

      if (ticket.duetime) { 
        const [hours, minutes] = ticket.duetime.split(":").map(Number);
        const startOfDay = (new Date()).setHours(0,0,0,0); 
        const dueDateTime = new Date(ticket.repeatingTask ? startOfDay : ticket.dueDate);
        dueDateTime.setHours(hours ?? 0, minutes, 0, 0);
        fullDueDateTime = dueDateTime.getTime();
      } else { 
        const dueDateTime = new Date(ticket.dueDate);
        dueDateTime.setHours(23, 59, 59, 999);
        fullDueDateTime = dueDateTime.getTime();
      }

      const timeDifference = fullDueDateTime - currentTime;
      const minutesUntilDue = timeDifference / (1000 * 60); 
      setIsUrgent(minutesUntilDue <= urgentThresholdMinutes);
    };

    checkUrgency();
 
    const interval = setInterval(checkUrgency, 60000);

    return () => clearInterval(interval);
  }, [ticket.dueDate, ticket.duetime, ticket.completedAt, ticket.repeatingTask, urgentThresholdMinutes]);

  return (
    <div className="relative">
      <Card
        key={ticket.id}
        className={cn(
          "min-w-[325px] max-w-[425px] bg-white shadow-sm border rounded-md cursor-pointer relative transition-all duration-300",
          tappedOnce ? "border-blue-500" : "border-gray-300",
          ticket.completedAt ? "opacity-50" : "opacity-100",
          isUrgent && "animate-pulse border-red-500 shadow-red-200 shadow-lg",
        )}
        onClick={() => {
          if (!ticket.completedAt) {
            if (tappedOnce) {
              onClickHandler();
              setTappedOnce(false);
            } else {
              setTappedOnce(true);
            }
          } else {
            if (tappedOnce) {
              onRecallTicket();
              setTappedOnce(false);
            } else {
              setTappedOnce(true);
            }
          }
        }}
      >
        <CardHeader>
          <div className="flex justify-between items-start mr-2">
            <CardTitle className={cn("text-lg transition-colors duration-300", isUrgent && "text-red-600")}>
              {ticket.title}
            </CardTitle>
            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
          </div>
          {!ticket.repeatingTask && (
            <CardDescription className={cn("transition-colors duration-300", isUrgent && "text-red-500 font-medium")}>
              Due: {formatDate(ticket.dueDate ?? new Date().getTime())}
              {isUrgent && <span className="ml-2 text-red-600 font-semibold animate-bounce">⚠️ URGENT</span>}
            </CardDescription>
          )}     
          {ticket.duetime && (
            <CardDescription className={cn("transition-colors duration-300", isUrgent && "text-red-500 font-medium")}>
              Time: {ticket.duetime}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-3 mb-4">{ticket.description}</p>
          <div className="flex flex-wrap gap-1">
            {ticket?.weeklySchedule?.map((day) => (
              <Badge key={day} variant="outline" className="capitalize">
                {day.slice(0, 3)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button
        variant="ghost"
        className="h-8 w-8 p-0 z-100 absolute top-5 right-0"
        onClick={() => {
          onClickDetails();
        }}
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};
