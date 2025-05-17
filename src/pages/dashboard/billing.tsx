import React from "react";
import Blling from "~/components/payments/billing-view";
import Payments from "~/components/payments/payments-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Billing () {
  return (
    <div className="flex flex-col"> 
      <h1 className="text-3xl font-bold m-6">Billing</h1>
      <Tabs defaultValue="payments" className="space-y-4 w-full flex justify-center">
        <TabsList className="grid grid-cols-2 flex justify-center items-center self-center w-1/2">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger> 
        </TabsList>
        <TabsContent value="payments" className="space-y-4">
          <Payments />
        </TabsContent>
        <TabsContent value="billing" className="space-y-4">
          <Blling />
        </TabsContent>
      </Tabs>
    </div>
  );
};