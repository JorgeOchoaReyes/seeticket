import { useState, useEffect, useRef } from "react";
import type { Ticket } from "~/types";
import { doc, onSnapshot, query, collection, where, type Unsubscribe, setDoc, deleteDoc } from "firebase/firestore"; 
import firebase from "~/firebase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";  
import { useRouter } from "next/router";

export const useTickets = (workspaceId: string, ticketGroupId: string) => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const todaysDate = new Date(); 
  const [signal, setSignal] = useState(false); 
  
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
        
        const startOfDay = (new Date()).setHours(0,0,0,0); 
        
        const updateTicketFunction = (newTickets: Ticket[]) => {
          // We should remerge instead of clear the tickets ## TO DO ----------------------------------------
          setTickets((t) => { 
            const newIds = newTickets.map((_t) => _t.originalTicketRef); 

            const mergeTickets = [] as Ticket[]; 
            t.forEach((_t) => {
              if(!newIds.includes(_t.id) && !(_t.originalTicketRef && newIds.includes(_t.originalTicketRef))) {
                mergeTickets.push(_t); 
              } 
            });
            
            const exisintsIds = mergeTickets.map((_t) => (_t.originalTicketRef ?? _t.id));
            newTickets.forEach((_t) => {
              if(!exisintsIds.includes(_t.id) && !(_t.originalTicketRef && exisintsIds.includes(_t.originalTicketRef))) {
                mergeTickets.push(_t); 
              }
            });

            return mergeTickets;
          });
        };

        // Tickets due today based on date
        try {       
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

        // Tickets due to day based on schedule
        try {
          const currentDayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });
          const ticketsWeeklyScheduleRef = collection(doc(collection(doc(collection(firebase.db, "workspaces"), workspaceId), "ticketGroups"),ticketGroupId),"tickets"); 
          console.log("currentDayOfWeek", currentDayOfWeek);
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
        
        // Completed Tickets 
        try {
          const ticketsCompletedRef = collection(doc(collection(doc(collection(firebase.db, "workspaces"), workspaceId), "ticketGroups"),ticketGroupId),"ticketHistory"); 
          const qTicketsCompletedSchedule = query(ticketsCompletedRef,where("dueDate", ">=", startOfDay)); 
          const setupTicketsCompletedListener = (callback: (t: Ticket[]) => void) => { 
            if (unsubscribeTicketsWeeklySchedule) {
              unsubscribeTicketsWeeklySchedule();
            } 
            unsubscribetTcketsCompletedSchedule = onSnapshot(qTicketsCompletedSchedule, (snapshot) => {
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
          const mergeCompletedWithUncompleted = (completedTickets: Ticket[]) => { 
            setTickets((t) => {
              const completedTicketsIds = completedTickets.map((ct) => ct.originalTicketRef ?? null).filter(Boolean) as string[]; 
              const copy = t.map((ct) => {
                if(completedTicketsIds.includes(ct.id) || completedTicketsIds.includes(ct.originalTicketRef ?? "")) {
                  const findTicketById = completedTickets.find((c) => c.originalTicketRef === ct.id);  
                  if(!findTicketById) {
                    const findTicketByOriginalTicketRef = completedTickets.find((c) => c.originalTicketRef === ct.originalTicketRef);  
                    if(!findTicketByOriginalTicketRef) {
                      return null; 
                    }
                    return findTicketByOriginalTicketRef;
                  } 
                  return findTicketById; 
                }
                return ct; 
              }).filter(Boolean) as Ticket[];  
              return copy;
            });
          };
          setupTicketsCompletedListener(mergeCompletedWithUncompleted); 
        } catch (err) {
          console.log("setupTicketsCompletedListener", err);
        }
        
        setTicketsLoading(() => false);

        return () => {
          if(unsubscribeTicketsDueDate) unsubscribeTicketsDueDate(); 
          if(unsubscribeTicketsWeeklySchedule) unsubscribeTicketsWeeklySchedule();
          if(unsubscribetTcketsCompletedSchedule) unsubscribetTcketsCompletedSchedule(); 
          setTickets([]);
        };

      } catch (err) {
        console.log(err);
      }
    }
  }, [workspaceId, ticketGroupId, signal]); 

  
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
      setSignal((s) => !s);
    } catch (err) {
      toast.error("There was an error saving the ticket, please try again.");
    }
  };

  const onRecallTicket = async (ticketId: string) => {
    const ticketDoc = doc(firebase.db, `workspaces/${workspaceId}/ticketGroups/${ticketGroupId}/ticketHistory`, ticketId); 
    try {
      await deleteDoc(ticketDoc);
      setSignal((s) => !s);
    } catch (err) { 
      toast.error("There was an error recalling the ticket, please try again"); 
    } 
  };

  return {
    tickets, 
    setTickets,
    ticketsLoading, 
    setTicketsLoading,
    onCompleteTicket,
    onRecallTicket
  };
};