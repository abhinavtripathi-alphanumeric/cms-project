"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { articlesAPI, type Article } from "@/lib/api";

export default function EditArticle() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = parseInt(params.id as string);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articlesAPI.getById(articleId);
        const articleData = response.data;
        setArticle(articleData);
        setFormData({
          title: articleData.title,
          content: articleData.content,
        });
      } catch (error) {
        console.error("Error fetching article:", error);
        alert("Error loading article");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, router]);

  // Check authentication and authorization
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (article && user && user.username !== article.author) {
      alert("You are not authorized to edit this article");
      router.push(`/articles/${articleId}`);
    }
  }, [isAuthenticated, article, user, router, articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to edit articles");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Updating article with data:", formData);

      const response = await articlesAPI.update(articleId, formData);
      console.log("Article updated successfully:", response.data);

      alert("Article updated successfully!");
      router.push(`/articles/${articleId}`);
    } catch (error: any) {
      console.error("Error updating article:", error);

      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to edit this article.");
        router.push(`/articles/${articleId}`);
      } else {
        alert(
          "Error updating article: " +
            (error.response?.data?.error || error.message)
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading article...</div>
      </div>
    );
  }

  if (!isAuthenticated || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6  text-black">Edit Article</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="Enter article title"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            minLength={10}
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md  text-black"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/articles/${articleId}`)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Article"}
          </button>
        </div>
      </form>
    </div>
  );
}