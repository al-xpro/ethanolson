// Hero section

export const heroHeader = {
  subTitle: "Hi, I'm John",
  title: "Design Engineer",
  text: `I design intuitive and engaging digital
  experiences that captivate users
  and drive business growth.`,
};

// Zoom Parallax

export const Picture1 = "/images/draw.jpg";
export const Picture2 = "/images/particles.jpg";
export const Picture3 = "/images/interior.jpg";
export const Picture4 = "/images/metro.jpg";
export const Picture5 = "/images/laptop.jpg";
export const Picture6 = "/images/pen.jpg";

// Services section

export const servicesHeader = {
  subTitle: "What I Offer",
  title: "Services",
  text: `I specialize in creating interfaces  
    designed to offer unique value, 
    and meet specific needs.`,
};

export const servicesData = [
  {
    title: "UI / UX Design Systems",
    description:
      "I design interface systems that scale effortlessly. From structure to style, every component is crafted to ensure consistency, accessibility, and long-term product clarity.",
    visuals: [
      {
        src: "/images/first-service.png",
        alt: "Design system components",
      },
    ],
  },

  {
    title: "Interactive Frontend Experiences",
    description:
      "I bring interfaces to life through motion and interaction. Smooth animations, subtle micro-interactions, and fluid layouts transform static screens into engaging experiences.",
    visuals: [
      {
        src: "/images/second-service.png",
        alt: "Micro-interactions UI",
      },
    ],
  },

  {
    title: "Product & UX Engineering",
    description:
      "I connect design intent with production-ready code. Every interface is engineered for usability, performance, and maintainability — so products evolve without friction.",
    visuals: [
      {
        src: "/images/third-service.png",
        alt: "UX iteration process",
      },
    ],
  },

  {
    title: "Branding & Visual Identity",
    description:
      "I craft visual identities that feel intentional and timeless. Every logo, color, and typographic choice is designed to communicate meaning and emotion.",
    visuals: [
      {
        src: "/images/fourth-service.jpg",
        alt: "Logo exploration",
      },
    ],
  },
];

// About section

export const aboutHeader = {
  subTitle: "Who I am",
  title: "About",
  text: `I love design and develop for the web
    and I'm obsessed with minimalist,
    pixel-perfect user interfaces.`,
};

export const aboutText = `- Team Player
  - Problem Solver
    - Detail-oriented
    - Passionate about design
    - Adaptable and quick learner`;

// Works section

export const worksHeader = {
  subTitle: "My recent works",
  title: "Works",
  text: `Projects that I've worked on recently, 
  showcasing my skills and passion
  in design and development.`,
};

export const workImages = [
  "/projects/project-01.jpg",
  "/projects/project-02.jpg",
  "/projects/project-03.jpg",
  "/projects/project-04.jpg",
  "/projects/project-05.jpg",
  "/projects/project-06.jpg",
  "/projects/project-07.jpg",
  "/projects/project-08.jpg",
  "/projects/project-09.jpg",
  "/projects/project-10.jpg",
  "/projects/project-11.jpg",
  "/projects/project-12.jpg",
];

// Case Studies section

type CaseStudy = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
};

export const CaseStudiesContent: CaseStudy[] = [
  {
    title: "Next Gen Marketing",
    description:
      "Designing and implementing a full-stack website for a leading marketing agency. The project involved creating a modern and responsive website that met the needs of the agency's clients.",
    image: {
      src: "/projects/casestudies-01.jpg",
      alt: "Next Gen Marketing project",
    },
  },
  {
    title: "Premium Agency",
    description:
      "The perfect balance between simplicity and sophistication, with a focus on accessibility and user experience, this website is a testament to the power of minimalism.",
    image: {
      src: "/projects/casestudies-02.jpg",
      alt: "Premium Agency project",
    },
  },
  {
    title: "Mariven",
    description:
      "From its soft coastal tones to its fully responsive, performance-optimized build, every detail of Mariven is made to feel intentional, elevated, and built for connection.",
    image: {
      src: "/projects/casestudies-03.jpg",
      alt: "Mariven project",
    },
  },
  {
    title: "AI-Powered Design Assistant",
    description:
      "A SaaS business model with a Design Assistant. The AI-powered assistant provides content suggestions based on user inputs, ensuring a seamless and personalized user experience.",
    image: {
      src: "/projects/casestudies-04.jpg",
      alt: "AI-Powered project",
    },
  },
];

// Middle Parallax

export const WavingWater = "/images/waving-water.jpg";
export const WaterSpray = "/images/water-spray.jpg";
export const WaterRipple = "/videos/water-ripple.mp4";

export const contentParallax = {
  firstContet:
    "Every interaction is fluid like water, and every interface is a reflection of the user's needs.",

  secondContet:
    "Minimalism is not absence - it's precision. Every detail exists for a reason and is intentional.",
};

// Stories section

export const storiesHeader = {
  subTitle: "What people say",
  title: "Stories",
  text: `A collection of stories from clients,
  highlighting skills, passion, and
  and ability to meet their needs.`,
};

export const FLoating1 = "/images/sea.avif";
export const FLoating2 = "/images/sea.avif";
export const FLoating3 = "/images/sea.avif";
export const FLoating4 = "/images/sea.avif";
export const FLoating5 = "/images/sea.avif";
export const FLoating6 = "/images/sea.avif";
export const FLoating7 = "/images/sea.avif";
export const FLoating8 = "/images/sea.avif";
export const FLoating9 = "/images/sea.avif";
export const FLoating10 = "/images/sea.avif";
export const FLoating11 = "/images/sea.avif";
export const FLoating12 = "/images/sea.avif";
export const FLoating13 = "/images/sea.avif";
export const FLoating14 = "/images/sea.avif";
export const FLoating15 = "/images/sea.avif";
export const FLoating16 = "/images/sea.avif";
export const FLoating17 = "/images/sea.avif";
export const FLoating18 = "/images/sea.avif";
export const FLoating19 = "/images/sea.avif";
export const FLoating20 = "/images/sea.avif";

export type Testimonial = {
  id: string
  name: string
  username: string
  avatar: string
  description: string
}

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Alex Morgan",
    username: "alexmorgan",
    avatar: "/avatars/alex.jpg",
    description:
      "Working with John was effortless. The attention to detail and motion design is honestly next level.",
  },
  {
    id: "t-2",
    name: "Sofia Bennett",
    username: "ben_sof",
    avatar: "/avatars/sofia.jpg",
    description:
      "One of the cleanest implementations I’ve seen. Performance, visuals, and UX are perfectly balanced.",
  },
  {
    id: "t-3",
    name: "Daniel Ruiz",
    username: "dan",
    avatar: "/avatars/daniel.jpg",
    description:
      "The final result exceeded expectations. Subtle animations, strong identity, and great communication.",
  },
  {
    id: "t-4",
    name: "Emily Adams",
    username: "emily_a",
    avatar: "/avatars/emily.jpg",
    description:
      "The website is a reflection of John's expertise in web development. Outstanding what he can build.",
  },
  {
    id: "t-5",
    name: "Michael Denver",
    username: "denverm",
    avatar: "/avatars/michael.jpg",
    description:
      "The website is a masterpiece. What I like most is his ability to combine design and functionality.",
  },
  {
    id: "t-6",
    name: "Robbie Davis",
    username: "robbiedav",
    avatar: "/avatars/robbie.jpg",
    description:
      "I can only say that I was very impressed with the website. It's a real gem!",
  },
  {
    id: "t-7",
    name: "Robert Wilson",
    username: "robertwww",
    avatar: "/avatars/robert.jpg",
    description:
      "I was blown away by the website's design. It's a work of art, and I can't wait to see more of his work.",
  },
  {
    id: "t-8",
    name: "Sarah Fisher",
    username: "fisher_sarah",
    avatar: "/avatars/sarah.jpg",
    description:
      "The app design clearly reflects John's expertise in UI/UX. I want to see more of his work in the future.",
  },
  {
    id: "t-9",
    name: "Michael Seymour",
    username: "mich_sem",
    avatar: "/avatars/michael-s.jpg",
    description:
      "The AI design assistant is like having someone who knows everything about design. A game-changer in production.",
  },
  {
    id: "t-10",
    name: "Alexandra Rodriguez",
    username: "rodri_alexa",
    avatar: "/avatars/alexa.jpg",
    description:
      "One word: Brilliant! He has transformed minimalism into something truly remarkable.",
  },
  {
    id: "t-11",
    name: "William Brown",
    username: "bro_w_n",
    avatar: "/avatars/william.jpg",
    description:
      "Why do I keep coming back to this and my website? Easy. It's like a work of art in every sense of the word.",
  },
  {
    id: "t-12",
    name: "Sandra Garcia",
    username: "garsan_ciandra",
    avatar: "/avatars/sandra.jpg",
    description:
      "Love it! John is a true genius when it comes to design. I'm inspired.",
  },
  {
    id: "t-13",
    name: "Carlos Sanchez",
    username: "calsanchez",
    avatar: "/avatars/carlos.jpg",
    description:
      "The code is clean, the design is stunning, and the attention to detail is outstanding.",
  },
  {
    id: "t-14",
    name: "Raul Gomez",
    username: "rualgo",
    avatar: "/avatars/raul.jpg",
    description:
      "Every line of code, every pixel, and every animation is carefully crafted to deliver a perfect user experience.",
  },
  {
    id: "t-15",
    name: "Luisa Lopez",
    username: "luisalopez",
    avatar: "/avatars/luisa.jpg",
    description:
      "John has a talent for creating stunning interfaces that captivate users and drive business growth.",
  },
  {
    id: "t-16",
    name: "Javier Ramirez",
    username: "javier_ramirez",
    avatar: "/avatars/javier.jpg",
    description:
      "What can I say... I'm speechless. Really impressed by the work he did.",
  },
  {
    id: "t-17",
    name: "Andrea Hernandez",
    username: "herandez",
    avatar: "/avatars/andrea.jpg",
    description:
      "The website has a sleek and modern look. I'm in awe.",
  },
  {
    id: "t-18",
    name: "Eduardo Perez",
    username: "edo_perez",
    avatar: "/avatars/eduardo.jpg",
    description:
      "John is so good, there's no reason to look anywhere else 🔥",
  },
  {
    id: "t-19",
    name: "Carla Flores",
    username: "carla_fl",
    avatar: "/avatars/carla.jpg",
    description:
      "I'm in love with the animations he created. They are 🤯",
  },
  {
    id: "t-20",
    name: "Fernando Vargas",
    username: "ferva",
    avatar: "/avatars/fernando.jpg",
    description:
      "Actually, I'm in love with the design. Big fan of the minimalist look 👀",
  }
]


// Outro Parallax

export const OutroParallaxText = "The world is a canvas, and I paint it with code.";


// Contact section

export const contactHeader = {
  subTitle: "Get in touch",
  title: "Contact",
  text: `If you like my work and you want
  to collaborate don't hesitate
  to reach me out.`,
};
