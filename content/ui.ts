// Interface copy that stays in code: labels, the 404 page and the form. Everything a client
// edits lives in Storyblok, with its defaults in content/defaults.

// The intro video's words (part of the mask animation, not editable)
export const introText = {
  title: "Shaped by vision",
  subtitle: "Powered by Precision",
  top: "Where Ideas",
  bottom: "Into Reality",
};

export const testimonialLabels = { link: "See the project →" };

export const workLabels = {
  back: "All works",
  client: "Client",
  duration: "Duration",
  role: "Role",
  stack: "Stack",
  challenge: "The challenge",
  solution: "What I built",
  results: "Results",
  next: "Next project",
  templates: "Templates",
};

export const serviceLabels = {
  timeline: "Services",
  step: "Step",
  duration: "Typical timeline",
  deliverables: "What you get",
  process: "How I work",
};

export const legalLabels = { updated: "Last updated", onThisPage: "On this page" };

export const contactLabels = {
  email: "E-mail",
  replies: "Replies",
  social: "Social media",
  privacy: {
    text: "I only use your details to reply to your message. More in the",
    link: "privacy policy",
  },
  callPicker: {
    label: "Preferred call",
    optional: "optional",
    placeholder: "Choose a free day",
    dialog: "Choose a day and a time for a call",
    previous: "Previous month",
    next: "Next month",
    free: "free",
    booked: "booked",
    times: "Times",
    none: "No free days left this month: try the next one.",
    clear: "Clear",
    note: "Central European Time. I'll confirm the call by e-mail.",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
};

export const notFoundPage = {
  subTitle: "Error 404",
  title: "Lost in the grid",
  text: "This page doesn't exist, or it moved somewhere else.",
  primary: { href: "/", label: "Back home" },
  secondary: { href: "/works", label: "See the works" },
};
