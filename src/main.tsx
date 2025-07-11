// start the app always with '/' route
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";

import Index from "@/pages";
import LoginForm from "@/pages/login";
import SignupForm from "@/pages/signup";
import Logout from "@/pages/logout";
import TripsPage from "@/pages/trips";
import AddTripPage from "@/pages/add-trip";
import WalletPage from "@/pages/wallet";
import ProfilePage from "@/pages/profile";
import CategoryDetail from "@/pages/categories/CategoryDetail";

import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/add-trip" element={<AddTripPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/categories/:categoryId" element={<CategoryDetail />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
