import { Grid2X2, List } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import type { Dispatch, SetStateAction } from "react";

export const CardTableButtonGroup = ({
  setViewMode,
  viewMode
}: {
    setViewMode: Dispatch<SetStateAction<"card" | "table">>
    viewMode: string
}) => {
  return (
    <div className={cn("flex space-x-2 flex-row gap-2")}>
      <Button variant={viewMode === "card" ? "default" : "outline"} size="sm" onClick={() => setViewMode("card")}>
        <Grid2X2 className="mr-2 h-4 w-4" />
        <span className="xs:hidden md:block">Card View</span>
      </Button>
      <Button
        variant={viewMode === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("table")}
      >
        <List className="mr-2 h-4 w-4" />
        <span className="xs:hidden md:block">Table View</span>
      </Button>
    </div>  
  );
};