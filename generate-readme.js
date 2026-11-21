// generate-readme.js
// Reads profile-data.json + README.template.md, writes README.md.
// Run via: node generate-readme.js

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('profile-data.json', 'utf8'));
let template = fs.readFileSync('README.template.md', 'utf8');

function formatProjectBadges(projects) {
  if (!Array.isArray(projects)) return '';
  const badges = [];

  projects.forEach((p, idx) => {
    const isDearMe = p.name.toLowerCase().includes('dearme');
    // Align with card colors: DearMe is crimson (#ff354f), others are electric blue (#247bff)
    const repoColor = isDearMe ? 'ff354f' : '247bff';
    const shortLabel = (p.shortName || p.name).replace(/-/g, '--').replace(/ /g, '_');

    let badgeGroup = `[![${p.name}](https://img.shields.io/badge/${encodeURIComponent(shortLabel)}-Repository-${repoColor}?style=for-the-badge&logo=github&logoColor=white)](${p.repo})`;

    if (p.demo) {
      badgeGroup += `\n[![${p.name} Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-247bff?style=for-the-badge&logo=googlechrome&logoColor=white)](${p.demo})`;
    }

    badges.push(badgeGroup);
  });

  return `<div align="center">\n\n${badges.join('\n&nbsp;&nbsp;\n')}\n\n</div>`;
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
        shortName: 'E-Commerce Framework',
        repo: 'https://github.com/MuskaanTimbadiya/E-Commerce-E2E-Automation-Framework'
      },
      {
        name: 'DearMe',
        shortName: 'DearMe',
        repo: 'https://github.com/MuskaanTimbadiya/dearme',
        demo: 'https://dearme.ai.studio/'
      },
      {
        name: 'MindMitra',
        shortName: 'MindMitra',
        repo: 'https://github.com/MuskaanTimbadiya/MindMitra'
      }
    ];

const links = (data.links && typeof data.links === 'object') ? data.links : {};
const linkedinUrl = links.linkedin || 'https://www.linkedin.com/in/muskaan-timbadiya/';
const portfolioUrl = links.portfolio || 'https://muskaantimbadiya.github.io/';
const email = links.email || 'muskaantimbadiya98@gmail.com';

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

const themedContactBadges = `<div align="center">\n\n[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-247bff?style=for-the-badge&logo=linkedin&logoColor=white)](${linkedinUrl})\n&nbsp;&nbsp;\n[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-ff354f?style=for-the-badge&logo=globe&logoColor=white)](${portfolioUrl})\n&nbsp;&nbsp;\n[![Email](https://img.shields.io/badge/Email-Say_Hi-247bff?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${email})\n\n</div>`;

const replacements = {
  '{{NAME}}': data.name || 'Muskaan Timbadiya',
  '{{HEADLINE}}': data.headline || 'Senior Quality Engineer',
  '{{COMPANY}}': data.company || 'Cognizant Technology Solutions',
  '{{ASSET_VERSION}}': String(data.assetVersion || '1'),
  '{{RIGHT_NOW}}': rightNowList.join(', '),
  '{{FEATURED_PROJECTS_NAMES}}': formatProjectNames(featuredProjects),
  '{{FEATURED_PROJECTS_BADGES}}': formatProjectBadges(featuredProjects),
  '{{FUN_FACTS}}': funFactsList.join('; '),
  '{{CONTACT_BADGES}}': themedContactBadges
};

Object.entries(replacements).forEach(([key, value]) => {
  template = template.split(key).join(value);
});

fs.writeFileSync('README.md', template);
console.log('README.md generated successfully from profile-data.json');
