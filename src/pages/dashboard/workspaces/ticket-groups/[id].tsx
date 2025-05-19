import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid2X2, List, Loader2, Plus } from "lucide-react";
import { api } from "~/utils/api";
import type { TicketGroup } from "~/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";  
import { TicketGroupCreator } from "~/components/workspace/create-ticketgroup";
import { TicketGenrator } from "~/components/workspace/create-ticket";

export default function TicketGroupPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [openAddTickets, setOpenAddTickets] = useState(false);
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null);

  const id = router.query.id as string;
  const workspaceId = router.query.wpId as string;
  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation();


  useEffect(() => {
    if (id) {
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

  if (getTicketGroup.isPending) {
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
        <div className="flex space-x-2">
          <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
            <Grid2X2 className="mr-2 h-4 w-4" />
              Card View
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="mr-2 h-4 w-4" />
              Table View
          </Button>
        </div> 
        <Dialog open={openAddTickets} onOpenChange={setOpenAddTickets}> 
          <Button onClick={() => setOpenAddTickets(true)} variant="outline"> <Plus /> Add Tickets </Button> 
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
                }} /> 
            </div> 
          </DialogContent>
        </Dialog> 
      </div>

    </div>
  );
}