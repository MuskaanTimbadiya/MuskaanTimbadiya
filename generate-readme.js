// generate-readme.js
// Reads profile-data.json + README.template.md, writes README.md.
// Run via: node generate-readme.js

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('profile-data.json', 'utf8'));
let template = fs.readFileSync('README.template.md', 'utf8');

function formatProjectsList(projects) {
  if (!Array.isArray(projects)) return '';
  return projects.map(p => {
    let line = `- [${p.name}](${p.repo})`;
    if (p.demo) {
      line += ` · [Live demo](${p.demo})`;
    }
    return line;
  }).join('\n');
}

function formatProjectNames(projects) {
  if (!Array.isArray(projects) || projects.length === 0) return '';
  const names = projects.map(p => p.name);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

const featuredProjects = (Array.isArray(data.featuredProjects) && data.featuredProjects.length > 0)
  ? data.featuredProjects
  : [
      {
        name: 'E-Commerce-E2E-Automation-Framework',
        repo: 'https://github.com/MuskaanTimbadiya/E-Commerce-E2E-Automation-Framework'
      },
      {
        name: 'DearMe',
        repo: 'https://github.com/MuskaanTimbadiya/dearme',
        demo: 'https://dearme.ai.studio/'
      },
      {
        name: 'MindMitra',
        repo: 'https://github.com/MuskaanTimbadiya/MindMitra'
      }
    ];

const links = (data.links && typeof data.links === 'object') ? data.links : {};
const linkedinUrl = links.linkedin || 'https://www.linkedin.com/in/muskaan-timbadiya/';
const portfolioUrl = links.portfolio || 'https://muskaantimbadiya.github.io/';
const email = links.email || 'muskaantimbadiya98@gmail.com';

const linkedinDisplay = linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const portfolioDisplay = portfolioUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const rightNowList = Array.isArray(data.rightNow) && data.rightNow.length > 0
  ? data.rightNow
  : [
      'building an agentic version of my Playwright automation framework',
      'learning agentic AI patterns',
      'reading The Palace of Illusions'
    ];

const funFactsList = Array.isArray(data.funFacts) && data.funFacts.length > 0
  ? data.funFacts
  : [
      'dancing and reading are my two favourite escapes',
      'I test retail-scale software by day and explore new tech by night',
      'currently lost in The Palace of Illusions'
    ];

const replacements = {
  '{{NAME}}': data.name || 'Muskaan Timbadiya',
  '{{HEADLINE}}': data.headline || 'Senior Quality Engineer',
  '{{COMPANY}}': data.company || 'Cognizant Technology Solutions',
  '{{ASSET_VERSION}}': String(data.assetVersion || '1'),
  '{{RIGHT_NOW}}': rightNowList.join(', '),
  '{{FEATURED_PROJECTS_NAMES}}': formatProjectNames(featuredProjects),
  '{{FEATURED_PROJECTS_LIST}}': formatProjectsList(featuredProjects),
  '{{FUN_FACTS}}': funFactsList.join('; '),
  '{{LINKEDIN_DISPLAY}}': linkedinDisplay,
  '{{LINKEDIN_URL}}': linkedinUrl,
  '{{PORTFOLIO_DISPLAY}}': portfolioDisplay,
  '{{PORTFOLIO_URL}}': portfolioUrl,
  '{{EMAIL}}': email
};

Object.entries(replacements).forEach(([key, value]) => {
  template = template.split(key).join(value);
});

fs.writeFileSync('README.md', template);
console.log('README.md generated successfully from profile-data.json');
