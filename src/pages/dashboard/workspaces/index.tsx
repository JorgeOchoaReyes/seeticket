import { Grid2X2, List, Loader2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";  
import { WorkspaceCreator } from "~/components/workspace/create-modal";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { WorkspaceTable } from "~/components/workspace/workspace-table";
import { WorkspaceCard } from "~/components/workspace/workspace-card"; 
import { api } from "~/utils/api";
import type { Workspace } from "~/types";
import { useRouter } from "next/router";

export default function Workspaces() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [openCreateWorkspace, setOpenCreateWorkspace] = useState(false);

  const getWorksapces = api.workspace.getWorkspaces.useQuery();

  useEffect(() => {
    if (getWorksapces.data) {
      setWorkspaces(getWorksapces.data);
    }
  }, [getWorksapces.data]);

  const onClickRedirect = async (id: string) => {   
    try {
      await router.push(`/dashboard/workspaces/${id}`);
    } catch (error) {
      console.error("Error redirecting to workspace:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center m-6"> 
        <h1 className="text-3xl font-bold">Workspaces</h1>
      </div> 
      
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
          <Button onClick={() => setOpenCreateWorkspace(true)} variant="outline"> <Plus /> Create Workspace</Button> 
          <DialogContent className="w-full">
            <div className="overflow-auto max-h-[80vh] w-full">
              <DialogHeader>
                <DialogTitle>New Workspace</DialogTitle>
                <DialogDescription> 
                Create a new workspace to get started.
                </DialogDescription>
              </DialogHeader> 
              <WorkspaceCreator triggerClose={
                async () => { 
                  await getWorksapces.refetch();
                  setOpenCreateWorkspace(false);
                }
              } /> 
            </div> 
          </DialogContent>
        </Dialog> 
      </div>
      <div className="flex flex-col items-center justify-center"> 
        {
          getWorksapces.isLoading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        }
        {
          (workspaces.length === 0 && !getWorksapces.isLoading) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold">No Workspaces Found</h2>
              <p className="text-gray-500">Create a new workspace to get started.</p>
            </div>
          ) : null
        }
        {
          workspaces.length > 0 && getWorksapces.isLoading === false ? <>
            {viewMode === "card" ? (
              <div className="flex flex-wrap w-[97%] flex-row items-start gap-6">
                {workspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} onClickHandler={onClickRedirect} />
                ))}
              </div>
            ) : (
              <div className="flex w-[97%] bg-white">
                <WorkspaceTable workspaces={workspaces} onClickHandler={onClickRedirect} />
              </div>
            )} 
          </> : null
        }
      </div>
    </div>
  );
}