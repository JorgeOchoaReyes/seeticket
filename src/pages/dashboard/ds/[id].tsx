import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { Loader2 } from "lucide-react";
import { TicketView } from "~/components/workspace/ticket-view";
import { TicketCardDs } from "~/components/workspace/ticket-ds";
import { useState } from "react";
import type { Ticket, TicketGroup } from "~/types";
import { doc, onSnapshot, query, collection, where, type Unsubscribe, setDoc, type DocumentData } from "firebase/firestore"; 
import firebase from "../../../firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import type { QuerySnapshot } from "firebase-admin/firestore";

export default function DS() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false); 
  const [ticketGroup, setTicketGroup] = useState<TicketGroup | null>(null); 

  const workspaceId = router.query.id as string;
  const ticketGroupId = router.query.tgId as string; 
  const todaysDate = new Date(); 

  const getTicketGroup = api.workspace.findTicketGroupBId.useMutation();  

  useEffect(() => {
    if(firebase.db && workspaceId && ticketGroupId) { 
      console.log("Runing");
      try { 
        setTicketsLoading(() => true);

        let unsubscribetTcketsCompletedSchedule: Unsubscribe | null = null; 
        let unsubscribeTicketsDueDate: Unsubscribe | null = null;  
        let unsubscribeTicketsWeeklySchedule: Unsubscribe | null = null;  
        
        try {
          // Completed Tickets 
          const ticketsCompletedRef = collection(doc(collection(doc(collection(firebase.db, "workspaces"), workspaceId), "ticketGroups"),ticketGroupId),"ticketHistory"); 
          const qTicketsCompletedSchedule = query(ticketsCompletedRef,where("ticketGroupId", "==", ticketGroupId)); 
          const setupTicketsCompletedListener = (callback: (t: Ticket[]) => void) => { 
            if (unsubscribeTicketsWeeklySchedule) {
              unsubscribeTicketsWeeklySchedule();
            } 
            unsubscribetTcketsCompletedSchedule = onSnapshot(ticketsCompletedRef, (snapshot) => {
              const ticketsCompletedScheduleData = snapshot.docs.map(doc => {
                if(doc.exists()) return {
                  ...doc.data() as Ticket
                }; else return null; 
              }).filter(Boolean) as Ticket[];
              callback(ticketsCompletedScheduleData);
            }, (error) => {
              console.error("Error fetching tickets completed:", error); 
            });
          }; 
        } catch (err) {
          console.log("setupTicketsCompletedListener", err);
        }
        
        const updateTicketFunction = (newTickets: Ticket[]) => {
          setTickets((t) => {
            const ids = tickets.map((t) => t.id); 
            const copy = [
              ...t, 
              ...(newTickets.filter((t) => !ids.includes(t.id)))
            ];  
            return copy;
          });
        };

        try {       
          // Tickets due today based on date
          const startOfDay = (new Date()).setHours(0,0,0,0); 
          const ticketsDueDateRef = collection(doc(collection(doc(collection(firebase.db, "workspaces"), workspaceId), "ticketGroups"),ticketGroupId),"tickets"); 
          const qTicketsDueDate = query(ticketsDueDateRef, where("dueDate", ">=", startOfDay)); 
          const setupTicketsDueDateListener = (callback: (t: Ticket[]) => void) => { 
            if (unsubscribeTicketsDueDate) {
              unsubscribeTicketsDueDate();
            } 
            unsubscribeTicketsDueDate = onSnapshot(qTicketsDueDate, (snapshot) => {
              const ticketsDueDateData = snapshot.docs.map(doc => {
                if(doc.exists()) return {
                  ...doc.data() as Ticket
                }; else return null; 
              }).filter(Boolean) as Ticket[]; 
              callback(ticketsDueDateData);
            }, (error) => {
              console.error("Error fetching tickets by due date:", error); 
            });
          }; 
          setupTicketsDueDateListener(updateTicketFunction);
        } catch (err) {
          console.log("setupTicketsDueDateListener", err);
        } 

        try {
          // Tickets due to day based on schedule
          const currentDayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });
          const ticketsWeeklyScheduleRef = collection(doc(collection(doc(collection(firebase.db, "workspaces"), workspaceId), "ticketGroups"),ticketGroupId),"tickets"); 
          const qTicketsWeeklySchedule = query(ticketsWeeklyScheduleRef,where("weeklySchedule", "array-contains", currentDayOfWeek));
          const setupTicketsWeeklyScheduleListener = (callback: (t: Ticket[]) => void) => { 
            if (unsubscribeTicketsWeeklySchedule) {
              unsubscribeTicketsWeeklySchedule();
            } 
            unsubscribeTicketsWeeklySchedule = onSnapshot(qTicketsWeeklySchedule, (snapshot) => {
              const ticketsWeeklyScheduleData = snapshot.docs.map(doc => {
                if(doc.exists()) return {
                  ...doc.data() as Ticket
                }; else return null; 
              }).filter(Boolean) as Ticket[];
              callback(ticketsWeeklyScheduleData);
            }, (error) => {
              console.error("Error fetching tickets by weekly schedule:", error); 
            });
          };  
          setupTicketsWeeklyScheduleListener(updateTicketFunction);
        }  catch (err) {
          console.log("setupTicketsWeeklyScheduleListener", err);
        }
        
        setTicketsLoading(() => false);

        return () => {
          if(unsubscribeTicketsDueDate) unsubscribeTicketsDueDate(); 
          if(unsubscribeTicketsWeeklySchedule) unsubscribeTicketsWeeklySchedule();
          if(unsubscribetTcketsCompletedSchedule) unsubscribetTcketsCompletedSchedule();
        };

      } catch (err) {
        console.log(err);
      }
    }
  }, [workspaceId, ticketGroupId]); 

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

  useEffect(() => {
    const hourly = setInterval(() => {
      const currentDate = new Date();
      if (currentDate.getDate() !== todaysDate.getDate()) {
        router.reload();
      }
    }, 1000 * 60 * 60);  
    return () => {
      clearInterval(hourly);
    };
  }, []);

  const onCompleteTicket = async (ticketId: string) => {  
    const id = uuidv4();
    const ticketDoc = doc(firebase.db, `workspaces/${workspaceId}/ticketGroups/${ticketGroupId}/ticketHistory`, id);
    const findTicket = tickets.find((p) => p.id === ticketId); 
    if(!findTicket) {
      toast.error("There was an error saving this ticket, it no longer exists.");
    }
    try {
      await setDoc(ticketDoc, {
        ...findTicket, 
        id: id,
        originalTicketRef: findTicket?.id,
        workspaceId: workspaceId,
        ticketGroupId: ticketGroupId
      } as Ticket, {merge: true});
    } catch (err) {
      toast.error("There was an error saving the ticket, please try again.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center mx-6 my-4"> 
        <h1 className="text-3xl font-bold">{ticketGroup?.name ?? ""}</h1>
      </div> 
      <div className="flex flex-row justify-between items-center mx-6 my-2"> 
        <p>{ticketGroup?.description ?? ""}</p>
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
                    console.log("Clicked");
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