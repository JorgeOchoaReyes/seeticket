import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
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

  return (
    <div className="flex flex-col w-full">
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
              {tickets?.map((ticket) => (
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