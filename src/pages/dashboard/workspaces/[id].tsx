import { Grid2X2, List, Loader2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";  
import { WorkspaceCreator } from "~/components/workspace/create-modal";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"; 
import { api } from "~/utils/api";
import type { Workspace } from "~/types";
import { useRouter } from "next/router"; 

export default function Workspaces() {
  const router = useRouter();
  const id = router.query.id as string;

  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [openCreateWorkspace, setOpenCreateWorkspace] = useState(false);

  const getWorksapce = api.workspace.findWorkspaceById.useQuery({
    id: id,
  });

  useEffect(() => {
    if (getWorksapce.data) {
      setWorkspace(getWorksapce.data);
    }
  }, [getWorksapce.data]);

  if(getWorksapce.isLoading) {
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
              <WorkspaceCreator triggerClose={
                async () => { 
                  await getWorksapce.refetch();
                  setOpenCreateWorkspace(false);
                }
              } /> 
            </div> 
          </DialogContent>
        </Dialog> 
      </div>
      <div className="flex flex-col items-center justify-center"> 
        {
          getWorksapce.isLoading ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : null
        }
        {
          (workspace && !getWorksapce.isLoading) ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-bold">No Workspaces Found</h2>
              <p className="text-gray-500">Create a new workspace to get started.</p>
            </div>
          ) : null
        }
        {
          workspace && getWorksapce.isLoading === false ? <>
            {viewMode === "card" ? (
              <div className="flex flex-wrap w-[97%] flex-row items-start gap-6">
                {/* {workspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))} */}
              </div>
            ) : (
              <div className="flex w-[97%] bg-white">
                {/* <WorkspaceTable workspaces={workspaces} /> */}
              </div>
            )} 
          </> : null
        }
      </div>
    </div>
  );
}