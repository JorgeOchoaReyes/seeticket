import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { formatDistanceToNow } from "date-fns"; 

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number; 
  };
  onClickHandler: (id: string) => Promise<void>
}

export function WorkspaceCard({ workspace, onClickHandler }: WorkspaceCardProps) {
  return (
    <Card
      onClick={async () => await onClickHandler(workspace.id)}
      className="h-full hover:shadow-lg cursor-pointer hover:bg-neutral-50 transition-shadow duration-200 ease-in-out min-w-[300px] max-w-[400px]">
      <CardHeader>
        <CardTitle className="truncate">{workspace.name}</CardTitle>
        <CardDescription className="line-clamp-2">{workspace.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-24 overflow-hidden text-sm text-muted-foreground">{workspace.description}</div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>Updated {formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true })}</span>
        </div> 
      </CardFooter>
    </Card> 
  );
}
