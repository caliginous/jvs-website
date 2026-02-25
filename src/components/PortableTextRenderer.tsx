'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const src = value?.asset?.url;
      const alt = value?.alt || '';
      if (!src) return null;
      return (
        <figure className="my-6">
          <img src={src} alt={alt} className="w-full h-auto rounded" />
          {value?.caption && (
            <figcaption className="text-sm text-neutral-600 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => (
      <pre className="my-4 overflow-x-auto rounded bg-neutral-900 p-4 text-neutral-100 text-sm">
        <code className={`language-${value?.language || ''}`}>{value?.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold my-2">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-4">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default function PortableTextRenderer({ value }: { value: any[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="prose prose-neutral max-w-none">
      <PortableText value={value} components={components} />
    </div>
  );
}


