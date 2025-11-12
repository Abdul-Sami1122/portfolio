// server.js
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Render the main portfolio page
app.get("/", (req, res) => {
  // You can pass dynamic data to your template here
  const portfolioData = {
    name: "Abdul Sami",
    title: "Full Stack Developer",
    // Moved contact info here for "single source of truth"
    contact: {
      email: "sb850839@gmail.com",
      linkedin: "https://www.linkedin.com/in/your-profile-id", // Add your LinkedIn profile
      github: "https://github.com/Abdul-Sami1122", // Add your GitHub profile
      twitter: "https://twitter.com/your-handle", // Add your Twitter/X profile
      whatsapp: "https://wa.me/923228483029",
    },
    technologies: [
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "JavaScript (ES6+)" },
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "MongoDB" },
      { name: "EJS" },
      { name: "Git & GitHub" },
      { name: "REST APIs" },
    ],
    projects: [
      {
        title: "Wonder Lust",
        description: `A full-stack property listing app. Users can browse, filter (by category, price, etc.), and add their own listings. Includes user authentication, search, and a dark mode toggle`,
        imageUrl: "/images/pg1.png",
        link: "https://wonderlust-yb5v.onrender.com/listings",
      },
      {
        title: "WeatherNow - Real-Time Forecast App",
        description: `A dynamic weather app providing on-demand forecasts for any city worldwide by querying a live third-party API.`,
        imageUrl: "/images/project-2.png",
        link: "https://weather-yr77.onrender.com/",
      },
      {
        title: "Landing Page",
        description:
          "A landing page, crafted with HTML, CSS, and JS, is a focused web page designed to convert visitors into leads or customers through a clear call to action and engaging interactivity.",
        imageUrl: "/images/project3.png",
        // UPDATED: Changed link from "#" to avoid page jump
        link: "https://superb-salmiakki-b81c10.netlify.app/",
      },
      {
        title: "Wazir Glass & Aluminium managment system",
        description:
          "A landing page, crafted with HTML, CSS, and JS, is a focused web page designed to convert visitors into leads or customers through a clear call to action and engaging interactivity.",
        imageUrl: "/images/wazir.png",
        link: "https://wazir-glass-frontend.onrender.com/",
      },
    ],
  };
  res.render("index", portfolioData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
