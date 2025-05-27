import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid2X2, Link2, List, Loader2, Plus } from "lucide-react";
import { api } from "~/utils/api";
import type { Ticket, TicketGroup } from "~/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";   
import { TicketGenrator } from "~/components/workspace/create-ticket";
import { TicketCard } from "~/components/workspace/ticket-card";
import { TicketsTable } from "~/components/workspace/ticket-table";
import { TicketView } from "~/components/workspace/ticket-view";
import { SiChainlink } from "react-icons/si";
import Link from "next/link"; 
import { QrCodePopup } from "~/components/workspace/qr-code";
import { cn } from "~/lib/utils";
import { CardTableButtonGroup } from "~/components/workspace/card-table-groupt";

export default function TicketGroupPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [openAddTickets, setOpenAddTickets] = useState(false);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const id = router.query.id as string;
  const workspaceId = router.query.wpId as string;
  const getTickets = api.workspace.getTickets.useMutation();
  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation(); 

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getTickets.mutateAsync({ 
          workspaceId: workspaceId,
          ticketGroupId: id,
        });
        if (res) {
          setTickets(res);
        }
      })();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getTicketGroup.mutateAsync({ 
          workspaceId: workspaceId,
          ticketGroupId: id,
        });
        if (res) {
          setTicketGroup(res);
        }
      })();
    }
  }, [id]);

  if (getTickets.isPending || getTicketGroup.isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col justify-between items-start mx-6 mt-6 mb-4"> 
        <h1 className="text-3xl font-bold"> {ticketGroup?.name} </h1>
        <p className="text-gray-500"> {ticketGroup?.description} </p> 
      </div> 
      <hr className="border-b border-gray-200" /> 
      <div className="flex flex-row justify-between items-center m-6"> 
        <CardTableButtonGroup viewMode={viewMode} setViewMode={setViewMode} />
        <div className="flex space-x-2 flex-row">
          <QrCodePopup value={`/dashboard/ds/${workspaceId}?tgId=${id}`} />
          <Button
            asChild >
            <Link href={`/dashboard/ds/${workspaceId}?tgId=${id}`} target="_blank" rel="noopener noreferrer">
              <Link2 /><span className="xs:hidden md:block"> Display View </span> 
            </Link>
          </Button> 
          <Dialog open={openAddTickets} onOpenChange={(open) => {
            setOpenAddTickets(open);
            setSelectedTicket(null);
          }}> 
            <Button onClick={() => setOpenAddTickets(true)} variant="outline"> <Plus /> <span className="xs:hidden md:block">  Add </span> </Button> 
            <DialogContent className="w-full">
              <div className="overflow-auto max-h-[80vh] w-full">
                <DialogHeader>
                  <DialogTitle>New Tickets</DialogTitle>
                  <DialogDescription> 
                  Create a new ticket.
                  </DialogDescription>
                </DialogHeader> 
                <TicketGenrator 
                  workspaceId={workspaceId}
                  ticketGroupId={ticketGroup?.id ?? ""}
                  triggerClose={async () => {  
                    setOpenAddTickets(false);
                  }} 
                  selectedTicket={selectedTicket}
                /> 
              </div> 
            </DialogContent>
          </Dialog> 
        </div>
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
          tickets && getTickets.isPending === false ? <>
            {viewMode === "card" ? (
              <div className="flex flex-wrap xs:w-full md:w-[97%] flex-row xs:items-center xs:justify-center lg:justify-normal lg:items-start gap-6">
                {tickets?.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} onClickHandler={
                    async () => {
                      setSelectedTicket(ticket);
                      setIsDialogOpen(true);
                    }
                  } />
                ))}
              </div>
            ) : (
              <div className="flex w-[97%] bg-white xs:w-full md:w-[97%]">
                <TicketsTable titckets={tickets} 
                  onClickHandler={async (id) => {
                    const res = tickets?.find((ticket) => ticket.id === id);
                    if (res) {
                      setSelectedTicket(res);
                      setIsDialogOpen(true);
                    }
                  }}
                />
              </div>
            )} 
          </> : null
        }
      </div>

      <TicketView selectedTicket={selectedTicket} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} onEdit={() => {
        setOpenAddTickets(true);
        setSelectedTicket(selectedTicket);
        setIsDialogOpen(false);
      }} />

    </div>
  );
}