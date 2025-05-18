import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"; 
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; 
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"; 
import { type Workspace, type TicketGroupRef } from "../../types";
import { ChevronRight, Trash2, ChevronLeft, SaveAllIcon, Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "sonner";

const workspaceSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  ticketGroupsRef: z.array(z.any())
});

const ticketGroupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
  tickets: z.array(z.any())
});

export function WorkspaceCreator({triggerClose}: {triggerClose: () => void;}) {
  const [step, setStep] = useState(1);
  const [workspace, setWorkspace] = useState<Workspace>({
    id: uuidv4(),
    name: "",
    description: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ownerId: "current-user-id", 
    ticketGroupsRef: [],
    ownerName: "current-user-name",
  });
  const [currentTicketGroupIndex, setCurrentTicketGroupIndex] = useState<number | null>(null);  

  const saveWorkspace = api.workspace.createWorkspace.useMutation();
 
  const workspaceForm = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description,
      ticketGroupsRef: workspace.ticketGroupsRef,
    },
  });
 
  const ticketGroupForm = useForm<z.infer<typeof ticketGroupSchema>>({
    resolver: zodResolver(ticketGroupSchema),
    defaultValues: {
      name: "",
      description: "", 
      tickets: [],
    },
  });
 
  function onWorkspaceSubmit(values: z.infer<typeof workspaceSchema>) {
    setWorkspace((prev) => ({
      ...prev,
      name: values.name,
      description: values.description,
      updatedAt: Date.now(),
    }));
    setStep(2);
  }
 
  function onTicketGroupSubmit(name: string, description: string) {
    const newTicketGroup: TicketGroupRef = {
      id: uuidv4(),
      name: name,
      description: description,  
    };

    if (currentTicketGroupIndex !== null) { 
      setWorkspace((prev) => {
        const updatedTicketGroups = [...(prev?.ticketGroupsRef ?? [])];
        updatedTicketGroups[currentTicketGroupIndex] = {
          ...updatedTicketGroups[currentTicketGroupIndex]!,
          name: name,
          description: description,  
        };
        return { ...prev, ticketGroupsRef: updatedTicketGroups, updatedAt: Date.now() };
      });
      setCurrentTicketGroupIndex(null);
    } else { 
      setWorkspace((prev) => ({
        ...prev,
        ticketGroupsRef: [...prev?.ticketGroupsRef ?? [], newTicketGroup], 
      }));
    }

    ticketGroupForm.reset({
      name: "",
      description: "", 
    });
  }
  
  function editTicketGroup(index: number) {
    const ticketGroup = workspace?.ticketGroupsRef?.[index];
    ticketGroupForm.reset({
      name: ticketGroup!.name,
      description: ticketGroup!.description, 
    });
    setCurrentTicketGroupIndex(index);
  }
 
  function deleteTicketGroup(index: number) {
    setWorkspace((prev) => {
      const updatedTicketGroups = [...prev.ticketGroupsRef ?? []];
      updatedTicketGroups.splice(index, 1);
      return { ...prev, ticketGroupsRef: updatedTicketGroups, updatedAt: Date.now() };
    });
  } 
 
  async function handleSubmit() {
    const results = await saveWorkspace.mutateAsync({
      workspace: workspace
    });
    if (results) {
      setStep(1);
      setWorkspace({
        id: uuidv4(),
        name: "",
        description: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ownerId: "current-user-id", 
        ticketGroupsRef: [],
        ownerName: "current-user-name",
      });
      workspaceForm.reset({
        name: "",
        description: "",
        ticketGroupsRef: [],
      });
      ticketGroupForm.reset({
        name: "",
        description: "", 
      });
      toast.success("Workspace created successfully!");
      triggerClose();
    } else {
      toast.error("Failed to create workspace.");
    }
  }

  return (
    <div className="space-y-">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 my-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <div className="h-1 w-8 bg-muted">
            <div className={`h-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div> 
        </div> 
      </div> 
      <div className="">
        <div className={"space-y-6 md:col-span-5"}> 
          {step === 1 && (
            <Card className="w-full mt-8">
              <CardHeader>
                <CardTitle>Workspace Details</CardTitle>
                <CardDescription>Create a new workspace </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...workspaceForm}>
                  <form onSubmit={workspaceForm.handleSubmit(onWorkspaceSubmit)} className="space-y-6">
                    <FormField
                      control={workspaceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workspace Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Workspace" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the name of your workspace. It will be visible to all members.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={workspaceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the purpose of this workspace..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Provide a brief description of what this workspace is for.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit">
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
 
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Groups</CardTitle>
                  <CardDescription>
                    Create groups to organize your tickets. Each group can have its own schedule and purpose.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...ticketGroupForm}>
                    <div className="space-y-6">
                      <FormField
                        control={ticketGroupForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Group Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Development Tasks" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={ticketGroupForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tasks related to development work..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            ticketGroupForm.reset({
                              name: "",
                              description: "", 
                            });
                            setCurrentTicketGroupIndex(null);
                          }}
                        >
                          Clear
                        </Button>
                        <Button onClick={() => onTicketGroupSubmit(
                          ticketGroupForm.getValues("name"),
                          ticketGroupForm.getValues("description")
                        )}>{currentTicketGroupIndex !== null ? "Update Group" : "Add Group"}</Button>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>  
              {workspace?.ticketGroupsRef?.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Ticket Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workspace?.ticketGroupsRef?.map((group, index) => (
                        <div key={group.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <h3 className="text-lg font-medium">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">{group.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => editTicketGroup(index)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => deleteTicketGroup(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
              {(workspace?.ticketGroupsRef?.length ?? 0) !== 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button> 
                      <Button onClick={handleSubmit}>
                        { saveWorkspace.isPending ?  <Loader2 className="animate-spin h-4 w-4" /> : <><SaveAllIcon className="mr-2 h-4 w-4" /> Save </> }
                      </Button> 
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
