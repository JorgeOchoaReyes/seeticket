import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"; 
import type { Ticket } from "~/types";

interface WorkspaceTableProps {
  titckets: Ticket[]
  onClickHandler: (id: string) => Promise<void>   
}

export function TicketsTable({ titckets, onClickHandler }: WorkspaceTableProps) {
  return (
    <div className="rounded-md border w-full bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Repeats</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Due Time</TableHead>
            <TableHead>Schedule</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {titckets?.map((titcket) => (
            <TableRow key={titcket.id} onClick={async () => await onClickHandler(titcket.id)}>
              <TableCell className="font-medium">{titcket.title}</TableCell>
              <TableCell className="max-w-xs truncate">{titcket.description}</TableCell>
              <TableCell className="max-w-xs truncate">{titcket.priority}</TableCell>
              
              <TableCell className="max-w-xs truncate">{titcket.repeatingTask}</TableCell>
              <TableCell>{new Date(titcket.dueDate ?? 0).toLocaleDateString()}</TableCell>
              <TableCell>{titcket.duetime}</TableCell>
              <TableCell>{titcket.weeklySchedule?.join(", ")}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
