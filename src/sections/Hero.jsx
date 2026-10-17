import { Button } from "@/components/Button";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Download,
} from "lucide-react";
import Link from "next/link";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";

const skills = [
  // Development
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "HTML5",
  "CSS3 / Sass",
  "Tailwind CSS",
  "SQL",

  // Development Tools
  "Git",
  "GitHub",
  "Vercel",

  // Analytics & Business
  "Google Analytics 4",
  "Google Tag Manager",
  "Google Search Console",
  "Looker Studio",
  "Board EPM",
  "Google Workspace",

  // AI & Automation
  "Gemini API",
  "OpenAI API",
  "Retell AI",

  // Design
  "Adobe Photoshop",
  "Adobe Illustrator",
];

const heroDots = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  duration: 15 + (index % 6) * 2,
  delay: (index % 5) * 0.5,
}));

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Hero image"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
      </div>

      {/* Green Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {heroDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute w-1.5 h-1.5 rounded-full opacity-60"
            style={{
              backgroundColor: "#10b981",
              left: dot.left,
              top: dot.top,
              animation: `slow-drift ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-analytics">
                <span className="w-2 h-2 bg-analytics rounded-full animate-pulse" />
                Digital Solutions Professional
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-fade-in animation-delay-100">
                No problems, <br />
                only <span className="text-primary glow-text ">innovative</span>
                <br />
                <span className="font-serif italic font-normal text-white">
                  solutions.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                Hi, I'm Andrea Piano, a software engineer and digital solutions
                professional passionate about combining technology, design, and
                business strategy to create intuitive digital experiences,
                develop innovative solutions, and improve business processes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <Button size="lg">
                Contact Me <ArrowRight className="w-5 h-5" />
              </Button>
              <AnimatedBorderButton
                href="/CV-Andrea-Piano.pdf"
                download="Andrea-Piano-CV.pdf"
              >
                <Download className="w-5 h-5" />
                Download CV
              </AnimatedBorderButton>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
              <span className="text-sm text-muted-foreground">Follow me: </span>
              {[
                { icon: Linkedin, href: "https://linkedin.com/in/andreapiano" },
                { icon: Github, href: "https://github.com/itsandreapiano" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.icon.name}
                  className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  {<social.icon className="w-5 h-5" />}
                </Link>
              ))}
            </div>
          </div>
          {/* Right Column - Profile Image */}
          <div className="relatice animate-fade-in animation-delay-300">
            {/* Profile Image */}
            <div className="relative max-w-md mx-auto">
              <div
                className="absolute inset-0 
              rounded-3xl bg-gradient-to-br 
              from-primary/30 via-transparent 
              to-primary/10 blur-2xl animate-pulse"
              />
              <div className="relative glass rounded-3xl p-2 glow-border-primary">
                <img
                  src="/profile-photo.png"
                  alt="Andrea Piano"
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />

                {/* Floating Badge */}
                {/* <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                      Available for work
                    </span>
                  </div>
                </div> */}
                {/* Stats Badge */}
                {/* <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                  <div className="text-2xl font-bold text-analytics">4+</div>
                  <div className="text-xs text-muted-foreground">
                    Years Exp.
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-20 animate-fade-in animation-delay-600">
          <p className="text-sm text-muted-foreground mb-6 text-center">
            Technologies & Tools
          </p>
          <div className="relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 w-32
             bg-gradient-to-r from-background to-transparent z-10"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-32
             bg-gradient-to-l from-background to-transparent z-10"
            />
            <div className="flex animate-marquee">
              {[...skills, ...skills].map((skill, idx) => (
                <div key={idx} className="flex-shrink-0 px-8 py-4">
                  <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2
  z-20 animate-fade-in animation-delay-800"
      >
        <Link
          href="#about"
          onClick={(e) => {
            e.preventDefault();

            document.getElementById("about")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="flex flex-col items-center gap-2 text-muted-foreground group"
        >
          <span
            className="text-xs uppercase tracking-wider
      group-hover:tracking-[0.3em] group-hover:text-white/75
      transition-all duration-500 ease-in-out"
          >
            Scroll
          </span>

          <ChevronDown
            className="w-6 h-6 animate-bounce
      group-hover:text-white/75 transition-colors duration-500"
          />
        </Link>
      </div>
    </section>
  );
};
