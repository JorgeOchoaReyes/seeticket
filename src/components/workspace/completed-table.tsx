import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Calendar, Clock, Repeat, CheckCircle2, Circle, AlertTriangle } from "lucide-react"; 
import type { Ticket } from "~/types";
import { api } from "~/utils/api";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours ?? "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function getPriorityColor(priority: Ticket["priority"]) {
  switch (priority) {
  case "high":
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  case "medium":
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  case "low":
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  default:
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
}

function getPriorityIcon(priority: Ticket["priority"]) {
  switch (priority) {
  case "high":
    return <AlertTriangle className="w-3 h-3" />;
  case "medium":
    return <Clock className="w-3 h-3" />;
  case "low":
    return <Circle className="w-3 h-3" />;
  default:
    return null;
  }
}

interface TicketsTableProps {
  showCompleted?: boolean
  workspaceId?: string
  ticketGroupId?: string
}

export function TicketsTable({ showCompleted = false, workspaceId, ticketGroupId}: TicketsTableProps) {
  const { data, isLoading, error } = api.workspace.getCompletedTickets.useQuery({
    workspaceId: workspaceId ?? "",
    ticketGroupId: ticketGroupId ?? ""
  });

  if (isLoading) {
    return ( 
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div> 
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error loading tickets: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const tickets = data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {showCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Completed Tickets
            </>
          ) : (
            <>
              <Circle className="w-5 h-5 text-blue-600" />
              Active Tickets
            </>
          )}
        </CardTitle>
        <CardDescription>
          {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id} className={!ticket.completedAt ? "opacity-60" : ""}>
                    <TableCell>
                      {ticket.completedAt ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className={!ticket.completedAt ? "line-through" : ""}>{ticket.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate text-muted-foreground">{ticket.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(ticket.priority)} flex items-center gap-1 w-fit`}
                      >
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {ticket.dueDate && (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3" />
                            {formatDate(ticket.dueDate)}
                          </div>
                        )}
                        {ticket.duetime && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTime(ticket.duetime)}
                          </div>
                        )}
                        {ticket.dueDayOfOnly && (
                          <Badge variant="outline" className="text-xs w-fit">
                            Day of only
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.weeklySchedule && ticket.weeklySchedule.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {ticket.weeklySchedule          
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
                              <Badge key={day} variant="outline" className="text-xs">
                                {day.slice(0, 3)}
                              </Badge>
                            ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ticket.repeatingTask && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            Recurring
                          </Badge>
                        )}
                        {ticket.completedAt && (
                          <div className="text-xs text-muted-foreground">
                            Completed {formatDate(ticket.completedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
