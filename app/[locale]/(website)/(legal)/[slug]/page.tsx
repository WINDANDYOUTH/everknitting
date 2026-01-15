import { getLegalPost, getHeadings, getAllLegalPosts } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import { FileText, Hash } from 'lucide-react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = getAllLegalPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function LegalPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  
  let post;
  try {
    post = getLegalPost(slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;
  const headings = getHeadings(content);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
      {/* Sidebar Navigation */}
      <aside className="md:w-1/4 sticky top-24 h-fit hidden md:block">
        <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-500">Navigation</h2>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <a 
              key={heading.id} 
              href={`#${heading.id}`} 
              className="flex items-center gap-3 p-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border-l-2 border-transparent hover:border-slate-300"
            >
              <Hash className="w-4 h-4 opacity-50" />
              <span className="truncate">{heading.text}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:w-3/4 prose prose-slate max-w-none prose-headings:scroll-mt-28">
        <header className="mb-10 not-prose border-b pb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{meta.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 font-medium text-sm">
            <span className="flex items-center gap-1.5">
               <FileText className="w-4 h-4" />
               Effective Date: {new Date(meta.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* MDX Content Renderer */}
        <section>
          <MDXRemote 
            source={content} 
            options={{
              mdxOptions: {
                // @ts-ignore - Types compatibility issues between rehype versions commonly occur but runtime is fine
                rehypePlugins: [rehypeSlug],
              }
            }}
          />
        </section>
      </main>
    </div>
  );
}
