"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { articlesAPI } from "@/lib/api";

export default function CreateArticle() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please log in to create articles");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from localStorage to verify it exists
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Creating article with data:", formData);
      console.log("Token exists:", !!token);

      const response = await articlesAPI.create(formData);
      console.log("Article created successfully:", response.data);

      router.push("/");
    } catch (error: any) {
      console.error("Error creating article:", error);

      if (error.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else if (error.response?.status === 422) {
        // Handle validation errors
        alert(
          "Validation Error: " +
            (error.response?.data?.error || "Please check your input.")
        );
      } else {
        alert(
          "Error creating article: " +
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

  if (!isAuthenticated || !authChecked) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Create New Article</h1>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
            placeholder="Write your article content here..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
