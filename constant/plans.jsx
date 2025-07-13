export const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$5.99",
    validity: "30 days",
    features: ["Access to free courses", "Limited quizzes", "Basic support"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$14.99",
    validity: "60 days",
    features: [
      "All Basic features",
      "Unlimited quizzes",
      "AI-powered explanations",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$29.99",
    validity: "90 days",
    features: [
      "All Pro features",
      "1-on-1 mentorship",
      "Early access to new content",
      "Priority support",
    ],
    popular: false,
  },
];
