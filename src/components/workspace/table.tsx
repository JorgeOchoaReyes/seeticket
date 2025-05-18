import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { formatDistanceToNow } from "date-fns";
import type { Workspace } from "~/types";

interface WorkspaceTableProps {
  workspaces: {
    id: string
    name: string
    description: string
    createdAt: number
    updatedAt: number 
  }[]
  onClickHandler: (id: string) => Promise<void>   
}

export function WorkspaceTable({ workspaces, onClickHandler }: WorkspaceTableProps) {
  return (
    <div className="rounded-md border w-full bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces.map((workspace) => (
            <TableRow key={workspace.id} onClick={async () => await onClickHandler(workspace.id)}>
              <TableCell className="font-medium">{workspace.name}</TableCell>
              <TableCell className="max-w-xs truncate">{workspace.description}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(workspace.createdAt), { addSuffix: true })}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true })}</TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
