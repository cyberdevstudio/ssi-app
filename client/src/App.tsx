import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Organizations from "./pages/Organizations";
import Governance from "./pages/Governance";
import Risks from "./pages/Risks";
import Controls from "./pages/Controls";
import Compliance from "./pages/Compliance";
import Audits from "./pages/Audits";
import Actions from "./pages/Actions";
import Ebios from "./pages/Ebios";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/organizations"} component={Organizations} />
      <Route path={"/governance"} component={Governance} />
      <Route path={"/risks"} component={Risks} />
      <Route path={"/controls"} component={Controls} />
      <Route path={"/compliance"} component={Compliance} />
      <Route path={"/audits"} component={Audits} />
      <Route path={"/actions"} component={Actions} />
      <Route path={"/ebios"} component={Ebios} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
