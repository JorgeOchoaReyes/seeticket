import { TicketsTable } from "~/components/workspace/completed-table";
import { useRouter } from "next/router";

export default function History() {
  const router = useRouter(); 
  const workspaceId = router.query.wId as string;
  const ticketGroupId = router.query.tgId as string; 
  console.log(workspaceId, ticketGroupId);
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col justify-between items-start mx-6 mt-6 mb-4"> 
        <h1 className="text-3xl font-bold"> Records </h1>
        <p className="text-gray-500"> Ticket Records </p> 
      </div> 
      <hr className="border-b border-gray-200" />
      <div className="w-11/12 flex justify-center items-center mt-5">  
        <TicketsTable workspaceId={workspaceId} ticketGroupId={ticketGroupId} />
      </div>
    </div>
  );
}