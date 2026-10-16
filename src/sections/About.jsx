import { Code2, Lightbulb, Rocket, Users } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description:
      "Writing clean, well-structured, and efficient code to create reliable, high-quality applications.",
  },
  {
    icon: Rocket,
    title: "Performance",
    description:
      "Building fast, responsive applications that deliver smooth, intuitive user experiences.",
  },
  {
    icon: Users,
    title: "Global Collaboration",
    description:
      "Working with international teams, combining diverse perspectives and expertise to achieve shared goals.",
  },
  {
    icon: Lightbulb,
    title: "AI & Innovation",
    description:
      "Integrating AI technologies into digital solutions to automate processes, enhance functionality, and explore new possibilities.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-primary text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-primary">
              Where technology{" "}
              <span className="font-serif italic font-normal text-white">
                meets
              </span>{" "}
              <span className="gradient-text">creativity.</span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              <p>
                I'm a{" "}
                <strong>
                  software engineer and digital solutions professional,
                </strong>{" "}
                with over 4 years of experience combining software development,
                design, and business technology to create effective digital
                solutions.
              </p>

              <p>
                My primary expertise lies in <strong>React & Next.js</strong>,
                complemented by experience in UI/UX, analytics, and business
                systems. I enjoy bringing ideas to life, combining creativity
                and technical expertise to design, develop, and deploy digital
                solutions from the ground up.
              </p>

              <p>
                Beyond software development, I'm passionate about{" "}
                <strong>digital design, AI, and automation</strong>. I thrive in
                environments where I can combine technical expertise with
                creativity and strategic thinking, take ownership of projects,
                and contribute to meaningful digital innovation.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 glow-border-primary animate-fade-in animation-delay-300">
              <p className="text-lg font-medium italic text-foreground">
                "High performance? It's a must. The more creative?{" "}
                <span className="font-semibold"> The better.</span>"
              </p>
            </div>
          </div>

          {/* Right Column - Hilights */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
