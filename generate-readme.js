// generate-readme.js
// Reads profile-data.json + README.template.md, writes README.md.
// Run via: node generate-readme.js

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('profile-data.json', 'utf8'));
let template = fs.readFileSync('README.template.md', 'utf8');

function urlEncode(str) {
  return encodeURIComponent(str).replace(/%20/g, '%20');
}

function skillIcons(names, extra) {
  const iconMap = {
    'Selenium': 'selenium', 'Java': 'java', 'Node.js': 'nodejs',
    'Python': 'python', 'FastAPI': 'fastapi', 'Docker': 'docker', 'GCP': 'gcp',
    'JavaScript': 'js', 'React': 'react', 'Vite': 'vite', 'SQLite': 'sqlite',
    'Git': 'git', 'GitHub': 'github', 'GitHub Actions': 'githubactions'
  };
  const iconable = names.filter(n => iconMap[n]).map(n => iconMap[n]);
  const badgeOnly = names.filter(n => !iconMap[n]);

  const badgeDefs = {
    'Playwright': 'https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white',
    'Cucumber': 'https://img.shields.io/badge/Cucumber-23D96C?style=flat-square&logo=cucumber&logoColor=white',
    'TestNG': 'https://img.shields.io/badge/TestNG-FF6C37?style=flat-square',
    'REST Assured': 'https://img.shields.io/badge/REST_Assured-6DB33F?style=flat-square',
    'Postman': 'https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white',
    'Google Gemini': 'https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=googlegemini&logoColor=white',
    'Google ADK': 'https://img.shields.io/badge/Google_ADK-4285F4?style=flat-square&logo=google&logoColor=white',
    'MCP': 'https://img.shields.io/badge/MCP-000000?style=flat-square',
    'Anthropic Claude': 'https://img.shields.io/badge/Anthropic_Claude-D97757?style=flat-square&logo=claude&logoColor=white',
    'Allure': 'https://img.shields.io/badge/Allure-brightgreen?style=flat-square',
    'JIRA': 'https://img.shields.io/badge/JIRA-0052CC?style=flat-square&logo=jira&logoColor=white'
  };

  let out = '';
  if (iconable.length) {
    out += `<img src="https://skillicons.dev/icons?i=${iconable.join(',')}&theme=light" />\n`;
  }
  badgeOnly.forEach(n => {
    if (badgeDefs[n]) out += `<img src="${badgeDefs[n]}"/>\n`;
  });
  return out.trim();
}

function projectsTable(projects) {
  let rows = [];
  for (let i = 0; i < projects.length; i += 2) {
    rows.push([projects[i], projects[i + 1]]);
  }
  let out = '<table>\n';
  rows.forEach(pair => {
    out += '<tr>\n';
    pair.forEach(p => {
      out += '<td width="50%" valign="top">\n\n';
      if (p) {
        const titleLine = p.repo
          ? `### ${p.emoji} [${p.name}](${p.repo})`
          : `### ${p.emoji} ${p.name}`;
        out += `${titleLine}\n${p.desc}\n`;

        const tagStr = (p.tags || []).map(t => `\`${t}\``).join(' · ');
        const parts = [];
        if (p.demo) parts.push(`[**Live demo →**](${p.demo})`);
        if (tagStr) parts.push(tagStr);
        if (p.note) parts.push(p.note.match(/not yet public|work in progress/) ? `*(${p.note})*` : p.note);

        if (parts.length) {
          out += `<br/>\n${parts.join(' · ')}\n`;
        }
        out += '\n</td>\n';
      } else {
        out += '</td>\n';
      }
    });
    out += '</tr>\n';
  });
  out += '</table>';
  return out;
}

function achievementsTable(items) {
  return items.map(a => `| ${a.label} | ${a.impact} |`).join('\n');
}

function bulletList(items) {
  return items.map(i => `- ${i}`).join('\n');
}

function typingLines(data) {
  const lines = [
    `${data.yearsExperience}+ years shipping quality software at Cognizant`,
    `Building Playwright & Selenium frameworks that scale`,
    `Prototyping GenAI agents for Indian users 🇮🇳`,
    data.genaiProjects.map(p => p.name).join(' · '),
    `Currently building for FIFA World Cup 2026 ⚽`
  ];
  return lines.map(l => encodeURIComponent(l).replace(/%20/g, '+')).join(';');
}

const replacements = {
  '{{NAME}}': data.name,
  '{{NAME_URL}}': encodeURIComponent(data.name),
  '{{HEADLINE}}': data.headline,
  '{{HEADLINE_URL}}': encodeURIComponent(`${data.headline} · ${data.tagline}`),
  '{{LOCATION}}': data.location,
  '{{YEARS_EXPERIENCE}}': data.yearsExperience,
  '{{PHILOSOPHY}}': data.philosophy,
  '{{GITHUB_URL}}': data.links.github,
  '{{LINKEDIN_URL}}': data.links.linkedin,
  '{{PORTFOLIO_URL}}': data.links.portfolio,
  '{{EMAIL}}': data.links.email,
  '{{TYPING_LINES}}': typingLines(data),
  '{{SKILLS_TESTING}}': skillIcons(data.skills.testing),
  '{{SKILLS_GENAI}}': skillIcons(data.skills.genai),
  '{{SKILLS_CORE}}': skillIcons(data.skills.core),
  '{{GENAI_PROJECTS_TABLE}}': projectsTable(data.genaiProjects),
  '{{QA_PROJECTS_TABLE}}': projectsTable(data.qaProjects),
  '{{ACHIEVEMENTS_TABLE}}': achievementsTable(data.achievements),
  '{{CURRENTLY_BUILDING}}': bulletList(data.currentlyBuilding)
};

Object.entries(replacements).forEach(([key, value]) => {
  template = template.split(key).join(value);
});

fs.writeFileSync('README.md', template);
console.log('README.md generated successfully from profile-data.json');
