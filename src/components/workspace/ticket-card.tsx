import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import type { Ticket } from "~/types";
import { getPriorityColor, formatDate } from "~/utils/help";

export const TicketCard = ({
  ticket, 
  onClickHandler
}: {
    ticket: Ticket,
    onClickHandler: () => void;
}) => {
  return (
    <Card key={ticket.id} className="min-w-[300px] max-w-[400px] bg-white shadow-sm border rounded-md" >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
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
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={onClickHandler}>
                  View Details
        </Button>
      </CardFooter>
    </Card>
  );
};