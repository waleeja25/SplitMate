import {
  Wallet,
  Users,
  RefreshCcw,
  CheckCircle,
  Clock,
  BarChart3,
  Receipt,
  CreditCard,
} from "lucide-react";

export const actions = [
  { first: "track", word: "expenses", sub: "so nothing gets lost" },
  { first: "split", word: "bills", sub: "without messy math" },
  { first: "settle", word: "balances", sub: "with just a tap" },
  { first: "save", word: "friendships", sub: "by keeping it fair" },
];

export const steps = [
  {
    title: "Create Your Group",
    Icon: Users,
    bg: "bg-green-100",
    color: "text-[#2a806d]",
    description: "Start by creating a group and adding members.",
  },
  {
    title: "Add Expenses",
    Icon: Receipt,
    bg: "bg-sky-100",
    color: "text-sky-600",

    description:
      "Log any shared expenses. Split equally or customize who paid and who owes.",
  },
  {
    title: "Settle Up",
    Icon: CreditCard,
    bg: "bg-[#f4f0fb]",
    color: "text-[#805ad5]",
    description:
      "Let SplitMate calculate who owes whom. Mark payments as settled when complete.",
  },
];

export const FEATURES = [
  {
    title: "Easy Expense Tracking",
    Icon: Wallet,
    bg: "bg-green-100",
    color: "text-green-600",
    description: "Quickly log and split bills among friends or groups.",
  },
  {
    title: "Group Management",
    Icon: Users,
    bg: "bg-blue-100",
    color: "text-blue-600",
    description: "Create groups for trips, dinners, or shared households.",
  },
  {
    title: "Real-time Updates",
    Icon: RefreshCcw,
    bg: "bg-teal-100",
    color: "text-teal-600",
    description: "See new expenses and repayments instantly as they’re added.",
  },
  {
    title: "Smart Settlements",
    Icon: CheckCircle,
    bg: "bg-yellow-100",
    color: "text-yellow-600",
    description: "Simplify who owes whom with optimized settlement paths.",
  },
  {
    title: "Track Anytime",
    Icon: Clock,
    bg: "bg-purple-100",
    color: "text-purple-600",
    description: "Access your balances and history anytime, anywhere.",
  },
  {
    title: "Insights & Reports",
    Icon: BarChart3,
    bg: "bg-pink-100",
    color: "text-pink-600",
    description: "Visualize spending trends with clear reports and charts.",
  },
];
export const testimonials = [
  {
    quote:
      "SplitMate saved our group trips from endless spreadsheet arguments. Now we actually enjoy splitting bills!",
    author: "Sarah & Her Travel Friends",
  },
  {
    quote:
      "Managing housemate expenses was always messy. SplitMate made it easy and fair for everyone!",
    author: "John & Roommates",
  },
  {
    quote:
      "Tracking shared expenses for trips has never been simpler. The automatic splits are genius!",
    author: "Emma & Travel Buddies",
  },
  {
    quote:
      "I love how SplitMate handles recurring expenses automatically. Saves me so much time!",
    author: "Alex & Family",
  },
];
export const emojis = [
  {
    src: "https://openmoji.org/data/black/svg/1F4B8.svg",
    color: "#2A806D",
  },
  {
    src: "https://openmoji.org/data/black/svg/1F9FE.svg",
    color: "#36a186",
  },
  {
    src: "https://openmoji.org/data/black/svg/1F355.svg",
    color: "#333333",
  },
  {
    src: "https://openmoji.org/data/black/svg/2708.svg",
    color: "#805AD5",
  },
];
