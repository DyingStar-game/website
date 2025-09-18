import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface NewsItem {
  slug: string;
  title: string;
  markdown: string;
  content: string;
  date: string;
}

const NEWS_DIR = path.join(process.cwd(), 'news');

function ensureDir() {
  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  }
}

export function getAllNews(): NewsItem[] {
  ensureDir();
  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const filePath = path.join(NEWS_DIR, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const [firstLine, ...rest] = raw.split('\n');
      const title = firstLine.replace(/^#\s*/, '').trim();
      const markdown = rest.join('\n').trim();
      const content = marked.parse(markdown);
      const stat = fs.statSync(filePath);
      return {
        slug: file.replace(/\.md$/, ''),
        title,
        markdown,
        content,
        date: stat.mtime.toISOString(),
      } as NewsItem;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function addNews(title: string, markdown: string, sendToDiscord: boolean) {
  ensureDir();
  const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const slug = `${Date.now()}-${slugBase}`;
  const filePath = path.join(NEWS_DIR, `${slug}.md`);
  const fileContent = `# ${title}\n\n${markdown}\n`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  const html = marked.parse(markdown);
  if (sendToDiscord && process.env.DISCORD_NEWS_WEBHOOK) {
    await fetch(process.env.DISCORD_NEWS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `**${title}**\n${markdown}` }),
    });
  }
  return {
    slug,
    title,
    markdown,
    content: html,
    date: new Date().toISOString(),
  } as NewsItem;
}
