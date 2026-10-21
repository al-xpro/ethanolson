// Simulated testimonials for the concept site: the people and companies are fictional,
// like Ethan Olson. The section labels them as samples.

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  work: string;
};

export const testimonialsHeader = {
  subTitle: "Kind words",
  title: "Testimonials",
  text: `What working with Ethan
  feels like, in the words
  of the people he built for.`,
  closing: { title: "Your product could be next.", link: "Start a project" },
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ethan replaced four tools with one screen our dispatchers actually trust. The first week, nobody asked where a truck was.",
    name: "Dana Whitlock",
    role: "Head of Operations",
    company: "Quarrow Freight",
    work: "quarrow",
  },
  {
    quote:
      "He designed for the patient who struggles most, and everyone else got a better experience too. Our phones finally stopped ringing all day.",
    name: "Priya Halvorsen",
    role: "Patient Experience Lead",
    company: "Mirelle Clinics",
    work: "mirelle-health",
  },
  {
    quote:
      "Customers spend minutes turning our headphones around in 3D. It feels like holding them, and the returns dropped with it.",
    name: "Matteo Rinaldi",
    role: "Founder",
    company: "Tenebre",
    work: "tenebre-audio",
  },
  {
    quote:
      "Our editors build interactive stories on their own now. Ethan gave us a system, not a set of one-off pages.",
    name: "Ingrid Solberg",
    role: "Editor-in-Chief",
    company: "Fieldbook Journal",
    work: "fieldbook",
  },
];
