import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";
import { TicketView } from "~/components/workspace/ticket-view";
import { TicketCardDs } from "~/components/workspace/ticket-ds";
import { useState } from "react";
import type { Ticket } from "~/types";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "~/firebase";

export default function DS() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const workspaceId = router.query.id as string;
  const ticketGroupId = router.query.tgId as string; 
  const todaysDate = new Date(); 

  const getTickets = api.workspace.getTicketsForToday.useMutation(); 

  useEffect(() => {
    if (workspaceId && ticketGroupId) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getTickets.mutateAsync({ 
          workspaceId: workspaceId,
          ticketGroupId: ticketGroupId,
        });
        if (res) {
          setTickets(res);
        }
      })();
    }  
  }, [workspaceId, ticketGroupId]);

  useEffect(() => {
    const hourly = setInterval(() => {
      const currentDate = new Date();
      if (currentDate.getDate() !== todaysDate.getDate()) {
        router.reload();
      }
    }, 1000 * 60 * 60);  
    return () => {
      clearInterval(hourly);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, "workspaces", workspaceId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        console.log("Current data: ", data);
      }
    }); 
    return () => {
      unsubscribe();
    };
  }, []); 

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center m-6"> 
        <h1 className="text-3xl font-bold">DS</h1>
      </div> 
      <div className="flex flex-row justify-between items-center m-6"> 
        <p>Display System</p>
      </div> 
      <div className="flex flex-col items-center justify-center"> 
        {
          getTickets.isPending ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        }
        {
          (tickets?.length === 0 && !getTickets.isPending) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold">No Ticket Found</h2>
              <p className="text-gray-500">Create a new ticket to get started.</p>
            </div>
          ) : null
        }
        {
          tickets && getTickets.isPending === false ?  
            <div className="flex flex-wrap w-[97%] flex-row items-start gap-6">
              {tickets?.map((ticket) => (
                <TicketCardDs key={ticket.id} ticket={ticket} 
                  onClickHandler={async () => {
                    console.log("Clicked");
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
        <div className="flex flex-col items-center justify-center">
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