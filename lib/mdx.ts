import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content/legal');

export function getLegalPost(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    meta: data as { title: string; updatedAt: string; summary?: string },
    content,
  };
}

export function getAllLegalPosts() {
  const files = fs.readdirSync(contentDir);
  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    return { slug, ...getLegalPost(slug).meta };
  });
}

// Helper to extract headings for TOC
export function getHeadings(content: string) {
  // Match lines starting with ## (H2)
  const headingRegex = /^##\s+(.*)$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    // Create a simple id from text: "1. Introduction" -> "1-introduction"
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text });
  }
  
  return headings;
}
