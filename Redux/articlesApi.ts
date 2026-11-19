import { api } from "./api";
import type { Block } from "../lib/articles";

export const articlesApi = api.injectEndpoints({
  endpoints: build => ({
    createArticle: build.mutation<{ id: string }, void>({
      query: () => ({ url: "articles", method: "POST", body: { create: true } }),
    }),
    saveArticle: build.mutation<{ id: string }, { id: string; title: string; blocks: Block[]; published: boolean; categoryId: string | null; seoTitle: string; seoDescription: string }>({
      query: body => ({ url: "articles", method: "POST", body }),
    }),
    uploadArticleMedia: build.mutation<{ file: string }, { id: string; file: File }>({
      query: ({ id, file }) => ({
        url: "articles", params: { id }, method: "POST",
        headers: { "Content-Type": file.type }, body: file,
      }),
    }),
  }),
});

export const { useCreateArticleMutation, useSaveArticleMutation, useUploadArticleMediaMutation } = articlesApi;
