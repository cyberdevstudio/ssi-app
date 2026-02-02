import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, FileCheck, ClipboardCheck } from "lucide-react";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord SSI/GRC</h1>
          <p className="text-muted-foreground mt-2">
            Vue d'ensemble de la sécurité de l'information et de la conformité
          </p>
        </div>

        {/* Indicateurs clés */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Risques Critiques
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent une attention immédiate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contrôles Actifs
              </CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Contrôles en opération
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conformité Globale
              </CardTitle>
              <FileCheck className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">
                Taux de conformité moyen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Audits Planifiés
              </CardTitle>
              <ClipboardCheck className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Audits à venir ce trimestre
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sections principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Risques Récents</CardTitle>
              <CardDescription>
                Derniers risques identifiés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucun risque enregistré pour le moment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions en Retard</CardTitle>
              <CardDescription>
                Actions nécessitant une attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucune action en retard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conformité par Cadre</CardTitle>
              <CardDescription>
                État de conformité aux référentiels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aucun cadre de conformité configuré.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Message de bienvenue */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Bienvenue sur la plateforme SSI/GRC</CardTitle>
            <CardDescription>
              Commencez par configurer votre organisation et vos entités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              Cette plateforme vous permet de gérer de manière intégrée :
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Les organisations, entités, départements et processus métier</li>
              <li>La gouvernance avec comités, rôles et décisions</li>
              <li>Les risques avec évaluations et stratégies d'atténuation</li>
              <li>Les contrôles de sécurité avec preuves et évaluations</li>
              <li>La conformité aux normes ISO 27001, NIST CSF, CIS Controls, RGPD</li>
              <li>Les audits internes et externes avec constatations</li>
              <li>Les plans d'action avec suivi collaboratif</li>
              <li>Les études EBIOS RM avec scénarios de menaces</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
