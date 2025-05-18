import { Grid2X2, List, Loader2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";  
import { TicketGroupCreator } from "~/components/workspace/create-ticketgroup";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"; 
import { api } from "~/utils/api";
import type { Workspace } from "~/types";
import { useRouter } from "next/router"; 
import { WorkspaceCard } from "~/components/workspace/card";
import { WorkspaceTable } from "~/components/workspace/table"; 

export default function Workspaces() {
  const router = useRouter();
  const id = router.query.id as string;

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [openCreateWorkspace, setOpenCreateWorkspace] = useState(false);

  const getWorksapce = api.workspace.findWorkspaceById.useMutation(); ;

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const res = await getWorksapce.mutateAsync({ id });
        if (res) {
          setWorkspace(res);
        }
      })(); 
    }
  }, [id]);

  if(getWorksapce.isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col justify-between items-start mx-6 mt-6 mb-4"> 
        <h1 className="text-3xl font-bold"> {workspace?.name} </h1>
        <p className="text-gray-500"> {workspace?.description} </p> 
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
        <Dialog open={openCreateWorkspace} onOpenChange={setOpenCreateWorkspace}> 
          <Button onClick={() => setOpenCreateWorkspace(true)} variant="outline"> <Plus /> Add Ticket Group</Button> 
          <DialogContent className="w-full">
            <div className="overflow-auto max-h-[80vh] w-full">
              <DialogHeader>
                <DialogTitle>New Workspace</DialogTitle>
                <DialogDescription> 
                Create a new workspace to get started.
                </DialogDescription>
              </DialogHeader> 
              <TicketGroupCreator 
                workspaceId={workspace?.id ?? ""}
                triggerClose={
                  async () => { 
                    const res = await getWorksapce.mutateAsync({ id });
                    if (res) {
                      setWorkspace(res);
                    }
                    setOpenCreateWorkspace(false);
                  }
                } /> 
            </div> 
          </DialogContent>
        </Dialog> 
      </div>
      <div className="flex flex-col items-center justify-center"> 
        {
          getWorksapce.isPending ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        }
        {
          (workspace?.ticketGroups?.length === 0 && !getWorksapce.isPending) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold">No Ticket Groups Found</h2>
              <p className="text-gray-500">Create a new ticket groups to get started.</p>
            </div>
          ) : null
        }
        {
          workspace && getWorksapce.isPending === false ? <>
            {viewMode === "card" ? (
              <div className="flex flex-wrap w-[97%] flex-row items-start gap-6">
                {workspace.ticketGroups?.map((ticketGroup) => (
                  <WorkspaceCard key={ticketGroup.id} workspace={{
                    id: ticketGroup.id,
                    name: ticketGroup.name,
                    description: ticketGroup.description,
                    createdAt: ticketGroup.createdAt,
                    updatedAt: ticketGroup.updatedAt,
                  }} onClickHandler={async () => {
                    await router.push(`/dashboard/workspaces/${workspace.id}/ticket-groups/${ticketGroup.id}`);
                  }} />
                ))}
              </div>
            ) : (
              <div className="flex w-[97%] bg-white">
                <WorkspaceTable workspaces={workspace.ticketGroups?.map((w) => {
                  return {
                    id: w.id,
                    name: w.name,
                    description: w.description,
                    createdAt: w.createdAt,
                    updatedAt: w.updatedAt,
                  };
                }) ?? []} 
                onClickHandler={async (id) => {
                  await router.push(`/dashboard/workspaces/${workspace.id}/ticket-groups/${id}`);
                }}
                />
              </div>
            )} 
          </> : null
        }
      </div>
    </div>
  );
}