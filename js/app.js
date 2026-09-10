/**
 * Main Application UI Manager & Event Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initChatUI();
  initMemoryPanel();
  initKnowledgeExplorer();
  initToolsHub();
  initThemeToggle();
  initApiKeyModal();
});

/**
 * Tab Navigation Switcher
 */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/**
 * Chat UI Event Handlers & Message Rendering
 */
function initChatUI() {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('messages-container');
  const presetChips = document.querySelectorAll('.preset-chip');

  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (!messageText) return;

      chatInput.value = '';
      await sendMessage(messageText);
    });
  }

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.innerText.trim();
      sendMessage(text);
    });
  });
}

async function sendMessage(text) {
  const messagesContainer = document.getElementById('messages-container');

  // Render User Message
  renderUserMessage(text);
  window.studentMemory.addShortTermMessage('user', text);

  // Render Agent Message Container with loading thoughts
  const agentMsgEl = createAgentMessageElement();
  messagesContainer.appendChild(agentMsgEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const thoughtBox = agentMsgEl.querySelector('.thought-steps');
  const textEl = agentMsgEl.querySelector('.message-text');

  // Process through Agent Core
  try {
    const response = await window.studentAgent.processQuery(text, (thoughts) => {
      // Update thought process steps in real time
      if (thoughtBox) {
        thoughtBox.innerHTML = thoughts.map(t => `
          <div class="thought-step">
            <span class="badge">${t.badge}</span>
            <span><strong>${t.title}</strong>: ${t.detail}</span>
          </div>
        `).join('');
      }
    });

    // Set Final Text
    textEl.innerHTML = formatMarkdownText(response.text);

    // If Widget HTML returned by tool
    if (response.widgetHTML) {
      const widgetDiv = document.createElement('div');
      widgetDiv.innerHTML = response.widgetHTML;
      agentMsgEl.querySelector('.message-content').appendChild(widgetDiv);
    }

    // If RAG Sources retrieved
    if (response.sources && response.sources.length > 0) {
      const sourcesDiv = document.createElement('div');
      sourcesDiv.className = 'rag-sources';
      sourcesDiv.innerHTML = '<span style="font-size:0.75rem; color:#9ca3af; width:100%;">📚 RAG Citations:</span>' + 
        response.sources.map(s => `
          <div class="source-chip" onclick="openKBModal('${s.id}')">
            ${s.title} (${s.confidence}% match)
          </div>
        `).join('');
      agentMsgEl.querySelector('.message-content').appendChild(sourcesDiv);
    }

    window.studentMemory.addShortTermMessage('assistant', response.text);
    updateMemoryPanel();
  } catch (err) {
    textEl.innerHTML = `<span style="color:var(--accent-rose);">Error processing request: ${err.message}</span>`;
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function renderUserMessage(text) {
  const container = document.getElementById('messages-container');
  const msg = document.createElement('div');
  msg.className = 'message user';
  msg.innerHTML = `
    <div class="avatar">👤</div>
    <div class="message-content">
      <div class="message-text">${escapeHTML(text)}</div>
    </div>
  `;
  container.appendChild(msg);
}

function createAgentMessageElement() {
  const msg = document.createElement('div');
  msg.className = 'message agent';
  msg.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="message-content">
      <div class="thought-box">
        <div class="thought-header" onclick="toggleThoughtBox(this)">
          ⚙️ <strong>Agent Reasoning & Capabilities</strong> <span style="font-size:0.75rem;">(Click to expand)</span>
        </div>
        <div class="thought-steps">
          <div class="thought-step"><span>Analyzing intent...</span></div>
        </div>
      </div>
      <div class="message-text">Generating response...</div>
    </div>
  `;
  return msg;
}

function toggleThoughtBox(headerEl) {
  const steps = headerEl.nextElementSibling;
  if (steps) {
    steps.style.display = steps.style.display === 'none' ? 'flex' : 'none';
  }
}

/**
 * Memory Panel Updates
 */
function initMemoryPanel() {
  updateMemoryPanel();
}

function updateMemoryPanel() {
  const profileContainer = document.getElementById('sidebar-profile');
  const factsContainer = document.getElementById('sidebar-facts');
  const mem = window.studentMemory;

  if (profileContainer) {
    profileContainer.innerHTML = `
      <div class="profile-avatar">🎓</div>
      <div class="profile-info">
        <h4>${mem.profile.name}</h4>
        <p>${mem.profile.rollNo} | ${mem.profile.department}</p>
        <p>Semester ${mem.profile.semester} (CGPA: ${mem.profile.cgpa})</p>
      </div>
      <div class="tag-list">
        <span class="tag">${mem.profile.quota}</span>
        <span class="tag tag-emerald">${mem.profile.scholarship}</span>
      </div>
    `;
  }

  if (factsContainer) {
    if (mem.longTermFacts.length === 0) {
      factsContainer.innerHTML = '<div style="font-size:0.8rem; color:#9ca3af;">No facts extracted yet.</div>';
    } else {
      factsContainer.innerHTML = mem.longTermFacts.map((fact, index) => `
        <div class="memory-item">
          <span>${fact}</span>
          <span class="delete-mem" onclick="deleteFact(${index})">✕</span>
        </div>
      `).join('');
    }
  }
}

window.deleteFact = function(index) {
  window.studentMemory.removeLongTermFact(index);
  updateMemoryPanel();
};

/**
 * Knowledge Explorer & Drag-and-Drop Uploader
 */
function initKnowledgeExplorer() {
  renderKBList();
  initDropzone();
}

function renderKBList() {
  const kbListEl = document.getElementById('kb-list');
  const kbViewEl = document.getElementById('kb-view');

  if (!kbListEl || !window.COLLEGE_KNOWLEDGE_BASE) return;

  const docs = window.ragEngine.documents;

  kbListEl.innerHTML = docs.map((doc, idx) => `
    <div class="kb-item ${idx === 0 ? 'active' : ''}" onclick="selectKBDoc('${doc.id}', this)">
      <span>📄</span>
      <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${doc.title}</div>
    </div>
  `).join('');

  if (docs.length > 0) {
    selectKBDoc(docs[0].id);
  }
}

window.selectKBDoc = function(docId, element = null) {
  if (element) {
    document.querySelectorAll('.kb-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
  }

  const doc = window.ragEngine.documents.find(d => d.id === docId);
  const kbViewEl = document.getElementById('kb-view');

  if (doc && kbViewEl) {
    kbViewEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <span class="tag">${doc.category}</span>
        <span style="font-size:0.75rem; color:#9ca3af;">ID: ${doc.id}</span>
      </div>
      <h2 style="font-family:var(--font-heading); margin-bottom:12px;">${doc.title}</h2>
      <div class="tag-list" style="margin-bottom:16px;">
        ${doc.tags.map(t => `<span class="tag tag-emerald">#${t}</span>`).join('')}
      </div>
      <div style="line-height:1.7; background:rgba(0,0,0,0.2); padding:16px; border-radius:10px; font-size:0.9rem;">
        ${formatMarkdownText(doc.content)}
      </div>
    `;
  }
};

function initDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');

  if (!dropzone) return;

  dropzone.addEventListener('click', () => fileInput && fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent-cyan)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--accent-primary)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent-primary)';
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }
}

function handleFileUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const textContent = e.target.result;
    const ingested = window.ragEngine.ingestCustomDocument(
      file.name,
      'Custom Student Upload',
      textContent,
      file.name
    );
    renderKBList();
    selectKBDoc(ingested.id);
    alert(`Successfully indexed "${file.name}" into RAG Vector Store!`);
  };
  reader.readAsText(file);
}

/**
 * Tools Hub Handler
 */
function initToolsHub() {
  // Handlers for standalone tool executions from the Tools tab
}

window.runStandaloneTool = function(toolName) {
  let result = null;
  if (toolName === 'exam') {
    const dept = document.getElementById('tool-exam-dept').value;
    const sem = document.getElementById('tool-exam-sem').value;
    result = window.agentTools.checkExamTimetable(dept, sem);
    document.getElementById('tool-exam-result').innerHTML = result.widgetHTML;
  } else if (toolName === 'cgpa') {
    const gradesStr = document.getElementById('tool-cgpa-grades').value;
    result = window.agentTools.calculateCGPA(gradesStr);
    document.getElementById('tool-cgpa-result').innerHTML = result.widgetHTML;
  } else if (toolName === 'faculty') {
    const dept = document.getElementById('tool-fac-dept').value;
    const query = document.getElementById('tool-fac-query').value;
    result = window.agentTools.lookupFaculty(dept, query);
    document.getElementById('tool-fac-result').innerHTML = result.widgetHTML;
  }
};

/**
 * Theme & Modal Controls
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      toggleBtn.innerHTML = next === 'light' ? '🌙' : '☀️';
    });
  }
}

function initApiKeyModal() {
  // Optional key settings
}

/**
 * Markdown & HTML Utilities
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function formatMarkdownText(text) {
  if (!text) return '';
  let formatted = escapeHTML(text);
  
  // Headers
  formatted = formatted.replace(/^### (.*$)/gim, '<h3 style="color:var(--accent-cyan); margin:10px 0 6px;">$1</h3>');
  formatted = formatted.replace(/^## (.*$)/gim, '<h2 style="color:var(--accent-cyan); margin:12px 0 8px;">$1</h2>');
  formatted = formatted.replace(/^# (.*$)/gim, '<h1 style="color:#fff; margin:14px 0 10px;">$1</h1>');
  
  // Bold & Italics
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code block
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bullet lists
  formatted = formatted.replace(/^\- (.*$)/gim, '<li style="margin-left:20px;">$1</li>');
  
  // Line breaks
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
}
