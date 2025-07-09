import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";

interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

interface BudgetPlannerProps {
  totalBudget: number;
  onBudgetChange: (categories: BudgetCategory[]) => void;
}

export function BudgetPlanner({ totalBudget, onBudgetChange }: BudgetPlannerProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "cat_food", name: "Comida", percentage: 20, amount: totalBudget * 0.2 },
    { id: "cat_transport", name: "Transporte", percentage: 30, amount: totalBudget * 0.3 },
    { id: "cat_accommodation", name: "Alojamiento", percentage: 40, amount: totalBudget * 0.4 },
    { id: "cat_activities", name: "Actividades", percentage: 10, amount: totalBudget * 0.1 },
  ]);

  const handleSliderChange = (index: number, value: number[]) => {
    const newPercentage = value[0];
    
    // Calculate the difference to distribute among other categories
    const oldPercentage = categories[index].percentage;
    const difference = newPercentage - oldPercentage;
    
    // Don't allow negative percentages or percentages over 100
    if (difference === 0) return;
    
    const newCategories = [...categories];
    
    // Update the changed category
    newCategories[index] = {
      ...newCategories[index],
      percentage: newPercentage,
      amount: (totalBudget * newPercentage) / 100,
    };
    
    // Distribute the difference proportionally among other categories
    const otherCategories = newCategories.filter((_, i) => i !== index);
    const totalOtherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    
    if (totalOtherPercentage > 0) {
      newCategories.forEach((cat, i) => {
        if (i !== index) {
          // Calculate new percentage proportionally
          const ratio = cat.percentage / totalOtherPercentage;
          const newCatPercentage = Math.max(0, cat.percentage - difference * ratio);
          
          newCategories[i] = {
            ...cat,
            percentage: newCatPercentage,
            amount: (totalBudget * newCatPercentage) / 100,
          };
        }
      });
    }
    
    // Ensure total is exactly 100%
    const newTotal = newCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (Math.abs(newTotal - 100) > 0.1) {
      // Adjust the last category to make total exactly 100%
      const lastIndex = newCategories.length - 1 === index ? index - 1 : newCategories.length - 1;
      if (lastIndex >= 0) {
        newCategories[lastIndex].percentage = 100 - newCategories.reduce((sum, cat, i) => 
          i !== lastIndex ? sum + cat.percentage : sum, 0
        );
        newCategories[lastIndex].amount = (totalBudget * newCategories[lastIndex].percentage) / 100;
      }
    }
    
    setCategories(newCategories);
    onBudgetChange(newCategories);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Planificador de Presupuesto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-2xl font-bold">{formatCurrency(totalBudget)}</span>
          <p className="text-sm text-muted-foreground">Presupuesto Total</p>
        </div>
        
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{category.name}</Label>
                <span className="text-sm font-medium">
                  {formatCurrency(category.amount)} ({Math.round(category.percentage)}%)
                </span>
              </div>
              <Slider
                defaultValue={[category.percentage]}
                max={100}
                step={1}
                onValueChange={(value) => handleSliderChange(index, value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}