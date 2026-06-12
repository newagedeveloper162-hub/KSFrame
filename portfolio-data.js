/**
 * KSFrames Creative Design Studio - Dynamic Portfolio Database
 * 
 * This file serves as the data layer for our Work Gallery section.
 * The studio owner or developer can add new portfolio items by simply
 * appending a new project object to the array below.
 */

const PORTFOLIO_DATA = [
  {
    id: "project-ecommerce-portfolio",
    title: "E-Commerce Portfolio",
    category: "web",
    description: "Beautiful personal gallery engineered for visual artists and creative freelancers.",
    image: "web-ui-ecommerce", // placeholder identifier used by renderer to draw custom SVG/CSS wireframe
    tags: ["Tailwind CSS", "Intersection Observer", "Interactive"],
    link: "#"
  },
  {
    id: "project-brand-launch-flyer",
    title: "Brand Launch Flyer",
    category: "design",
    description: "Geometric high-impact event marketing poster designed for digital distribution.",
    image: "design-ui-poster",
    tags: ["Typography", "Grid Layout", "Vector Graphic"],
    link: "#"
  },
  {
    id: "project-short-form-reels",
    title: "Short-Form Creator Reels",
    category: "video",
    description: "Kinetic captions and high energy music sync templates optimized for maximum reach.",
    image: "video-ui-reel",
    tags: ["Transitions", "Audio Sync", "Figma Design"],
    link: "#"
  },
  {
    id: "project-ats-optimized-cv",
    title: "ATS-Optimized CV Layout",
    category: "resume",
    description: "Structured layout system passing parsing engines while preserving clean layout aesthetic.",
    image: "resume-ui-cv",
    tags: ["ATS-Friendly", "PDF Export", "Clean Layout"],
    link: "#"
  },
  {
    id: "project-architectural-landing",
    title: "Boutique Architectural Page",
    category: "web",
    description: "Minimalist, layout-driven landing page for premium boutique design and architecture agencies.",
    image: "web-ui-architecture",
    tags: ["Vite", "Responsive", "CSS Grid"],
    link: "#"
  },
  {
    id: "project-film-festival-poster",
    title: "Indie Film Festival Poster",
    category: "design",
    description: "Bold contrast poster emphasizing classic layout and geometric frames for independent film events.",
    image: "design-ui-filmfest",
    tags: ["Contrast Accent", "Print Ready", "Geometric Frame"],
    link: "#"
  },
  {
    id: "project-corporate-promo-reel",
    title: "Business Promo & Ad Video",
    category: "video",
    description: "Corporate promotional video with polished voiceovers, color-grading, and kinetic titles.",
    image: "video-ui-promo",
    tags: ["Color Grade", "Voiceover", "Kinetic Titles"],
    link: "#"
  },
  {
    id: "project-executive-tech-resume",
    title: "Senior Tech Executive Resume",
    category: "resume",
    description: "Polished multi-column layout showing technical stack hierarchies and career milestone timelines.",
    image: "resume-ui-executive",
    tags: ["Executive", "Multi-column", "ATS Checked"],
    link: "#"
  }
];

/**
 * Expose helper functions globally for programmatic manipulation
 */

// Global function to add a portfolio item dynamically
window.addPortfolioItem = function(item) {
  if (!item || !item.id || !item.title || !item.category) {
    console.error("Invalid portfolio item. Must contain: id, title, category (web/design/video/resume)");
    return false;
  }
  
  // Set default optional parameters
  const sanitizedItem = {
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description || "",
    image: item.image || "placeholder",
    tags: Array.isArray(item.tags) ? item.tags : [],
    link: item.link || "#"
  };
  
  PORTFOLIO_DATA.push(sanitizedItem);
  return true;
};
