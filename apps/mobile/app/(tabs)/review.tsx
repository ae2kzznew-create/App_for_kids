import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import { withRepetitionStatus } from "../../src/domain/repetition";
import type { CompletedQuestSummary } from "../../src/domain/repository";
import type { Skill, WeeklyReview } from "../../src/domain/types";
import { theme } from "../../src/theme";

export default function ReviewScreen() {
  const { repository, service, refresh, revision } = usePersonalApp();
  const [history, setHistory] = useState<CompletedQuestSummary[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [achievements, setAchievements] = useState("");
  const [blockers, setBlockers] = useState("");
  const [decisions, setDecisions] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useFocusEffect(useCallback(() => {
    let active = true;
    Promise.all([repository.listCompletedQuests(200), repository.listSkillsForProfile("pavel"), repository.listWeeklyReviews("pavel", 8)])
      .then(([nextHistory, nextSkills, nextReviews]) => {
        if (!active) return;
        const now = new Date().toISOString();
        setHistory(nextHistory);
        setSkills(nextSkills.map((skill) => withRepetitionStatus(skill, now)));
        setReviews(nextReviews);
      });
    return () => { active = false; };
  }, [repository, revision]));

  const weekFacts = useMemo(() => {
    const threshold = Date.now() - 7 * 86_400_000;
    const recent = history.filter((item) => Date.parse(item.completedAt) >= threshold);
    return { count: recent.length, xp: recent.reduce((sum, item) => sum + item.xpGranted, 0) };
  }, [history]);
  const attention = skills.filter((skill) => skill.status === "due" || skill.status === "fading");

  async function saveReview() {
    if (!decisions.trim() || saving) return;
    setSaving(true); setMessage("");
    try {
      const review = await service.completeWeeklyReview({ profileId: "pavel", displayName: "Pavel", achievements, blockers, decisions });
      setReviews((current) => [review, ...current]); setAchievements(""); setBlockers(""); setDecisions(""); setMessage("Обзор сохранён. Решение на неделю зафиксировано."); refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не удалось сохранить обзор"); }
    finally { setSaving(false); }
  }

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>10 МИНУТ ДЛЯ СЕБЯ</Text><Text style={styles.title}>Обзор недели</Text><Text style={styles.subtitle}>Сначала факты. Потом вывод. В конце — одно решение на следующую неделю.</Text>
    <View style={styles.facts}><Fact value={weekFacts.count} label="действий" /><Fact value={weekFacts.xp} label="XP активности" /><Fact value={attention.length} label="просят внимания" /></View>
    {attention.length > 0 ? <View style={styles.attention}><Text style={styles.attentionTitle}>Навыки для спокойного возвращения</Text><Text style={styles.attentionText}>{attention.map((skill) => skill.title).join(" · ")}</Text></View> : null}

    <ReviewField number="01" title="Что получилось?" hint="Конкретные результаты и доказательства." value={achievements} onChange={setAchievements} />
    <ReviewField number="02" title="Что остановилось?" hint="Неверная сложность, потерянный контекст или внешнее препятствие." value={blockers} onChange={setBlockers} />
    <ReviewField number="03" title="Какой следующий шаг?" hint="Одно решение чуть выше текущего уровня. Обязательное поле." value={decisions} onChange={setDecisions} />
    <Pressable accessibilityRole="button" disabled={!decisions.trim() || saving} onPress={saveReview} style={({ pressed }) => [styles.button, (!decisions.trim() || saving) && styles.buttonDisabled, pressed && styles.pressed]}>{saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Сохранить обзор</Text>}</Pressable>
    {message ? <Text style={styles.message}>{message}</Text> : null}

    {reviews.length > 0 ? <><Text style={styles.sectionTitle}>Предыдущие решения</Text>{reviews.map((review) => <View key={review.id} style={styles.reviewCard}><Text style={styles.reviewDate}>Неделя от {formatDate(review.weekStart)}</Text><Text style={styles.reviewDecision}>{review.decisions}</Text>{review.achievements ? <Text style={styles.reviewMeta}>Получилось: {review.achievements}</Text> : null}{review.blockers ? <Text style={styles.reviewMeta}>Остановилось: {review.blockers}</Text> : null}</View>)}</> : null}
  </ScrollView></SafeAreaView>;
}

function Fact({ value, label }: { value: number; label: string }) { return <View style={styles.fact}><Text style={styles.factValue}>{value}</Text><Text style={styles.factLabel}>{label}</Text></View>; }
function ReviewField({ number, title, hint, value, onChange }: { number: string; title: string; hint: string; value: string; onChange: (value: string) => void }) { return <View style={styles.step}><Text style={styles.number}>{number}</Text><View style={styles.stepBody}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepText}>{hint}</Text><TextInput accessibilityLabel={title} multiline value={value} onChangeText={onChange} placeholder="Запиши наблюдение" placeholderTextColor={theme.colors.muted} style={styles.input} /></View></View>; }
const formatDate = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(`${value}T12:00:00Z`));

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 48 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: 6 }, subtitle: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, marginTop: 8, marginBottom: 24 }, facts: { flexDirection: "row", gap: 8, marginBottom: 16 }, fact: { flex: 1, minHeight: 82, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 11 }, factValue: { color: theme.colors.text, fontSize: 22, fontWeight: "800" }, factLabel: { color: theme.colors.muted, fontSize: 11, lineHeight: 15, marginTop: 4 }, attention: { backgroundColor: theme.colors.orangeSoft, borderRadius: 14, padding: 15, marginBottom: 10 }, attentionTitle: { color: theme.colors.text, fontWeight: "700" }, attentionText: { color: theme.colors.muted, lineHeight: 20, marginTop: 5 }, step: { flexDirection: "row", gap: 12, paddingVertical: 18, borderTopWidth: 1, borderTopColor: theme.colors.border }, number: { color: theme.colors.blue, fontWeight: "800", width: 28 }, stepBody: { flex: 1 }, stepTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, stepText: { color: theme.colors.muted, lineHeight: 20, marginTop: 4 }, input: { minHeight: 92, color: theme.colors.text, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, fontSize: 16, lineHeight: 22, marginTop: 12, textAlignVertical: "top" }, button: { minHeight: 52, backgroundColor: theme.colors.blue, borderRadius: 12, justifyContent: "center", alignItems: "center", marginTop: 16 }, buttonDisabled: { opacity: 0.45 }, pressed: { opacity: 0.75 }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" }, message: { color: theme.colors.green, lineHeight: 20, marginTop: 12 }, sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 30, marginBottom: 10 }, reviewCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 15, marginBottom: 10 }, reviewDate: { color: theme.colors.muted, fontSize: 12 }, reviewDecision: { color: theme.colors.text, fontSize: 16, fontWeight: "700", lineHeight: 22, marginTop: 7 }, reviewMeta: { color: theme.colors.muted, lineHeight: 20, marginTop: 7 } });
