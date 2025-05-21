
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";    
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Ticket } from "~/types"; 
import { getPriorityColor, formatDate } from "~/utils/help"; 

export const TicketView = ({
  selectedTicket,
  isDialogOpen,
  setIsDialogOpen,
  onEdit,
  completeTicket
}: {
    selectedTicket: Ticket | null;
    isDialogOpen: boolean;
    setIsDialogOpen: (open: boolean) => void;
    onEdit?: () => void;
    completeTicket?: () => Promise<void>;
}) => { 

  return (
    <>
      {selectedTicket && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTicket.title}</span>
                <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
              </DialogTitle>
              <DialogDescription>Created: {selectedTicket.id.substring(0, 8)}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Due Date</h4>
                  <p className="text-sm">{formatDate(selectedTicket?.dueDate ?? 0)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <p className="text-sm">
                    {selectedTicket.completedAt ? `Completed on ${formatDate(selectedTicket.completedAt)}` : "Pending"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Weekly Schedule</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedTicket?.weeklySchedule?.map((day) => (
                    <Badge key={day} variant="outline" className="capitalize">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <div className="space-x-2">
                {onEdit && <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50" onClick={onEdit}>
                  Edit
                </Button>}
                {
                  completeTicket &&
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50"
                    disabled={!!selectedTicket.completedAt}
                  >
                  Mark Complete
                  </Button>
                }
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};