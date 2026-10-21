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
  limited: "You've sent a few messages in the last hour. Please try again later.",
  notSent: "Your message couldn't be sent right now. It's still in the form: please try again in a moment.",
  failed: {
    text: "Your message couldn't be sent. The site may have just been updated: reload the page and send it again. What you wrote will still be there.",
    reload: "Reload the page",
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
    close: "Done",
    note: "Central European Time. I'll confirm the call by e-mail.",
    weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
};

// The footer's "View as an agent": the page in llms.txt, as AI agents read it
export const agentView = { button: "View as an agent" };

export const notFoundPage = {
  subTitle: "Error 404",
  title: "Lost in the grid",
  text: "This page doesn't exist, or it moved somewhere else.",
  primary: { href: "/", label: "Back home" },
  secondary: { href: "/works", label: "See the works" },
};

// The two e-mails a message sends (app/actions/contact.ts, emails/). Both say plainly that
// the site is a concept and who reads the message.
export const emailCopy = {
  concept: "Ethan Olson is a concept portfolio designed and built by AlxPro. Messages sent through it reach AlxPro.",
  notification: {
    subject: (name: string) => `New enquiry from ${name}`,
    heading: "A new message from the contact form",
    labels: { name: "Name", email: "E-mail", budget: "Budget", call: "Preferred call", message: "Message" },
    replyHint: "Reply to this e-mail to answer them directly.",
  },
  confirmation: {
    subject: "Your message to Ethan Olson",
    greeting: (name: string) => `Hi ${name},`,
    body: "Thanks for your message: it arrived, and it will be read and answered personally.",
    copyHeading: "What you sent",
    signature: "AlxPro",
  },
  noCall: "No call requested",
};
