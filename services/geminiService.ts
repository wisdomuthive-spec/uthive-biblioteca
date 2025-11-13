import { GoogleGenAI, Type } from "@google/genai";
// Fix: Use the 'Resource' type as 'Book' is not an exported member of '../types'.
import type { Resource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this demo, we'll throw an error if the key is missing.
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

// Fix: Add placeholder content to be used for mock books and Gemini results.
const placeholderContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const getMockResponse = (): Resource[] => ([
    {
      id: -1,
      type: 'book',
      titulo: "Neuromancer (Mock)",
      autor: "William Gibson",
      sinopse: "O romance que definiu o gênero cyberpunk, uma história de hackers e inteligência artificial em um futuro distópico e tecnológico.",
      capaUrl: "https://picsum.photos/seed/neuromancer/200/300",
      borrowedBy: null,
      content: placeholderContent,
      category: "Ficção Científica",
    },
    {
      id: -2,
      type: 'book',
      titulo: "Duna (Mock)",
      autor: "Frank Herbert",
      sinopse: "Uma saga épica de política, religião e poder no deserto planeta de Arrakis, a única fonte da especiaria que prolonga a vida.",
      capaUrl: "https://picsum.photos/seed/dune/200/300",
      borrowedBy: null,
      content: placeholderContent,
      category: "Ficção Científica",
    },
    {
      id: -3,
      type: 'book',
      titulo: "Fundação (Mock)",
      autor: "Isaac Asimov",
      sinopse: "A história da queda de um império galáctico e os esforços de um grupo de cientistas para preservar o conhecimento humano.",
      capaUrl: "https://picsum.photos/seed/foundation/200/300",
      borrowedBy: null,
      content: placeholderContent,
      category: "Ficção Clássica",
    }
]);


export const searchWithGemini = async (query: string): Promise<Resource[]> => {
  if (!API_KEY) {
    // Return a mock response if API key is not available
    return new Promise(resolve => setTimeout(() => resolve(getMockResponse()), 1000));
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `Você é um bibliotecário de uma biblioteca escolar digital. Com base na consulta de pesquisa "${query}", sugira 3 livros. Para cada livro, forneça: título, autor, uma breve sinopse (máximo 40 palavras) e uma URL de capa de livro fictícia usando 'https://picsum.photos/seed/{titulo-sem-espacos}/200/300'. Responda estritamente no formato JSON, seguindo o schema fornecido.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              titulo: {
                type: Type.STRING,
                description: 'O título do livro.',
              },
              autor: {
                type: Type.STRING,
                description: 'O autor do livro.',
              },
              sinopse: {
                type: Type.STRING,
                description: 'Uma sinopse curta do livro.',
              },
              capaUrl: {
                type: Type.STRING,
                description: 'URL para a imagem de capa do livro.',
              },
            },
            required: ["titulo", "autor", "sinopse", "capaUrl"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const rawBooks: Omit<Resource, 'id' | 'borrowedBy' | 'content' | 'type' | 'category'>[] = JSON.parse(jsonString);
    const books: Resource[] = rawBooks.map((book, index) => ({
      ...book,
      id: -(index + 1), // Use a temporary negative ID for suggested books
      type: 'book',
      borrowedBy: null,
      content: placeholderContent,
      category: 'Recomendação de IA'
    }));
    return books;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to mock response on API error
    return getMockResponse();
  }
};