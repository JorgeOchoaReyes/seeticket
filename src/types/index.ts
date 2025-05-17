import type { UserRecord } from "firebase-admin/auth";

export interface User extends UserRecord { 
    a?: string
}

export interface Workspace {
    id: string; 
    name: string; 
    description: string;
    createdAt: number;
    updatedAt: number;
    ownerId: string;
    ticketGroups?: TicketGroup[];
}

export interface TicketGroup {
    id: string; 
    name: string; 
    description: string;
    createdAt: number;
    updatedAt: number;
    tickets: Ticket[];
}

export interface Ticket {
    id: string; 
    title: string; 
    description: string;
    duetime: number;
    completedAt: number | null;
    priority: "low" | "medium" | "high";
    weeklySchedule: string[]; 
}

export interface StripeDetails {
    subscriptionId?: string
    status?: string
    priceId?: string
    clientReferenceId?: string
    customerId?: string
}

export interface Chat {
    id: string; 
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    isNew?: boolean;
}

export interface VertexAiAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}