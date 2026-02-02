import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function Audits() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
            <p className="text-muted-foreground mt-2">
              Module de gestion des Audits
            </p>
          </div>
          <Button onClick={() => toast.info("Fonctionnalité à venir")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audits</CardTitle>
            <CardDescription>
              Gestion complète du module Audits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fonctionnalité en cours de développement. Les CRUD complets seront disponibles prochainement.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
