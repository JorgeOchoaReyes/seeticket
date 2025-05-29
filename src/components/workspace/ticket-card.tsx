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
    <Card key={ticket.id} className="min-w-[300px] max-w-[400px] w-[320px] bg-white shadow-sm border rounded-md" >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
        </div>
        {!ticket.repeatingTask && <CardDescription>Due: {formatDate(ticket.dueDate ?? new Date().getTime())}</CardDescription>}
      </CardHeader>
      <CardContent className="max-w-full">
        <p className="text-sm line-clamp-3 mb-4 flex-wrap">{ticket.description.slice(0,20).trim()}...</p>
        <div className="flex flex-wrap gap-1">
          {ticket?.weeklySchedule
            ?.sort((a, b) => {
              const dayOrder = {
                monday: 0,
                tuesday: 1,
                wednesday: 2,
                thursday: 3,
                friday: 4,
                saturday: 5,
                sunday: 6
              };
              return dayOrder[a.toLowerCase() as keyof typeof dayOrder] - dayOrder[b.toLowerCase() as keyof typeof dayOrder];
            })?.map((day) => (
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