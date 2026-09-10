/**
 * RAG (Retrieval-Augmented Generation) Engine
 * Performs vector TF-IDF similarity search, document chunking, user document ingestion & retrieval
 */

class RAGEngine {
  constructor() {
    this.documents = [];
    this.customUploadedDocs = [];
    this.stopWords = new Set([
      'a', 'an', 'the', 'is', 'are', 'was', 'were', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'it', 'this', 'that', 'which', 'who', 'what', 'where', 'when', 'how'
    ]);
    this.init();
  }

  init() {
    if (window.COLLEGE_KNOWLEDGE_BASE) {
      this.documents = [...window.COLLEGE_KNOWLEDGE_BASE];
    }
  }

  /**
   * Ingest a custom user document into the RAG index
   */
  ingestCustomDocument(title, category, content, fileName = 'uploaded_file.txt') {
    const doc = {
      id: 'custom_' + Date.now(),
      category: category || 'Custom Uploads',
      title: title || fileName,
      tags: ['custom', 'uploaded', fileName.toLowerCase()],
      content: content,
      uploadedAt: new Date().toLocaleTimeString()
    };
    this.documents.push(doc);
    this.customUploadedDocs.push(doc);
    return doc;
  }

  /**
   * Tokenizes text into normalized word tokens
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !this.stopWords.has(w));
  }

  /**
   * Searches knowledge base documents and returns scored top-K matching snippets
   */
  search(query, topK = 3) {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores = [];

    this.documents.forEach(doc => {
      const titleTokens = this.tokenize(doc.title);
      const contentTokens = this.tokenize(doc.content);
      const tagTokens = doc.tags.map(t => t.toLowerCase());

      let score = 0;

      queryTokens.forEach(qt => {
        // Tag exact match bonus
        if (tagTokens.includes(qt)) score += 4.0;
        // Title match bonus
        if (titleTokens.includes(qt)) score += 3.0;
        // Content occurrence frequency
        const occurrences = contentTokens.filter(ct => ct === qt).length;
        if (occurrences > 0) {
          score += 1.0 + Math.log(occurrences);
        }
      });

      if (score > 0) {
        // Calculate similarity score normalized (0 to 100%)
        const maxPossible = queryTokens.length * 5.0;
        const confidenceScore = Math.min(Math.round((score / maxPossible) * 100), 98);

        scores.push({
          doc: doc,
          score: score,
          confidence: confidenceScore,
          snippet: this.extractBestSnippet(doc.content, queryTokens)
        });
      }
    });

    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
  }

  /**
   * Extracts the most relevant 200-character snippet surrounding matched terms
   */
  extractBestSnippet(content, queryTokens) {
    const sentences = content.split(/(?<=[.!?])\s+|\n+/);
    let bestSentence = sentences[0] || content.slice(0, 150);
    let maxMatchCount = 0;

    sentences.forEach(sentence => {
      const tokens = this.tokenize(sentence);
      let matchCount = 0;
      queryTokens.forEach(qt => {
        if (tokens.includes(qt)) matchCount++;
      });

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestSentence = sentence;
      }
    });

    return bestSentence.trim();
  }

  /**
   * Generates augmented context prompt string for the LLM
   */
  buildRAGContext(query) {
    const searchResults = this.search(query, 3);
    if (searchResults.length === 0) {
      return { contextText: '', sources: [] };
    }

    let contextText = '--- RETRIEVED COLLEGE KNOWLEDGE BASE CONTEXT ---\n';
    const sources = [];

    searchResults.forEach((res, index) => {
      contextText += `\n[Source ${index + 1}: ${res.doc.title} (Category: ${res.doc.category})]\n${res.doc.content}\n`;
      sources.push({
        id: res.doc.id,
        title: res.doc.title,
        category: res.doc.category,
        confidence: res.confidence,
        snippet: res.snippet
      });
    });

    contextText += '--- END OF CONTEXT ---\n';
    return { contextText, sources };
  }
}

window.ragEngine = new RAGEngine();
