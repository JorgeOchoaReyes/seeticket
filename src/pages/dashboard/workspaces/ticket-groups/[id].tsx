"use client";

import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Link2, Loader2, Plus, Clock, Eye, EyeOff } from "lucide-react";
import { api } from "~/utils/api";
import type { Ticket, TicketGroup } from "~/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { TicketGenrator } from "~/components/workspace/create-ticket";
import { TicketCard } from "~/components/workspace/ticket-card";
import { TicketsTable } from "~/components/workspace/ticket-table";
import { TicketView } from "~/components/workspace/ticket-view";
import Link from "next/link";
import { QrCodePopup } from "~/components/workspace/qr-code";
import { CardTableButtonGroup } from "~/components/workspace/card-table-groupt";

export default function TicketGroupPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [openAddTickets, setOpenAddTickets] = useState(false);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPastDue, setShowPastDue] = useState(true);

  const id = router.query.id as string;
  const workspaceId = router.query.wpId as string;
  const getTickets = api.workspace.getTickets.useMutation();
  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation();
 
  const isTicketPastDue = (ticket: Ticket): boolean => {
    if (!ticket.dueDate || ticket.completedAt) {
      return false;
    }

    const now = Date.now();
    const dueDate = ticket.dueDate;

    if (ticket.dueDayOfOnly) { 
      const nowDate = new Date(now);
      const dueDateObj = new Date(dueDate);
      nowDate.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);
      return nowDate.getTime() > dueDateObj.getTime();
    } else { 
      return now > dueDate;
    }
  };
 
  const filteredTickets = tickets
    ? tickets.filter((ticket) => {
      if (showPastDue) {
        return true;  
      } else {
        return !isTicketPastDue(ticket);  
      }
    })
    : null;
 
  const pastDueCount = tickets ? tickets.filter(isTicketPastDue).length : 0;

  const refetchTickets = async () => {
    const res = await getTickets.mutateAsync({
      workspaceId: workspaceId,
      ticketGroupId: id
    });

    if(res) setTickets(res); 
  };

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      ;(async () => {
        const res = await getTickets.mutateAsync({
          workspaceId: workspaceId,
          ticketGroupId: id,
        });
        if (res) {
          setTickets(res);
        }
      })()
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      ;(async () => {
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
    <div className="flex flex-col w-full mb-10">
      <div className="flex flex-col justify-between items-start mx-6 mt-6 mb-4">
        <h1 className="text-3xl font-bold"> {ticketGroup?.name} </h1>
        <p className="text-gray-500"> {ticketGroup?.description} </p>
      </div>
      <hr className="border-b border-gray-200" />
      <div className="flex flex-row justify-between items-center m-6">
        <div className="flex items-center space-x-4">
          <CardTableButtonGroup viewMode={viewMode} setViewMode={setViewMode} />
 
          {pastDueCount > 0 && (
            <Button
              variant={showPastDue ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPastDue(!showPastDue)}
              className="flex items-center space-x-2"
            >
              {showPastDue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <Clock className="h-4 w-4" />
              <span className="xs:hidden md:block">
                {showPastDue ? "Hide" : "Show"} Past Due ({pastDueCount})
              </span>
              <span className="xs:block md:hidden">{pastDueCount}</span>
            </Button>
          )}
        </div>

        <div className="flex space-x-2 flex-row">
          <QrCodePopup value={`/dashboard/ds/${workspaceId}?tgId=${id}`} />
          <Button asChild>
            <Link href={`/dashboard/ds/${workspaceId}?tgId=${id}`} target="_blank" rel="noopener noreferrer">
              <Link2 />
              <span className="xs:hidden md:block"> Display View </span>
            </Link>
          </Button>
          <Dialog
            open={openAddTickets}
            onOpenChange={(open) => {
              setOpenAddTickets(open);
              setSelectedTicket(null);
            }}
          >
            <Button onClick={() => setOpenAddTickets(true)} variant="outline">
              {" "}
              <Plus /> <span className="xs:hidden md:block"> Add </span>{" "}
            </Button>
            <DialogContent className="w-full">
              <div className="overflow-auto max-h-[80vh] w-full">
                <DialogHeader>
                  <DialogTitle>New Tickets</DialogTitle>
                  <DialogDescription>Create a new ticket.</DialogDescription>
                </DialogHeader>
                <TicketGenrator
                  workspaceId={workspaceId}
                  ticketGroupId={ticketGroup?.id ?? ""}
                  triggerClose={async () => {
                    setOpenAddTickets(false);
                  }}
                  selectedTicket={selectedTicket}
                  refetchTickets={refetchTickets}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {getTickets.isPending ? <Loader2 className="h-10 w-10 animate-spin" /> : null}
        {filteredTickets?.length === 0 && !getTickets.isPending ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold">
              {tickets?.length === 0 ? "No Ticket Found" : "No Tickets to Display"}
            </h2>
            <p className="text-gray-500">
              {tickets?.length === 0
                ? "Create a new ticket to get started."
                : showPastDue
                  ? "All tickets are currently hidden."
                  : "All visible tickets are past due. Toggle to show them."}
            </p>
          </div>
        ) : null}
        {filteredTickets && getTickets.isPending === false ? (
          <>
            {viewMode === "card" ? (
              <div className="flex flex-wrap xs:w-full md:w-[97%] flex-row xs:items-center xs:justify-center lg:justify-normal lg:items-start gap-6">
                {filteredTickets?.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onClickHandler={async () => {
                      setSelectedTicket(ticket);
                      setIsDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex w-[97%] bg-white xs:w-full md:w-[97%]">
                <TicketsTable
                  titckets={filteredTickets}
                  onClickHandler={async (id) => {
                    const res = filteredTickets?.find((ticket) => ticket.id === id);
                    if (res) {
                      setSelectedTicket(res);
                      setIsDialogOpen(true);
                    }
                  }}
                />
              </div>
            )}
          </>
        ) : null}
      </div>

      <TicketView
        selectedTicket={selectedTicket}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        onEdit={() => {
          setOpenAddTickets(true);
          setSelectedTicket(selectedTicket);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}
