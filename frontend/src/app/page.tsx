'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Article, articlesAPI } from '@/lib/api';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await articlesAPI.getAll();
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-amber-500">Latest Articles</h1>
      
      {articles.length === 0 ? (
        <div className="text-center text-gray-500">
          No articles found!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-blue-300">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>By {article.author}</span>
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}