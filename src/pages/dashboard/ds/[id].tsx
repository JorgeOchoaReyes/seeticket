import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { api } from "~/utils/api";
import { ExternalLink, Loader2, QrCode, ShareIcon } from "lucide-react";
import { TicketView } from "~/components/workspace/ticket-view";
import { TicketCardDs } from "~/components/workspace/ticket-ds";
import { useState } from "react";
import type { Ticket, TicketGroup } from "~/types";
import { useTickets } from "~/hooks/use-tickets";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"; 
import {QRCodeSVG} from "qrcode.react";

export default function DisplaySystem() {
  const router = useRouter(); 
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null);  
  const [showSharePage, setShowSharePopup] = useState(false); 
  const urlRef = useRef<string>(""); 

  const workspaceId = router.query.id as string;
  const ticketGroupId = router.query.tgId as string; 

  const {tickets, ticketsLoading, onCompleteTicket} = useTickets(workspaceId, ticketGroupId);

  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation();    

  useEffect(() => {
    if(window.location) {
      urlRef.current = window.location.toString();
    }
  }, []);

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
        <Dialog open={showSharePage} onOpenChange={setShowSharePopup}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setShowSharePopup(true);
            }}>
              <ShareIcon />  Share 
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
               QR Code
              </DialogTitle>
              <DialogDescription>Scan this QR code to visit the official Next.js website</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <QRCodeSVG value={urlRef.current}/>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Scan with your phone camera to visit:</p>
                <div className="flex items-center gap-2 text-sm font-mono bg-gray-100 px-3 py-2 rounded">
                  <span>{urlRef.current}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div> 
      <div className="flex flex-col items-center justify-center"> 
        {
          (getTicketGroup.isPending || ticketsLoading) ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        }
        {
          (tickets?.length === 0 && !(getTicketGroup.isPending || ticketsLoading)) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold">No Ticket Found</h2>
              <p className="text-gray-500">Create a new ticket to get started.</p>
            </div>
          ) : null
        }
        {
          tickets && !(getTicketGroup.isPending || ticketsLoading) ?  
            <div className="flex flex-wrap w-[97%] flex-row items-start gap-6">
              {tickets?.map((ticket) => (
                <TicketCardDs key={ticket.id} ticket={ticket} 
                  onClickHandler={async () => {
                    await onCompleteTicket(ticket.id);
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