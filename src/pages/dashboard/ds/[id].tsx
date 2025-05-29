import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";
import { TicketView } from "~/components/workspace/ticket-view";
import { TicketCardDs } from "~/components/workspace/ticket-ds";
import { useState } from "react";
import type { Ticket, TicketGroup } from "~/types";
import { useTickets } from "~/hooks/use-tickets"; 
import { QrCodePopup } from "~/components/workspace/qr-code";

export default function DisplaySystem() {
  const router = useRouter(); 
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null);   

  const workspaceId = router.query.id as string;
  const ticketGroupId = router.query.tgId as string; 

  const {tickets, ticketsLoading, onCompleteTicket, onRecallTicket} = useTickets(workspaceId, ticketGroupId);

  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation();    

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      if(workspaceId && ticketGroupId){
        const res = await getTicketGroup.mutateAsync({ 
          workspaceId: workspaceId,
          ticketGroupId: ticketGroupId,
        });
        if (res) {
          setTicketGroup(res);
        }
      }
    })();
  }, [ticketGroupId]);

  const sortTickets = (tickets: Ticket[]) => {
    const currentTime = new Date();
    const currentTimestamp = currentTime.getTime();

    return tickets.sort((a, b) => { 
      const priority = {
        high: 1,
        medium: 2,
        low: 3,
      };

      if(a.completedAt || b.completedAt) {
        return 4;
      }

      const priorityDiff = priority[a.priority] - priority[b.priority];
 
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
 
      let timestampA: number | null = null;
      if (a.dueDate) {
        timestampA = a.dueDate;
 
        if (a.duetime) {
          const dueDate = new Date(a.dueDate);
          const [hours, minutes] = a.duetime.split(":").map(Number);
          dueDate.setHours(hours ?? 0, minutes, 0, 0);
          timestampA = dueDate.getTime();
        }
      }
 
      let timestampB: number | null = null;
      if (b.dueDate) {
        timestampB = b.dueDate;
 
        if (b.duetime) {
          const dueDate = new Date(b.dueDate);
          const [hours, minutes] = b.duetime.split(":").map(Number);
          dueDate.setHours(hours ?? 0, minutes, 0, 0);
          timestampB = dueDate.getTime();
        }
      }
 
      if (timestampA === null && timestampB === null) {
        return 0; 
      }
      if (timestampA === null) {
        return 1;  
      }
      if (timestampB === null) {
        return -1; 
      }
 
      const timeDiffA = Math.abs(currentTimestamp - timestampA);
      const timeDiffB = Math.abs(currentTimestamp - timestampB);

      return timeDiffA - timeDiffB; 
    });
  };

  return (
    <div className="flex flex-col w-full h-min-screen">
      <div className="flex flex-row justify-between items-center mx-6 my-4"> 
        <h1 className="text-3xl font-bold">{ticketGroup?.name ?? ""}</h1>
      </div> 
      <div className="flex flex-row justify-between items-center mx-6 my-2"> 
        <p>{ticketGroup?.description ?? ""}</p>
        <QrCodePopup /> 
      </div> 
      <div className="flex flex-col items-center justify-center"> 
        {
          (getTicketGroup.isPending || ticketsLoading) ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        } 
        {
          tickets && !(getTicketGroup.isPending || ticketsLoading) ?  
            <div className="flex flex-wrap xs:w-full md:w-[97%] flex-row xs:items-center xs:justify-center lg:justify-normal lg:items-start gap-6">
              {sortTickets(tickets).map((ticket) => (
                <TicketCardDs key={ticket.id} ticket={ticket} 
                  onClickHandler={async () => {
                    await onCompleteTicket(ticket.id);
                  }}
                  onRecallTicket={async () => {
                    await onRecallTicket(ticket.id);
                  }}
                  onClickDetails={async () => {
                    setSelectedTicket(ticket);
                    setIsDialogOpen(true);
                  }}
                />
              ))}
            </div>
            : null
        }
        <div className="flex w-[97%] bg-white xs:w-full md:w-[97%]">
          {isDialogOpen && selectedTicket ? (
            <TicketView
              selectedTicket={selectedTicket}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen} 
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}