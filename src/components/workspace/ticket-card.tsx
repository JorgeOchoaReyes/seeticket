import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ticket } from "~/types";

const getPriorityColor = (priority: string) => {
  switch (priority) {
  case "high":
    return "bg-red-100 text-red-800";
  case "medium":
    return "bg-yellow-100 text-yellow-800";
  case "low":
    return "bg-green-100 text-green-800";
  default:
    return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};

export const TicketCard = ({
  ticket
}: {
    ticket: Ticket
}) => {
  return (
    <Card key={ticket.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
        </div>
        <CardDescription>Due: {formatDate(ticket.duetime)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-4">{ticket.description}</p>
        <div className="flex flex-wrap gap-1">
          {ticket.weeklySchedule.map((day) => (
            <Badge key={day} variant="outline" className="capitalize">
              {day.slice(0, 3)}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
                  View Details
        </Button>
      </CardFooter>
    </Card>
  );
};