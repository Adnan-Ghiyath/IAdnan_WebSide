// show-projects.js
import { SaveProjects } from "./save-projects.js";

export class ShowProjects {
  constructor(projects = null) {
    this.featuredGrid = document.getElementById("projects-featured");
    this.grid = document.getElementById("projects");

    if (projects) {
      this.publishProjects(projects);
      this.saveProjects(projects);
    } else {
      this.loadAndShowOldProjects();
    }
  }

  publishProjects(projects) {
    if (!this.grid || !this.featuredGrid) {
      console.error("Grid element not found");
      return;
    }

    if (!projects || projects.length === 0) {
      this.grid.innerHTML = '<p class="error">No projects to display</p>';
      this.featuredGrid.innerHTML = "";
      return;
    }

    const superProjects = projects.filter((p) => p.super).slice(0, 2);
    const superIds = new Set(superProjects.map((p) => p.id));
    const others = projects.filter((p) => !superIds.has(p.id));

    this.featuredGrid.innerHTML =
      superProjects.length > 0 ? this.buildCardsHTML(superProjects, true) : "";

    this.grid.innerHTML =
      others.length > 0 ? this.buildCardsHTML(others, false) : "";
  }

  buildCardsHTML(projects, isSuper) {
    const isMobile = window.innerWidth <= 768; // نفس نقطة الكسر المستخدمة بالـ CSS

    return projects
      .map((project, index) => {
        // Parse SubTitle to ensure it's an array
        let tags = [];
        if (project.SubTitle) {
          if (typeof project.SubTitle === "string") {
            try {
              const parsed = JSON.parse(project.SubTitle);
              tags = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              tags = [];
            }
          } else if (typeof project.SubTitle === "object") {
            tags = Array.isArray(project.SubTitle) ? project.SubTitle : [];
          }
        }

        const tagsHTML = tags
          .map((tag) => `<span class="tag">${tag}</span>`)
          .join("");

        const superBadge = isSuper
          ? `<span class="featured-corner-badge">Special</span>`
          : "";

        const normalStar =
          !isSuper && project.is_featured
            ? `<span class="normal-star" title="Featured">★</span>`
            : "";

        // هل هذا المشروع مقيّد على الموبايل؟
        const isRestricted = project.desktop_only && isMobile;

        const desktopBanner = isRestricted
          ? `<div class="desktop-only-banner">🖥️ Best viewed on desktop</div>`
          : "";

        return `
        <article class="project-card${
          isSuper ? " featured" : ""
        }" style="animation-delay: ${index * 0.1}s">
          ${superBadge}
          ${normalStar}
          ${desktopBanner}
          <div class="card-image-container">
            <img src="${project.Img}" 
                 alt="${project.Name || "Project"}" 
                 class="card-image" 
                 loading="${isSuper ? "eager" : "lazy"}">
            <div class="card-overlay">
              <div class="card-buttons">
                ${
                  project.Wep_PreviewBTN
                    ? isRestricted
                      ? `<span class="card-btn card-btn-primary card-btn-disabled" title="Best viewed on desktop">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Preview
      </span>`
                      : `<a href="${project.Wep_PreviewBTN}" target="_blank" class="card-btn card-btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Preview
      </a>`
                    : ""
                }
                ${
                  project.Git_PreviewBTN
                    ? `<a href="${project.Git_PreviewBTN}" target="_blank" class="card-btn card-btn-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px; vertical-align:middle;">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        Source code
    </a>`
                    : ""
                }
              </div>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${project.Name || "Untitled"}</h3>
            <p class="card-description">${project.Title || ""}</p>
            <div class="card-tags">${tagsHTML}</div>
          </div>
        </article>
        `;
      })
      .join("");
  }

  saveProjects(projects) {
    const saver = new SaveProjects(projects);
  }

  loadAndShowOldProjects() {
    const saver = new SaveProjects();
    const oldProjects = saver.getOldProjects();

    if (oldProjects.length > 0) {
      this.publishProjects(oldProjects);
    } else {
      console.log("No locally saved projects, waiting for server load");
    }
  }
}
