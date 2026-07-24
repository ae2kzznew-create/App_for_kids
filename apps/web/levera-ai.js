// ---------- AI assistant ----------
const AI_DEFAULTS = { url: "https://open.bigmodel.cn/api/paas/v4/chat/completions", model: "glm-4.5-flash" };
function aiConfig(){
  return {
    url: (localStorage.getItem("levera-ai-url") || "").trim() || AI_DEFAULTS.url,
    model: (localStorage.getItem("levera-ai-model") || "").trim() || AI_DEFAULTS.model,
    key: (localStorage.getItem("levera-ai-key") || "").trim(),
  };
}
function dlgAiSettings(){
  const config = aiConfig();
  openDialog("<h3>⚙️ ИИ-помощник</h3><p style=\"font-size:13px;color:var(--muted);margin:0 0 4px\">По умолчанию — бесплатная GLM-4.5-Flash от Zhipu AI. Зарегистрируйся на bigmodel.cn, создай API-ключ и вставь его сюда. Подойдёт и любой другой OpenAI-совместимый API (DeepSeek, OpenRouter).</p><label>API-ключ</label><input id=\"fKey\" type=\"password\" value=\"" + esc(config.key) + "\" placeholder=\"вставь ключ\"><label>Модель</label><input id=\"fModel\" value=\"" + esc(config.model) + "\"><label>Адрес API</label><input id=\"fUrl\" value=\"" + esc(config.url) + "\">", async (dialog) => {
    localStorage.setItem("levera-ai-key", dialog.querySelector("#fKey").value.trim());
    localStorage.setItem("levera-ai-model", dialog.querySelector("#fModel").value.trim() || AI_DEFAULTS.model);
    localStorage.setItem("levera-ai-url", dialog.querySelector("#fUrl").value.trim() || AI_DEFAULTS.url);
    show("Настройки ИИ сохранены");
  });
}
async function callAi(messages){
  const config = aiConfig();
  if (!config.key) { dlgAiSettings(); throw new Error("Сначала добавь API-ключ"); }
  const body = { model: config.model, messages, temperature: 0.6 };
  let status, text;
  if (window.leveraAI) {
    const response = await window.leveraAI.chat({ url: config.url, apiKey: config.key, body });
    status = response.status; text = response.body;
  } else {
    const response = await fetch(config.url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + config.key }, body: JSON.stringify(body) });
    status = response.status; text = await response.text();
  }
  if (status < 200 || status >= 300) throw new Error("ИИ-сервис ответил ошибкой " + status + ": " + String(text).slice(0, 300));
  const data = JSON.parse(text);
  const content = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error("Пустой ответ модели");
  return content;
}
function extractJson(text){
  const cleaned = String(text).replace(/```json/gi, "```").split("```").map((part) => part.trim()).find((part) => part.startsWith("{")) || String(text);
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Модель ответила не в формате JSON");
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { throw new Error("Модель ответила не в формате JSON"); }
}
const AI_SYSTEM_PROMPT = "Ты — коуч в приложении Levera, которое превращает цели в навыки и квесты. По описанию пользователя составь одну цель, 3–6 навыков и по 1–2 стартовых квеста на каждый навык. Отвечай ТОЛЬКО валидным JSON без пояснений, строго по схеме: {\"goal\":{\"title\":\"...\",\"description\":\"...\"},\"skills\":[{\"title\":\"...\",\"description\":\"...\",\"support_level\":2,\"quests\":[{\"title\":\"...\",\"description\":\"...\",\"xp_reward\":25}]}]}. support_level: 3 — нужна сильная опора, 0 — полностью сам. xp_reward — от 10 до 50 по сложности. Названия короткие и конкретные, на языке пользователя.";
function dlgAiPlan(){
  openDialog("<h3>✨ План с ИИ</h3><label>Опиши, чему хочешь научиться и зачем</label><textarea id=\"fPrompt\" placeholder=\"Например: хочу научиться готовить простые ужины на всю семью за 30 минут\"></textarea>", async (dialog) => {
    const prompt = dialog.querySelector("#fPrompt").value.trim();
    if (!prompt) { show("Опиши цель"); return false; }
    const okButton = dialog.querySelector("[data-ok]");
    okButton.disabled = true;
    const previousLabel = okButton.textContent;
    okButton.textContent = "Думаю…";
    try {
      const answer = await callAi([{ role: "system", content: AI_SYSTEM_PROMPT }, { role: "user", content: prompt }]);
      await createAiPlan(extractJson(answer));
    } finally {
      okButton.disabled = false;
      okButton.textContent = previousLabel;
    }
  });
}
async function createAiPlan(plan){
  if (!plan || !plan.goal || !plan.goal.title || !Array.isArray(plan.skills) || !plan.skills.length) throw new Error("Модель вернула неполный план — попробуй ещё раз");
  const goalId = newId("goal");
  const goalTitle = String(plan.goal.title).trim().slice(0, 120);
  await saveEntity({ id: goalId, type: "goal", title: goalTitle, body: "", fields: { levera_id: goalId, levera_type: "goal", profile_id: "pavel", status: "active", updated: now() } }, goalTitle, String(plan.goal.description || "").trim());
  let skillCount = 0, questCount = 0;
  for (const skill of plan.skills.slice(0, 8)) {
    if (!skill || !skill.title) continue;
    const rawSupport = Math.floor(Number(skill.support_level));
    const support = Number.isFinite(rawSupport) ? Math.max(0, Math.min(3, rawSupport)) : 2;
    const skillId = newId("skill");
    const skillTitle = String(skill.title).trim().slice(0, 120);
    await saveEntity({ id: skillId, type: "skill", title: skillTitle, body: "", fields: { levera_id: skillId, levera_type: "skill", goal_id: goalId, status: "growing", support_level: support, mastery_score: 0, updated: now() } }, skillTitle, String(skill.description || "").trim());
    skillCount += 1;
    for (const quest of (Array.isArray(skill.quests) ? skill.quests : []).slice(0, 3)) {
      if (!quest || !quest.title) continue;
      const rawXp = Math.floor(Number(quest.xp_reward));
      const xp = Number.isFinite(rawXp) ? Math.max(0, Math.min(100000, rawXp)) : 25;
      const questId = newId("quest");
      const questTitle = String(quest.title).trim().slice(0, 120);
      await saveEntity({ id: questId, type: "quest", title: questTitle, body: "", fields: { levera_id: questId, levera_type: "quest", skill_ids: [skillId], status: "active", support_level: support, xp_reward: xp, maintenance: xp === 0, updated: now() } }, questTitle, String(quest.description || "").trim());
      questCount += 1;
    }
  }
  await loadVault();
  state.tab = "goals";
  render();
  show("ИИ создал план: 1 цель, " + skillCount + " навыков, " + questCount + " квестов" + (vault.demo ? " (демо)" : ""));
}
