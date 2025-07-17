import {
  Coffee,
  ShoppingBag,
  Utensils,
  Plane,
  Car,
  Home,
  Film,
  ShoppingCart,
  Ticket,
  Wifi,
  Droplets,
  GraduationCap,
  Heart,
  Stethoscope,
  Gift,
  Smartphone,
  CreditCard,
  Baby,
  Music,
  Book,
  DollarSign,
  Wrench,
  Globe,
  Briefcase,
  Sun,
  PawPrint,
  MoreHorizontal,
} from "lucide-react";

export const EXPENSE_CATEGORIES = {
  foodDrink: { id: "foodDrink", name: "Food & Drink", icon: Utensils },
  coffee: { id: "coffee", name: "Coffee", icon: Coffee },
  groceries: { id: "groceries", name: "Groceries", icon: ShoppingCart },
  shopping: { id: "shopping", name: "Shopping", icon: ShoppingBag },
  transportation: { id: "transportation", name: "Transportation", icon: Car },
  travel: { id: "travel", name: "Travel", icon: Plane },
  entertainment: { id: "entertainment", name: "Entertainment", icon: Film },
  utilities: { id: "utilities", name: "Utilities", icon: Wifi },
  water: { id: "water", name: "Water", icon: Droplets },
  health: { id: "health", name: "Health", icon: Stethoscope },
  education: { id: "education", name: "Education", icon: GraduationCap },
  maintenance: { id: "maintenance", name: "Maintenance", icon: Wrench },
  gifts: { id: "gifts", name: "Gifts", icon: Gift },
  mobile: { id: "mobile", name: "Mobile", icon: Smartphone },
  rent: { id: "rent", name: "Rent", icon: Home },
  bills: { id: "bills", name: "Bills & Fees", icon: CreditCard },
  baby: { id: "baby", name: "Baby & Kids", icon: Baby },
  pets: { id: "pets", name: "Pets", icon: PawPrint },
  books: { id: "books", name: "Books", icon: Book },
  music: { id: "music", name: "Music", icon: Music },
  personal: { id: "personal", name: "Personal", icon: Heart },
  work: { id: "work", name: "Work", icon: Briefcase },
  subscriptions: { id: "subscriptions", name: "Subscriptions", icon: Ticket },
  vacation: { id: "vacation", name: "Vacation", icon: Sun },
  international: { id: "international", name: "International", icon: Globe },
  other: { id: "other", name: "Other", icon: MoreHorizontal },
  general: { id: "general", name: "General Expense", icon: DollarSign },
};

export const getCategoryById = (categoryId) => {
  return EXPENSE_CATEGORIES[categoryId] || EXPENSE_CATEGORIES.other;
};

export const getAllCategories = () => {
  return Object.values(EXPENSE_CATEGORIES);
};

export const getCategoryIcon = (categoryId) => {
  return getCategoryById(categoryId).icon;
};
