import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/protected-route";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HubPage from "./pages/Hub.tsx";
import Index from "./pages/Index.tsx";
import LoginPage from "./pages/Login.tsx";
import ControlePage from "./pages/controle/Controle.tsx";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import AnimalDetailPage from "./pages/AnimalDetail.tsx";
import AnimalPage from "./pages/controle/Animal/page.tsx";
import AnimalTypePage from "./pages/controle/AnimalType/page.tsx";
import Logs from "./pages/controle/Logs/page.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/hub" element={<HubPage />} />
              <Route path="/animal/:id" element={<AnimalDetailPage />} />
              <Route path="/controle" element={<ControlePage />}>
                <Route path="animal" element={<AnimalPage />} />
                <Route path="animal-type" element={<AnimalTypePage />} />
                <Route path="logs" element={<Logs />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;