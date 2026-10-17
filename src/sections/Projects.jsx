import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "RWS Polska",
    description:
      "RWS Polska is a business website featuring an interactive product catalog, advanced filtering, and product customization. Customers can explore equipment, request personalized quotes, and contact sales teams.",
    image: "/projects/rwspolska.png",
    tags: ["React", "TypeScript", "Next.js", "Tailwind"],
    role: "Solo",
    type: "Commercial Project",
    link: "https://rwspolska.pl",
  },
  {
    title: "Greenpeace Supporters Portal",
    description:
      "A web portal for Greenpeace supporters to manage their subscriptions and donations for promoting campaigns.",
    image: "/projects/greenpeace.png",
    tags: ["React", "Next.js", "Bootstrap"],
    role: "Team",
    type: "Commercial Project",
    link: "https://sostenitori.greenpeace.it",
  },
  {
    title: "iStellas",
    description:
      "iStellas is a concept for a modern, astrology-themed social media platform where people can connect based on their astrological traits and share deeper personal insights about life.",
    image: "/projects/istellas.png",
    tags: [
      "React",
      "TypeScript",
      "Tailwind",
      "Free Astrology API",
      "Prisma DB",
    ],
    role: "Solo",
    type: "Personal Project",
    link: "https://istellas.vercel.app",
  },
  {
    title: "Sardinia Digital Library",
    description:
      "Sardinia Digital Library is a multimedia platform dedicated to preserving and showcasing Sardinia's cultural heritage through images, videos, audio, and historical documents. It features an extensive digital archive with advanced search and filtering tools to explore the island's history, traditions, and identity.",
    image: "/projects/sdl.png",
    tags: ["React", "Next.js", "Bootstrap"],
    role: "Team",
    type: "Commercial Project",
    link: "https://www.sardiniadigitallibrary.it",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-primary">
            Ideas. Code.{" "}
            <span className="font-serif italic font-normal text-white">
              Creation.
            </span>
          </h2>

          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            Explore a selection of web applications I've worked on, both
            independently and as part of a team, combining modern technologies,
            intuitive design, and creative thinking.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project.title}
              className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />

                {/* Overlay Links */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={project.link}
                    aria-label={`Visit ${project.title}`}
                    className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>

                  {project.github && (
                    <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href={project.github}
                      aria-label={`View ${project.title} on GitHub`}
                      className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold hover:text-primary transition-colors duration-300"
                  >
                    {project.title}
                  </Link>

                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title}`}
                    className="shrink-0 text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 hover:-translate-y-1"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Project Details */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-analytics/10 text-analytics border border-analytics/20">
                    {project.role}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10">
                    {project.type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
