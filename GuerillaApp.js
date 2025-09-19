document.addEventListener('DOMContentLoaded', () => {
    let state = {
        userName: null,
        activeTimers: [],
        dailyLog: { date: new Date().toISOString().slice(0, 10), totalSeconds: 0 },
        history: [],
        canvasData: {}
    };
    
    // DOM Elements
    const nameModal = document.getElementById('name-modal');
    const nameForm = document.getElementById('name-form');
    const nameInput = document.getElementById('name-input');
    const appContainer = document.getElementById('app-container');
    const greeting = document.getElementById('greeting');
    const avatar = document.getElementById('avatar');
    const dailyTotalTimeElement = document.getElementById('daily-total-time');
    const activeTimersContainer = document.getElementById('active-timers-container');
    const completedTimersContainer = document.getElementById('completed-timers-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.view-content');
    const historyTableBody = document.getElementById('history-table-body');
    const aiAnalysisModal = document.getElementById('ai-analysis-modal');
    const aiResponseContainer = document.getElementById('ai-response-container');
    const analiseIaButton = document.getElementById('analise-ia-button');
    const closeAiModal = document.getElementById('close-ai-modal');
    const addToHistoryButton = document.getElementById('add-to-history-button');
    const clearButton = document.getElementById('clear-button');
    const exportCsvButton = document.getElementById('export-csv-button');
    const clearHistoryButton = document.getElementById('clear-history-button');
    const startTimerButton = document.getElementById('start-timer-button');
    const timerDescriptionInput = document.getElementById('timer-description');
    const fabAddTimer = document.getElementById('fab-add-timer');
    const generateAtivacaoButton = document.getElementById('generate-ativacao-button');
    const generatePlanoButton = document.getElementById('generate-plano-button');
    const generateMissaoButton = document.getElementById('generate-missao-button');

    const canvasInputIds = ['materia', 'topico', 'desafio_organizacional', 'objetivo_sessao', 'ativacao', 'energia', 'obstaculo', 'plano_anti_obstaculo', 'aula_notas', 'repertorio_insights', 'missao_pratica', 'descoberta', 'feedback_cognos', 'sintese_final'];
    
    let mainInterval;

    function initApp() {
        loadState();
        if (state.userName) {
            showApp();
        } else {
            nameModal.classList.remove('hidden');
        }
    }
    
    function showApp() {
        nameModal.classList.add('hidden');
        appContainer.classList.remove('hidden');
        appContainer.classList.add('flex');
        updateUserUI();
        renderAll();
        if (state.activeTimers.some(t => t.status === 'running')) {
            startMainInterval();
        }
    }

    function updateUserUI() {
        if (state.userName) {
            greeting.textContent = `Olá, ${state.userName}`;
            avatar.textContent = state.userName.charAt(0).toUpperCase();
        }
    }

    function loadState() {
        state.userName = localStorage.getItem('guerillaUserName');
        state.activeTimers = JSON.parse(localStorage.getItem('guerillaActiveTimers') || '[]');
        state.history = JSON.parse(localStorage.getItem('guerillaHistory') || '[]');
        state.canvasData = JSON.parse(localStorage.getItem('guerillaCanvasData') || '{}');
        const today = new Date().toISOString().slice(0, 10);
        const savedLog = JSON.parse(localStorage.getItem('guerillaDailyLog'));
        if (savedLog && savedLog.date === today) {
            state.dailyLog = savedLog;
        } else {
            state.dailyLog = { date: today, totalSeconds: 0 };
            calculateDailyTotalFromHistory();
        }
    }

    function saveState() {
        if(state.userName) localStorage.setItem('guerillaUserName', state.userName);
        localStorage.setItem('guerillaActiveTimers', JSON.stringify(state.activeTimers));
        localStorage.setItem('guerillaHistory', JSON.stringify(state.history));
        localStorage.setItem('guerillaDailyLog', JSON.stringify(state.dailyLog));
        localStorage.setItem('guerillaCanvasData', JSON.stringify(state.canvasData));
    }
    
    function renderAll() {
        renderDashboard();
        renderHistory();
        renderCanvas();
    }

    function renderDashboard() {
        renderActiveTimers();
        renderCompletedTimersToday();
        renderDailyTotal();
    }

    function renderActiveTimers() {
        activeTimersContainer.innerHTML = '';
         if (state.activeTimers.length === 0) {
            activeTimersContainer.innerHTML = `<p class="text-center text-gray-500 text-sm">Nenhuma sessão de foco ativa. Inicie uma nova no Diário de Estudo.</p>`;
        } else {
            state.activeTimers.forEach(timer => {
                const isPaused = timer.status === 'paused';
                const timerCard = document.createElement('div');
                timerCard.className = `p-4 rounded-xl flex items-center justify-between ${isPaused ? 'bg-gray-700' : 'bg-gray-800'}`;
                const elapsedTime = calculateElapsedTime(timer);
                timerCard.innerHTML = `
                    <div><p class="font-semibold text-white">${timer.description}</p><p class="text-2xl font-bold text-gray-300 timer-display">${formatTime(elapsedTime)}</p></div>
                    <div class="flex items-center gap-3">
                        <button data-id="${timer.id}" class="pause-resume-btn w-12 h-12 flex items-center justify-center bg-gray-600 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="display: ${isPaused ? 'none' : 'block'};"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="display: ${isPaused ? 'block' : 'none'};"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                        </button>
                        <button data-id="${timer.id}" class="stop-btn w-12 h-12 flex items-center justify-center bg-red-500 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                        </button>
                    </div>`;
                activeTimersContainer.appendChild(timerCard);
            });
        }
    }

    function renderCompletedTimersToday() {
        const today = new Date().toISOString().slice(0, 10);
        const completedToday = state.history.filter(entry => entry.entryType === 'timer' && entry.timestamp.startsWith(today));
        completedTimersContainer.innerHTML = '';
         if (completedToday.length === 0) {
            completedTimersContainer.innerHTML = `<p class="text-center text-gray-500 text-sm">Nenhuma sessão concluída hoje.</p>`;
        } else {
            completedToday.forEach(timer => {
                 const timerCard = document.createElement('div');
                timerCard.className = `p-4 rounded-xl flex items-center justify-between bg-gray-800/50`;
                timerCard.innerHTML = `
                    <p class="font-semibold text-gray-300">${timer.description}</p>
                    <p class="text-lg font-bold text-gray-400">${formatTime(timer.durationSeconds)}</p>
                `;
                completedTimersContainer.appendChild(timerCard);
            });
        }
    }

    function renderDailyTotal() {
        dailyTotalTimeElement.textContent = formatTime(state.dailyLog.totalSeconds);
    }

    function renderHistory() {
         historyTableBody.innerHTML = '';
        if (state.history.length > 0) {
            state.history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .forEach(entry => {
                const row = document.createElement('tr');
                const type = entry.entryType === 'timer' ? 'Sessão de Foco' : 'Diário de Estudo';
                const description = entry.entryType === 'timer' ? entry.description : entry.topico;
                const duration = entry.durationSeconds ? formatTime(entry.durationSeconds) : '-';
                row.className = "border-b border-gray-700";
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm">${new Date(entry.timestamp).toLocaleString('pt-BR')}</td>
                    <td class="px-6 py-4 text-sm">${type}</td>
                    <td class="px-6 py-4 text-sm">${description || ''}</td>
                    <td class="px-6 py-4 text-sm">${duration}</td>`;
                historyTableBody.appendChild(row);
            });
        }
    }

     function renderCanvas() {
        canvasInputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = state.canvasData[id] || '';
        });
    }

    function startNewTimer(description) {
        const newTimer = { id: Date.now(), description, startTime: new Date().toISOString(), status: 'running', totalPausedSeconds: 0, lastPauseTime: null, elapsedSecondsWhenPaused: 0 };
        state.activeTimers.push(newTimer);
        saveState();
        renderTimers();
        startMainInterval();
    }

     function togglePauseResume(timerId) {
        const timer = state.activeTimers.find(t => t.id === timerId);
        if (!timer) return;
        if (timer.status === 'running') {
            timer.status = 'paused';
            timer.lastPauseTime = new Date().toISOString();
            timer.elapsedSecondsWhenPaused = calculateElapsedTime(timer);
        } else {
            timer.status = 'running';
            const pauseEnd = new Date().getTime();
            const pauseStart = new Date(timer.lastPauseTime).getTime();
            timer.totalPausedSeconds += Math.round((pauseEnd - pauseStart) / 1000);
            timer.lastPauseTime = null;
        }
        saveState();
        renderTimers();
    }

     function stopTimer(timerId) {
        const timerIndex = state.activeTimers.findIndex(t => t.id === timerId);
        if (timerIndex === -1) return;
        const timer = state.activeTimers[timerIndex];
        const finalDuration = calculateElapsedTime(timer);
        state.dailyLog.totalSeconds += finalDuration;
        
        const historyEntry = {
            entryType: 'timer',
            timestamp: new Date().toISOString(),
            description: timer.description,
            startTime: timer.startTime,
            endTime: new Date().toISOString(),
            durationSeconds: finalDuration
        };
        state.history.push(historyEntry);
        
        state.activeTimers.splice(timerIndex, 1);
        saveState();
        renderAll();
    }

    function calculateElapsedTime(timer) {
        if (timer.status === 'paused') return timer.elapsedSecondsWhenPaused;
        const start = new Date(timer.startTime).getTime();
        const now = new Date().getTime();
        return Math.floor((now - start) / 1000) - timer.totalPausedSeconds;
    }

     function calculateDailyTotalFromHistory() {
        const today = new Date().toISOString().slice(0, 10);
        state.dailyLog.totalSeconds = state.history
            .filter(entry => entry.entryType === 'timer' && entry.timestamp.startsWith(today))
            .reduce((total, entry) => total + (entry.durationSeconds || 0), 0);
    }

    function saveCanvas() {
         canvasInputIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) state.canvasData[id] = el.value;
        });
        saveState();
    }

    function addCanvasToHistory() {
        saveCanvas();
        if (!state.canvasData.materia || !state.canvasData.topico) {
            alert('Preencha pelo menos "Matéria" e "Tópico" para salvar no histórico.');
            return;
        }
        const historyEntry = {
            entryType: 'canvas',
            timestamp: new Date().toISOString(),
            ...state.canvasData
        };
        state.history.push(historyEntry);
        saveState();
        renderHistory();
        alert('Diário salvo no histórico com sucesso!');
    }

    function updateTimerDisplays() {
        document.querySelectorAll('.timer-display').forEach(display => {
            const card = display.closest('.rounded-xl');
            if(!card) return;
            const timerId = parseInt(card.querySelector('button').dataset.id);
            const timer = state.activeTimers.find(t => t.id === timerId);
            if (timer && timer.status === 'running') {
                display.textContent = formatTime(calculateElapsedTime(timer));
            }
        });
    }

    function startMainInterval() {
        if (!mainInterval) mainInterval = setInterval(updateTimerDisplays, 1000);
    }
    
    function navigateTo(viewId) {
        views.forEach(view => view.classList.add('hidden'));
        document.getElementById(`${viewId}-view`).classList.remove('hidden');
        navLinks.forEach(link => {
            if (link.dataset.view === viewId) {
                link.classList.add('bg-indigo-600', 'text-white');
            } else {
                link.classList.remove('bg-indigo-600', 'text-white');
            }
        });
    }

    function jsonToCsv(jsonData) {
        const allHeaders = new Set(['entryType', 'timestamp', 'description', 'startTime', 'endTime', 'durationSeconds', ...canvasInputIds]);
        const headers = Array.from(allHeaders);
        const csvRows = [headers.join(',')];
        jsonData.forEach(entry => {
            const values = headers.map(header => {
                const value = entry[header] !== undefined ? entry[header] : '';
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        });
        return csvRows.join('\n');
    }

    // --- AI INTEGRATION & MODAL FUNCTIONS ---

    async function callGemini(payload, buttonElement) {
        const originalButtonContent = buttonElement ? buttonElement.innerHTML : null;
        if (buttonElement) {
            buttonElement.innerHTML = `<div class="mini-loader"></div>`;
            buttonElement.disabled = true;
        }
        
        if (!apiKey) {
            alert("Chave de API do Google não encontrada. Por favor, adicione a sua chave no ficheiro script.js.");
            if(buttonElement) {
                buttonElement.innerHTML = originalButtonContent;
                buttonElement.disabled = false;
            }
            return null;
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
            const result = await response.json();
            if (!result.candidates || !result.candidates[0].content.parts[0].text) {
                throw new Error("Resposta da API inválida ou vazia.");
            }
            return result.candidates[0].content.parts[0].text;
        } finally {
            if (buttonElement) {
                buttonElement.innerHTML = originalButtonContent;
                buttonElement.disabled = false;
            }
        }
    }

    function formatIaResponse(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
            .replace(/(\n\s*-\s|\n\s*\*\s)/g, '</li><li class="list-disc ml-5 mb-2">')
            .replace(/^(\📊|\🏆|\💡|\🧠|\🚀|\📈)(.*)$/gm, (match, emoji, rest) => `<h3 class="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-3">${emoji} ${rest.trim()}</h3>`)
            .replace(/<\/li>/, '')
            .replace(/<li/, '<ul class="pl-5 text-gray-300"><li');
    }

    async function analyzeWithAI() {
        if (state.history.length === 0) {
            alert('Precisa de ter pelo menos uma entrada no histórico para o Mentor G.E.M. poder analisar.');
            return;
        }
        
        aiResponseContainer.innerHTML = '<div class="loader-container flex justify-center py-8"><div class="loader"></div></div>';
        aiAnalysisModal.classList.remove('hidden');
        
        const csvData = jsonToCsv(state.history);
        const GEMINI_PROMPT = `
# PERSONA
Você é o "Mentor G.E.M.", um estrategista de aprendizagem de longo prazo. Sua personalidade é a de um coach de alta performance: analítico, encorajador e focado em otimizar o *processo*. Você entende o framework de estudo do aluno: Aula -> Repertório -> Missão Prática com "Cognos" -> Registro no Guerilla -> Análise do Mentor G.E.M.
# OBJETIVO
Analisar o histórico completo de estudos (CSV) para identificar padrões de longo prazo e fornecer insights estratégicos.
# PROCESSO
1.  **Análise de Padrões e Hábitos:** Analise consistência, energia e obstáculos.
2.  **Análise de Trajetória:** Compare sessões recentes com antigas. O aluno está a evoluir?
3.  **Análise do Delta Cognitivo:** Compare 'descoberta', 'feedback_cognos' e 'sintese_final'.
4.  **Geração de Insights:** Prepare a sua resposta no formato obrigatório.
# FORMATO DA RESPOSTA (OBRIGATÓRIO)
---
Olá! Sou o seu Mentor G.E.M. e analisei a sua trajetória. Aqui está a sua análise estratégica:
📊 **Análise de Padrões e Hábitos:** [Comente sobre consistência, horários e energia.]
📈 **Sua Trajetória de Aprendizagem:** [Compare sessões, destaque progresso.]
🧠 **Análise do seu Framework (O "Delta Cognitivo"):** [Foque na última sessão. Analise a relação entre descoberta, feedback do Cognos e síntese.]
🏆 **Seus Pontos Fortes Estratégicos:** [Elogie 2-3 pontos fortes do PROCESSO de aprender.]
💡 **Oportunidades de Otimização do Framework:** [Sugira 1-2 melhorias no PROCESSO.]
🚀 **Próxima Fronteira e Ação Principal:** [Termine com uma visão de futuro e uma sugestão clara.]
---`;
        const userQuery = `Por favor, analise os seguintes dados do meu histórico de estudo e forneça os seus insights como Mentor G.E.M.:\n\n${csvData}`;
        const payload = { contents: [{ parts: [{ text: userQuery }] }], systemInstruction: { parts: [{ text: GEMINI_PROMPT }] } };

        try {
            const analysisText = await callGemini(payload);
            aiResponseContainer.innerHTML = formatIaResponse(analysisText);
        } catch (error) {
            aiResponseContainer.innerHTML = `<div class="text-center text-red-500"><h3 class="font-bold">Ocorreu um erro</h3><p>${error.message}</p></div>`;
        }
    }

    async function generateAtivacao() {
        const topico = document.getElementById('topico').value;
        if (!topico) {
            alert('Por favor, preencha o campo "Tópico Central" primeiro.');
            return;
        }
        const prompt = `Aja como um professor universitário. O tópico da aula é "${topico}". Gere uma única "Pergunta-Chave" para um aluno focar. Responda apenas com a pergunta.`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const suggestion = await callGemini(payload, generateAtivacaoButton);
            if(suggestion) document.getElementById('ativacao').value = suggestion.trim();
        } catch (error) {
            alert(`Erro ao gerar sugestão: ${error.message}`);
        }
    }

    async function generateMissao() {
        const materia = document.getElementById('materia').value;
        const topico = document.getElementById('topico').value;
        if (!materia || !topico) {
            alert('Por favor, preencha os campos "Matéria" e "Tópico" primeiro.');
            return;
        }
        const prompt = `Aja como um mentor de estudos práticos. Para a matéria "${materia}" e o tópico "${topico}", sugira uma "Missão Prática" de 25-45 minutos.`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const suggestion = await callGemini(payload, generateMissaoButton);
            if(suggestion) document.getElementById('missao_pratica').value = suggestion.trim();
        } catch (error) {
            alert(`Erro ao gerar sugestão: ${error.message}`);
        }
    }

    async function generatePlano() {
        const obstaculo = document.getElementById('obstaculo').value;
        if (!obstaculo) {
            alert('Por favor, descreva o seu "Principal Obstáculo" primeiro.');
            return;
        }
        const prompt = `Aja como um coach de produtividade. Um estudante enfrenta o obstáculo: "${obstaculo}". Sugira um "Plano Anti-Obstáculo" acionável em 1-2 frases.`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const suggestion = await callGemini(payload, generatePlanoButton);
            if(suggestion) document.getElementById('plano_anti_obstaculo').value = suggestion.trim();
        } catch (error) {
            alert(`Erro ao gerar sugestão: ${error.message}`);
        }
    }

    // Event Listeners
    nameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (name) { state.userName = name; saveState(); showApp(); }
    });

    fabAddTimer.addEventListener('click', () => {
        navigateTo('diario');
        document.getElementById('timer-description').focus();
    });

    startTimerButton.addEventListener('click', () => {
        const description = document.getElementById('timer-description').value.trim();
        if (description) {
            startNewTimer(description);
            document.getElementById('timer-description').value = '';
        } else {
            alert('Por favor, insira uma descrição para a tarefa de foco.');
        }
    });

    activeTimersContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const timerId = parseInt(button.dataset.id);
        if (button.classList.contains('pause-resume-btn')) togglePauseResume(timerId);
        else if (button.classList.contains('stop-btn')) {
            if (confirm("Tem a certeza que deseja parar esta sessão?")) stopTimer(timerId);
        }
    });
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.view);
        });
    });

    clearButton.addEventListener('click', () => {
        if(confirm("Limpar os campos do diário?")){
            canvasInputIds.forEach(id => {
                const el = document.getElementById(id);
                if(el) el.value = '';
            });
            state.canvasData = {};
            saveState();
        }
    });
    
    addToHistoryButton.addEventListener('click', addCanvasToHistory);
    
    analiseIaButton.addEventListener('click', analyzeWithAI);
    closeAiModal.addEventListener('click', () => aiAnalysisModal.classList.add('hidden'));

    exportCsvButton.addEventListener('click', () => {
        if (state.history.length === 0) {
            alert('Não há histórico para exportar.');
            return;
        }
        const csvString = jsonToCsv(state.history);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `historico_guerilla_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    clearHistoryButton.addEventListener('click', () => {
        if(confirm("Limpar todo o histórico?")){
            state.history = [];
            state.activeTimers = [];
            state.dailyLog = { date: new Date().toISOString().slice(0, 10), totalSeconds: 0 };
            saveState();
            renderAll();
        }
    });

    generateAtivacaoButton.addEventListener('click', generateAtivacao);
    generatePlanoButton.addEventListener('click', generatePlano);
    generateMissaoButton.addEventListener('click', generateMissao);
    
    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    initApp();
});

