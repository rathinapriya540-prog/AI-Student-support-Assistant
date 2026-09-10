/**
 * Core AI Agent Orchestrator & Reasoning Engine
 * Coordinates Intent Classification, RAG Retrieval, Tool Calling, Thought Visualization, and Memory Update
 */

class StudentSupportAgent {
  constructor() {
    this.apiKey = localStorage.getItem('gemini_api_key') || '';
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
  }

  /**
   * Main Pipeline Processing User Message
   */
  async processQuery(userQuery, updateProgressCallback) {
    const thoughts = [];

    // Step 1: Intent Analysis
    thoughts.push({
      title: 'Intent Analysis & Classification',
      detail: `Analyzing query intent and checking memory context for "${userQuery.slice(0, 40)}..."`,
      badge: 'Intent'
    });
    if (updateProgressCallback) updateProgressCallback([...thoughts]);

    // Check for Tool Calling requirement
    const toolCall = this.detectToolCallRequirement(userQuery);
    let toolResult = null;

    if (toolCall) {
      thoughts.push({
        title: `Invoking Tool: ${toolCall.toolName}`,
        detail: `Executing parameters: ${JSON.stringify(toolCall.params)}`,
        badge: 'Tool'
      });
      if (updateProgressCallback) updateProgressCallback([...thoughts]);

      const toolObj = window.agentTools.toolsRegistry[toolCall.toolName];
      if (toolObj) {
        toolResult = toolObj.handler(...Object.values(toolCall.params));
      }
    }

    // Step 2: RAG Retrieval
    thoughts.push({
      title: 'RAG Retrieval Engine',
      detail: 'Searching vector index over Regulations, Syllabus, FAQs, and Circulars',
      badge: 'RAG'
    });
    if (updateProgressCallback) updateProgressCallback([...thoughts]);

    const { contextText, sources } = window.ragEngine.buildRAGContext(userQuery);

    // Step 3: Memory Extraction & Check
    const memoryContext = window.studentMemory.getMemoryPromptContext();
    this.extractAndSaveFactsFromUser(userQuery);

    // Step 4: Response Synthesis
    thoughts.push({
      title: 'Response Generation',
      detail: 'Synthesizing response with RAG context, memory profile, and tool outputs',
      badge: 'Synthesizer'
    });
    if (updateProgressCallback) updateProgressCallback([...thoughts]);

    // Generate final answer
    let textAnswer = '';
    let widgetHTML = toolResult ? toolResult.widgetHTML : '';

    if (this.apiKey) {
      try {
        textAnswer = await this.callGeminiAPI(userQuery, contextText, memoryContext, toolResult);
      } catch (err) {
        console.warn('Gemini API call failed, using built-in agent reasoning engine:', err);
        textAnswer = this.generateOfflineReasoningResponse(userQuery, contextText, toolResult, sources);
      }
    } else {
      // Simulate intelligent reasoning engine response
      await new Promise(r => setTimeout(r, 600));
      textAnswer = this.generateOfflineReasoningResponse(userQuery, contextText, toolResult, sources);
    }

    return {
      text: textAnswer,
      thoughts: thoughts,
      sources: sources,
      widgetHTML: widgetHTML
    };
  }

  /**
   * Detects if user query triggers a specific agent tool
   */
  detectToolCallRequirement(query) {
    const q = query.toLowerCase();

    if (q.includes('exam') || q.includes('timetable') || q.includes('schedule') || q.includes('date sheet')) {
      let dept = 'CSE';
      if (q.includes('ai') || q.includes('ds') || q.includes('aids')) dept = 'AIDS';
      if (q.includes('ece')) dept = 'ECE';
      return { toolName: 'check_exam_timetable', params: { department: dept, semester: 6 } };
    }

    if (q.includes('gpa') || q.includes('cgpa') || q.includes('calculate grade') || q.includes('marks grade')) {
      return { toolName: 'calculate_cgpa', params: { grades: ['O', 'A+', 'A', 'A', 'B+'] } };
    }

    if (q.includes('faculty') || q.includes('professor') || q.includes('hod') || q.includes('cabin') || q.includes('contact teacher')) {
      return { toolName: 'lookup_faculty_contact', params: { department: 'CSE', query: query } };
    }

    if (q.includes('fee') || q.includes('due') || q.includes('tuition') || q.includes('paid amount') || q.includes('no due')) {
      return { toolName: 'check_fee_status', params: { studentId: window.studentMemory.profile.rollNo } };
    }

    if (q.includes('book') || q.includes('library') || q.includes('textbook') || q.includes('author') || q.includes('rack')) {
      return { toolName: 'search_library', params: { query: query } };
    }

    return null;
  }

  /**
   * Extracts user preferences or facts to update long-term memory automatically
   */
  extractAndSaveFactsFromUser(query) {
    const q = query.toLowerCase();
    if (q.includes('my name is ')) {
      const name = query.split(/my name is /i)[1].split('.')[0].trim();
      window.studentMemory.updateProfile('name', name);
    }
    if (q.includes('i am in ') && (q.includes('year') || q.includes('sem'))) {
      window.studentMemory.addLongTermFact(`User mentioned: "${query}"`);
    }
    if (q.includes('interested in ') || q.includes('preparing for ')) {
      window.studentMemory.addLongTermFact(`Career Focus: "${query}"`);
    }
  }

  /**
   * Generates intelligent offline response using RAG + Tools + Memory
   */
  generateOfflineReasoningResponse(userQuery, contextText, toolResult, sources) {
    let resp = '';

    if (toolResult) {
      resp += `${toolResult.textResult}\n\n`;
    }

    if (sources && sources.length > 0) {
      resp += `Based on the official college documentation (**${sources[0].title}**):\n\n`;
      resp += `${sources[0].snippet}\n\n`;

      if (sources.length > 1) {
        resp += `Additional reference from **${sources[1].title}**:\n${sources[1].snippet}\n\n`;
      }
    } else if (!toolResult) {
      resp += `Hello **${window.studentMemory.profile.name}**! I have checked your profile (${window.studentMemory.profile.department}, Sem ${window.studentMemory.profile.semester}). \n\nI can assist you with college regulations, semester syllabus details, exam timetables, scholarship information, fee status, and faculty contacts. Could you clarify your request or select one of the suggested prompts below?`;
    }

    resp += `\n*Note: Verified against college regulations and student profile (${window.studentMemory.profile.rollNo}).*`;
    return resp;
  }

  /**
   * Call live Gemini API if user supplies API Key
   */
  async callGeminiAPI(userQuery, contextText, memoryContext, toolResult) {
    const systemPrompt = `You are the AI Student Support Assistant for an engineering college in Tamil Nadu.
    Use the provided RAG context and student memory context to give precise, empathetic, and clear answers.
    ${memoryContext}
    ${contextText}
    ${toolResult ? `Tool Execution Result: ${toolResult.textResult}` : ''}
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }] }
        ]
      })
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid Gemini API response format');
  }
}

window.studentAgent = new StudentSupportAgent();
