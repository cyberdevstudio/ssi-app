// ============================================
// MODIFICATIONS À APPORTER DANS client/src/components/DashboardLayout.tsx
// ============================================

// Remplacez la section "if (!user)" par ce code:

if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Connexion requise
          </h1>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Vous devez vous connecter pour accéder à cette page.
          </p>
        </div>
        <Button
          onClick={() => {
            // Rediriger vers la page de login locale
            window.location.href = "/login";
          }}
          size="lg"
          className="w-full shadow-lg hover:shadow-xl transition-all"
        >
          Se connecter
        </Button>
      </div>
    </div>
  );
}

// ============================================
// MODIFICATIONS À APPORTER DANS client/src/App.tsx
// ============================================

// Ajoutez ces imports:
import Login from "./pages/Login";
import Register from "./pages/Register";

// Ajoutez ces routes dans le Router:
function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/"} component={Home} />
      {/* ... autres routes ... */}
    </Switch>
  );
}
