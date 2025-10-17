'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Article, articlesAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ArticleDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const articleId = parseInt(params.id as string);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articlesAPI.getById(articleId);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setIsDeleting(true);
    try {
      await articlesAPI.delete(articleId);
      router.push('/');
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Article not found</div>
      </div>
    );
  }

  const isAuthor = user?.username === article.author;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-blue-700">{article.title}</h1>
          
          <div className="flex justify-between items-center mb-6 text-gray-600">
            <div>
              <span className="font-semibold">By {article.author}</span>
            </div>
            <div className="text-sm">
              <div>Created: {new Date(article.created_at).toLocaleDateString()}</div>
              {article.updated_at !== article.created_at && (
                <div>Updated: {new Date(article.updated_at).toLocaleDateString()}</div>
              )}
            </div>
          </div>

          {isAuthor && (
            <div className="mb-6 flex space-x-4">
              <button
                onClick={() => router.push(`/articles/edit/${article.id}`)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-7 whitespace-pre-wrap">
              {article.content}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}