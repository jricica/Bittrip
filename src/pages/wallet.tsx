import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { GiftCard } from "@/components/ui/gift-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import { Schema } from "@/lib/db-types";
import { formatCurrency, generateId } from "@/lib/utils";

// Sample service providers for BitRefill
const serviceProviders = [
  { id: "uber", name: "Uber", category: "transport" },
  { id: "airbnb", name: "Airbnb", category: "accommodation" },
  { id: "avianca", name: "Avianca", category: "transport" },
  { id: "mcdonalds", name: "McDonald's", category: "food" },
  { id: "starbucks", name: "Starbucks", category: "food" },
  { id: "netflix", name: "Netflix", category: "entertainment" },
];

// Sample transactions
const transactions = [
  { id: "tx1", type: "deposit", amount: 500, date: "2023-06-15", description: "Depósito inicial" },
  { id: "tx2", type: "purchase", amount: -50, date: "2023-06-16", description: "Gift Card Uber" },
  { id: "tx3", type: "purchase", amount: -120, date: "2023-06-18", description: "Gift Card Airbnb" },
  { id: "tx4", type: "deposit", amount: 200, date: "2023-06-20", description: "Recarga" },
];

const WalletPage = () => {
  const [giftCards, setGiftCards] = useState<Schema["giftCards"][]>([]);
  const [trips, setTrips] = useState<Schema["trips"][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [newGiftCard, setNewGiftCard] = useState({
    provider: "",
    amount: 50,
  });
  
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();
  
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) return;
      
      try {
        // Fetch gift cards
        const fetchedGiftCards = await fine.table("giftCards")
          .select()
          .eq("userId", session.user.id);
        
        setGiftCards(fetchedGiftCards || []);
        
        // Fetch trips for assignment
        const fetchedTrips = await fine.table("trips")
          .select()
          .eq("userId", session.user.id)
          .eq("status", "planned");
        
        setTrips(fetchedTrips || []);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la billetera",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, session]);
  
  const handlePurchaseGiftCard = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para comprar gift cards",
        variant: "destructive",
      });
      return;
    }
    
    if (!newGiftCard.provider || newGiftCard.amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona un proveedor y un monto válido",
        variant: "destructive",
      });
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      const today = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(today.getFullYear() + 1); // Gift cards expire in 1 year
      
      const giftCard: Schema["giftCards"] = {
        id: generateId(),
        provider: newGiftCard.provider,
        amount: newGiftCard.amount,
        purchaseDate: today.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        userId: session.user.id,
      };
      
      await fine.table("giftCards").insert(giftCard);
      
      setGiftCards([...giftCards, giftCard]);
      
      toast({
        title: "Compra exitosa",
        description: `Has comprado una gift card de ${newGiftCard.provider} por ${formatCurrency(newGiftCard.amount)}`,
      });
      
      setIsDialogOpen(false);
      setNewGiftCard({
        provider: "",
        amount: 50,
      });
    } catch (error) {
      console.error("Error purchasing gift card:", error);
      toast({
        title: "Error",
        description: "No se pudo completar la compra",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const handleAssignGiftCard = async (giftCardId: string) => {
    // In a real app, this would open a dialog to select a trip
    toast({
      title: "Asignar Gift Card",
      description: "Funcionalidad en desarrollo",
    });
  };
  
  const getWalletBalance = () => {
    return transactions.reduce((total, tx) => total + tx.amount, 0);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Mi Billetera</h1>
        
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Saldo Disponible</CardTitle>
              <CardDescription>Tu saldo actual en BitTrip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <WalletIcon className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{formatCurrency(getWalletBalance())}</span>
                </div>
                <Button size="sm">Recargar</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gift Cards</CardTitle>
              <CardDescription>Tarjetas disponibles para usar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{giftCards.length}</span>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Comprar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Comprar Gift Card</DialogTitle>
                      <DialogDescription>
                        Selecciona el proveedor y el monto para tu nueva gift card.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="provider">Proveedor</Label>
                        <Select
                          value={newGiftCard.provider}
                          onValueChange={(value) => setNewGiftCard({...newGiftCard, provider: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un proveedor" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceProviders.map((provider) => (
                              <SelectItem key={provider.id} value={provider.id}>
                                {provider.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="amount">Monto (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="10"
                          step="10"
                          value={newGiftCard.amount}
                          onChange={(e) => setNewGiftCard({...newGiftCard, amount: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handlePurchaseGiftCard} disabled={isPurchasing}>
                        {isPurchasing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Comprando...
                          </>
                        ) : (
                          "Comprar"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="gift-cards">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gift-cards">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-lg bg-muted"></div>
                ))}
              </div>
            ) : giftCards.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {giftCards.map((card) => (
                  <GiftCard
                    key={card.id}
                    id={card.id!}
                    provider={card.provider}
                    amount={card.amount}
                    purchaseDate={card.purchaseDate}
                    expiryDate={card.expiryDate}
                    tripId={card.tripId}
                    onAssign={handleAssignGiftCard}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="mb-4 text-muted-foreground">No tienes gift cards</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Comprar Gift Card
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div className={`mr-3 rounded-full p-2 ${tx.type === 'deposit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {tx.type === 'deposit' ? (
                            <ArrowDownRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <span className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WalletPage;