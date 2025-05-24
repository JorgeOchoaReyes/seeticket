import { HelpCircle } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ticket } from "~/types";
import { useState } from "react";
import { getPriorityColor, formatDate } from "~/utils/help";
import { cn } from "~/lib/utils";

export const TicketCardDs = ({
  ticket, 
  onClickHandler,
  onClickDetails,
  onRecallTicket
}: {
    ticket: Ticket,
    onClickHandler: () => void;
    onClickDetails: () => void;
    onRecallTicket: () => void;
}) => {
  const [tappedOnce, setTappedOnce] = useState(false);

  return (
    <Card key={ticket.id}
      className={cn(
        "min-w-[300px] max-w-[400px] bg-white shadow-sm border rounded-md cursor-pointer",
        tappedOnce ? "border-blue-500" : "border-gray-300",
        ticket.completedAt ? "opacity-50" : "opacity-100",
      )}
      onClick={() => {
        if(!ticket.completedAt) {
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
      }} >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
          <Button variant="ghost" className="h-8 w-8 p-0 z-10" onClick={onClickDetails}>
            <HelpCircle className="h-4 w-4" />
          </Button> 
        </div>
        <CardDescription>Due: {formatDate(ticket.dueDate ?? new Date().getTime())}</CardDescription>
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
  );
};