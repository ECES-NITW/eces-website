export type ResourceType = "course" | "docs" | "practice" | "video";

export type Resource = { label: string; url: string; type: ResourceType };

export type Topic = { title: string; description: string; resources: Resource[] };

export type Track = { id: "software" | "hardware"; label: string; blurb: string; topics: Topic[] };

const drive = (id: string) => `https://drive.google.com/open?id=${id}`;

export const roadmapTracks: Track[] = [
  {
    id: "software",
    label: "Software",
    blurb: "A structured path for software internships and placements: DSA first, then CS fundamentals, aptitude, projects and your resume.",
    topics: [
      {
        title: "DSA: Structured Sheets",
        description: "DSA is the most important hurdle, since the coding rounds in online tests decide everything after. Follow one structured sheet instead of solving random questions.",
        resources: [
          { label: "Striver A2Z DSA Sheet (top recommendation)", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", type: "practice" },
          { label: "NeetCode Roadmap", url: "https://neetcode.io/roadmap", type: "practice" },
          { label: "Love Babbar DSA Sheet", url: "https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view", type: "docs" },
        ],
      },
      {
        title: "DSA: Video Lectures",
        description: "When you get stuck on a topic, these instructors explain it from the basics.",
        resources: [
          { label: "TakeUForward (Striver): full DSA course", url: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z", type: "video" },
          { label: "NeetCode: YouTube channel", url: "https://www.youtube.com/@NeetCode", type: "video" },
          { label: "CodeHelp (Love Babbar): DSA playlist", url: "https://www.youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA", type: "video" },
          { label: "Aditya Verma: Recursion and DP", url: "https://www.youtube.com/@TheAdityaVerma/playlist", type: "video" },
        ],
      },
      {
        title: "DSA: Practice & Contests",
        description: "Practise daily and focus on Medium level questions. Join the weekly and biweekly LeetCode contests, since online tests are time-limited and contests feel the same. Consistency beats intensity.",
        resources: [
          { label: "LeetCode", url: "https://leetcode.com/", type: "practice" },
          { label: "GeeksforGeeks (company interview experiences)", url: "https://www.geeksforgeeks.org/", type: "practice" },
        ],
      },
      {
        title: "Object-Oriented Programming",
        description: "Core OOP concepts are asked in almost every interview. Pick C++ or Java and learn it well.",
        resources: [
          { label: "Kunal Kushwaha: OOP playlist", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcno1G3XjUbwzXHL8_EttOuKk", type: "video" },
          { label: "OOP quick revision notes (GitHub)", url: "https://github.com/vineethm1627/OOP", type: "docs" },
          { label: "GeeksforGeeks: C++ OOP", url: "https://www.geeksforgeeks.org/object-oriented-programming-in-cpp/", type: "docs" },
          { label: "GeeksforGeeks: Java OOP", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", type: "docs" },
        ],
      },
      {
        title: "DBMS & SQL",
        description: "You will often be asked to write real SQL queries in interviews and online tests, so practise JOINs and GROUP BY, not just theory.",
        resources: [
          { label: "Love Babbar: DBMS", url: "https://www.youtube.com/watch?v=eYpXCdvKwEQ&list=PLDzeHZWIZsTpukecmA2p5rhHM14bl2dHU", type: "video" },
          { label: "GeeksforGeeks: DBMS articles", url: "https://www.geeksforgeeks.org/dbms/", type: "docs" },
          { label: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/", type: "practice" },
        ],
      },
      {
        title: "Operating Systems",
        description: "Processes, threads, scheduling, memory management and deadlocks.",
        resources: [
          { label: "Love Babbar: Operating Systems", url: "https://www.youtube.com/watch?v=_TpOHMCODXo&list=PLDzeHZWIZsTr3nwuTegHLa2qlI81QweYG", type: "video" },
        ],
      },
      {
        title: "Computer Networks",
        description: "Layers, protocols and what happens when you open a website.",
        resources: [
          { label: "Gate Smashers: Computer Networks", url: "https://www.youtube.com/watch?v=JFF2vJaN0Cw&list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", type: "video" },
        ],
      },
      {
        title: "Aptitude & Online Tests",
        description: "Many companies, especially fintechs and banks, have an aptitude section in the first screening test. Don't skip it.",
        resources: [
          { label: "IndiaBIX: aptitude", url: "https://www.indiabix.com/aptitude/questions-and-answers/", type: "practice" },
          { label: "InterviewBit: timed mock tests", url: "https://www.interviewbit.com/", type: "practice" },
        ],
      },
      {
        title: "Projects: Full-Stack Web",
        description: "Build one or two non-trivial projects you can talk about for 15 to 20 minutes. MERN or Spring Boot both work. Solve a real problem instead of building a to-do list, and deploy it (frontend on Vercel or Netlify, backend on Render).",
        resources: [
          { label: "The Odin Project", url: "https://www.theodinproject.com/", type: "course" },
          { label: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "course" },
        ],
      },
      {
        title: "Projects: Machine Learning",
        description: "Go beyond a notebook and an accuracy score: train a model, wrap it in an API (FastAPI or Flask) and give it a simple frontend (Streamlit or Gradio). Codebasics, CampusX and Krish Naik on YouTube have good project-based tutorials.",
        resources: [
          { label: "Andrew Ng: Machine Learning Specialization", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "course" },
          { label: "Kaggle", url: "https://www.kaggle.com/", type: "practice" },
        ],
      },
      {
        title: "Resume",
        description: "Use the standard college template. Keep it black and white with no photo, list only what you can confidently discuss, start every bullet with an action verb, and write bullets as: accomplished X, measured by Y, by doing Z. Add GitHub, live demo, LeetCode and LinkedIn links.",
        resources: [
          { label: "NIT Warangal resume template (Overleaf)", url: "https://www.overleaf.com/latex/templates/nit-warangal-resume/gtsrbjvffcjn", type: "docs" },
        ],
      },
    ],
  },
  {
    id: "hardware",
    label: "Hardware",
    blurb: "Resources for core ECE internships and placements, covering analog, digital and programming.",
    topics: [
      {
        title: "Aptitude",
        description: "Online tests include an aptitude section. Practise number series, seating arrangements, time and work, and data interpretation.",
        resources: [{ label: "IndiaBIX", url: "https://www.indiabix.com", type: "practice" }],
      },
      {
        title: "Network Theory & Intuitive Analysis",
        description: "RC circuits, transient response and Laplace transforms. Intuitive analysis matters a lot in interviews.",
        resources: [
          { label: "Himanshu Agarwal: Network Theory (until lecture 49)", url: "https://www.youtube.com/playlist?list=PLgF7lRh8Xb_X6vMQiT9hy4OGGRASX0hXc", type: "video" },
        ],
      },
      {
        title: "Diode Circuits",
        description: "Clippers, clampers, rectifiers and Zener circuits.",
        resources: [
          { label: "Neso Academy: Diode circuits", url: "https://www.youtube.com/playlist?list=PLstSxcpBGrtVDM5jLbBD8xGGUOmqpNxqL", type: "video" },
        ],
      },
      {
        title: "EDC & BJTs",
        description: "Electronic devices and BJT circuits.",
        resources: [
          { label: "Razavi: EDC and BJTs", url: "https://www.youtube.com/playlist?list=PLyYrySVqmyVPzvVlPW-TTzHhNWg1J_0LU", type: "video" },
        ],
      },
      {
        title: "MOSFETs",
        description: "MOSFET characteristics, biasing and small signal analysis.",
        resources: [
          { label: "Razavi: MOSFETs", url: "https://www.youtube.com/playlist?list=PLyYrySVqmyVPzvVlPW-TTzHhNWg1J_0LU", type: "video" },
          { label: "Himanshu Agarwal: examples and questions", url: "https://www.youtube.com/playlist?list=PLgF7lRh8Xb_XYAVGkhkItIlSD50qzE6sa", type: "video" },
        ],
      },
      {
        title: "Op-Amps",
        description: "Op-amp basics, feedback identification, and port impedance and gain calculation.",
        resources: [
          { label: "Himanshu Agarwal: Op-Amps", url: "https://www.youtube.com/playlist?list=PLgF7lRh8Xb_VB-fujc7uO2JmbpKJjrB0p", type: "video" },
        ],
      },
      {
        title: "Signals & Systems",
        description: "Fourier series, transforms and the Nyquist rate. Often asked in interviews.",
        resources: [
          { label: "Kreatryx: Signals & Systems", url: "https://www.youtube.com/playlist?list=PLs5_Rtf2P2r6aPi0qUlmTPzKOoQaW0b1c", type: "video" },
        ],
      },
      {
        title: "Control Systems",
        description: "Focus on second order systems and steady state response.",
        resources: [
          { label: "Control Systems playlist", url: "https://www.youtube.com/playlist?list=PLs5_Rtf2P2r4r0h0VT5gn36f1_PXjok-c", type: "video" },
        ],
      },
      {
        title: "Digital Circuit Design & CMOS",
        description: "Gates, K-maps, combinational and sequential circuits, and digital CMOS.",
        resources: [
          { label: "Kreatryx: Digital Circuit Design & CMOS", url: "https://www.youtube.com/playlist?list=PLs5_Rtf2P2r77kmBnXAe06RsI3VadeQ5s", type: "video" },
          { label: "Digital Electronics notes", url: drive("1y58IiyWzwk1A7VMaX4VrwoBFfUA4Z9Tb"), type: "docs" },
        ],
      },
      {
        title: "Static Timing Analysis",
        description: "Setup and hold timing, and critical paths.",
        resources: [
          { label: "VLSI Expert: Static Timing Analysis", url: "https://www.vlsi-expert.com/p/static-timing-analysis.html", type: "docs" },
          { label: "FIFO depth calculation", url: "https://hardwaregeeksblog.wordpress.com/wp-content/uploads/2016/12/fifodepthcalculationmadeeasy2.pdf", type: "docs" },
        ],
      },
      {
        title: "Verilog HDL",
        description: "Very important for interviews. They test fundamentals and syntax, not long programs.",
        resources: [
          { label: "Indranil Sengupta: NPTEL Verilog", url: "https://www.youtube.com/playlist?list=PLJ5C_6qdAvBELELTSPgzYkQg3HgclQh-5", type: "video" },
          { label: "Verilog NPTEL slides", url: drive("1IVRxItnQmJyFQ6dOa_iNVGGLy2JRJOUd"), type: "docs" },
        ],
      },
      {
        title: "Computer Organisation & Architecture",
        description: "Basics of computer architecture.",
        resources: [
          { label: "Gate Smashers: COA", url: "https://youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX", type: "video" },
        ],
      },
      {
        title: "Programming",
        description: "C basics, then practice on coding sites. Go through basic DSA as well.",
        resources: [
          { label: "C Programming for Beginners", url: "https://www.youtube.com/watch?v=KJgsSFOSQv0", type: "video" },
          { label: "C concepts and practice playlist", url: "https://youtube.com/playlist?list=PLYT7YDstBQmEGhVqAoubBS0OE_5m4JDUe", type: "video" },
          { label: "HackerRank", url: "https://www.hackerrank.com", type: "practice" },
        ],
      },
      {
        title: "Hardware Apprenticeship Program",
        description: "Module notes from the ECE Society apprenticeship program.",
        resources: [
          { label: "Module 1", url: drive("1pQjzEPJm4JFkQjZdnVMhzmTzMirE7X8_"), type: "docs" },
          { label: "Module 2", url: drive("1ZfFhbcpz8SUqTMvaG3LhQOek0d-pVMsw"), type: "docs" },
          { label: "Module 3", url: drive("16zgg0oXAeDqgIV28ilsolVrzI58sJUb6"), type: "docs" },
          { label: "Module 6", url: drive("1oDH4KtyKato23wMAOFyCqJRwriqAfbNey_py9bp4fVM"), type: "docs" },
          { label: "Module 7", url: drive("1elZStzMWAgGGKTdf2yX9R3BsD1QxksFiHRonJGIEXCs"), type: "docs" },
        ],
      },
    ],
  },
];