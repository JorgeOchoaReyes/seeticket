import { useState, useEffect } from "react";
import type { Ticket } from "~/types";
import { doc, onSnapshot, query, collection, where, type Unsubscribe, setDoc } from "firebase/firestore"; 
import firebase from "~/firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";  
import { useRouter } from "next/router";

export const useTickets = (workspaceId: string, ticketGroupId: string) => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const todaysDate = new Date(); 
  
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

  useEffect(() => {
    if(firebase.db && workspaceId && ticketGroupId) {  
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

  
  const onCompleteTicket = async (ticketId: string) => {  
    const id = uuidv4();
    const ticketDoc = doc(firebase.db, `workspaces/${workspaceId}/ticketGroups/${ticketGroupId}/ticketHistory`, id);
    let findTicket = tickets.find((p) => p.id === ticketId); 
    if(!findTicket || findTicket === undefined) {
      toast.error("There was an error saving this ticket, it no longer exists.");
    }
    try {
      findTicket = {
        ...findTicket!, 
        completedAt: new Date().getTime(),
        
      };
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

  return {
    tickets, 
    setTickets,
    ticketsLoading, 
    setTicketsLoading,
    onCompleteTicket
  };
};