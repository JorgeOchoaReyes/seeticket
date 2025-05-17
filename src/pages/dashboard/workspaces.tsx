import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";  
import { WorkspaceCreator } from "~/components/workspace/create-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

export default function Workspaces() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center m-6"> 
        <h1 className="text-3xl font-bold">Workspaces</h1>
      </div> 
      
      <div className="flex flex-row justify-end items-center m-6"> 
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline"> <Plus /> Create Workspace</Button>
          </DialogTrigger>
          <DialogContent className="w-full">
            <div className="overflow-auto max-h-[80vh] w-full">
              <DialogHeader>
                <DialogTitle>New Workspace</DialogTitle>
                <DialogDescription> 
                Create a new workspace to get started.
                </DialogDescription>
              </DialogHeader> 
              <WorkspaceCreator triggerClose={
                () => { 
                  const dialog = document.querySelector("[role=dialog]");
                  if (dialog) {
                    dialog.dispatchEvent(new Event("close"));
                  }
                }
              } /> 
            </div> 
          </DialogContent>
        </Dialog> 
      </div>
      <div className="flex flex-col items-center justify-center">
        
      </div>
    </div>
  );
}