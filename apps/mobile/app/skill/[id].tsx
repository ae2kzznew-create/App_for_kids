import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import type { CompletedQuestSummary } from "../../src/domain/repository";
import type { Goal, Skill, SupportLevel } from "../../src/domain/types";
import { theme } from "../../src/theme";

const statusLabel = { growing: "Растёт", stable: "Стабилен", due: "Повторить", fading: "Угасает", paused: "Пауза" } as const;
const supportLabels: Record<SupportLevel, string> = { 3: "L3 · Ведут за руку", 2: "L2 · С подсказками", 1: "L1 · Самостоятельно", 0: "L0 · Могу обучить" };

export default function SkillDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const skillId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { repository, service, refresh, revision } = usePersonalApp();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [history, setHistory] = useState<CompletedQuestSummary[]>([]);
  const [masteryDraft, setMasteryDraft] = useState(0);
  const [supportDraft, setSupportDraft] = useState<SupportLevel>(2);
  const [reviewNote, setReviewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillId) return;
    repository.getSkill(skillId).then(async (nextSkill) => {
      setSkill(nextSkill);
      if (nextSkill) { setGoal(await repository.getGoal(nextSkill.goalId)); setMasteryDraft(nextSkill.masteryScore); setSupportDraft(nextSkill.supportLevel); }
      setHistory(await repository.listSkillHistory(skillId));
    }).finally(() => setLoading(false));
  }, [repository, revision, skillId]);

  async function saveReview() {
    if (!skill || !reviewNote.trim() || saving) return;
    setSaving(true); setMessage("");
    try {
      const updated = await service.reviewSkill({ skillId: skill.id, masteryScore: masteryDraft, supportLevel: supportDraft, note: reviewNote });
      setSkill(updated); setReviewNote(""); setMessage("Проверенная оценка сохранена без начисления XP."); refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не удалось сохранить оценку"); }
    finally { setSaving(false); }
  }

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator color={theme.colors.blue} /></SafeAreaView>;
  if (!skill) return <SafeAreaView style={styles.center}><Text style={styles.error}>Навык не найден</Text><Pressable onPress={() => router.back()}><Text style={styles.back}>Вернуться</Text></Pressable></SafeAreaView>;

  const xp = history.reduce((sum, item) => sum + item.xpGranted, 0);
  const changed = masteryDraft !== skill.masteryScore || supportDraft !== skill.supportLevel;
  return <SafeAreaView style={styles.safe} edges={["top", "bottom"]}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Pressable onPress={() => router.back()}><Text style={styles.back}>← Навыки</Text></Pressable>
    <Text style={styles.eyebrow}>{goal?.title.toUpperCase() ?? "ЛИЧНЫЙ ПУТЬ"}</Text><Text style={styles.title}>{skill.title}</Text>
    <View style={styles.badges}><Text style={styles.badge}>L{skill.supportLevel}</Text><Text style={styles.badge}>{statusLabel[skill.status]}</Text></View>
    <View style={styles.mastery}><View style={styles.masteryTop}><Text style={styles.masteryLabel}>Проверенное мастерство</Text><Text style={styles.masteryValue}>{skill.masteryScore}/100</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${skill.masteryScore}%` }]} /></View><Text style={styles.masteryNote}>Квесты дают доказательства. Значение меняется только после явной проверки.</Text></View>

    <View style={styles.reviewCard}>
      <Text style={styles.reviewTitle}>Проверить навык</Text><Text style={styles.reviewText}>Измени оценку только по доказательствам. Эта операция не даёт XP.</Text>
      <View style={styles.scoreRow}><Pressable accessibilityLabel="Уменьшить мастерство" onPress={() => setMasteryDraft((value) => Math.max(0, value - 5))} style={styles.scoreButton}><Text style={styles.scoreButtonText}>−5</Text></Pressable><Text style={styles.scoreValue}>{masteryDraft}/100</Text><Pressable accessibilityLabel="Увеличить мастерство" onPress={() => setMasteryDraft((value) => Math.min(100, value + 5))} style={styles.scoreButton}><Text style={styles.scoreButtonText}>+5</Text></Pressable></View>
      <Text style={styles.fieldLabel}>Уровень поддержки</Text><View style={styles.levels}>{([3, 2, 1, 0] as SupportLevel[]).map((level) => <Pressable key={level} onPress={() => setSupportDraft(level)} style={[styles.level, supportDraft === level && styles.levelActive]}><Text style={[styles.levelText, supportDraft === level && styles.levelTextActive]}>{supportLabels[level]}</Text></Pressable>)}</View>
      <Text style={styles.fieldLabel}>Основание решения</Text><TextInput accessibilityLabel="Основание решения" multiline maxLength={500} value={reviewNote} onChangeText={setReviewNote} placeholder="Какое доказательство изменило оценку?" placeholderTextColor={theme.colors.muted} style={styles.input} />
      <Pressable accessibilityRole="button" disabled={!changed || !reviewNote.trim() || saving} onPress={saveReview} style={[styles.saveButton, (!changed || !reviewNote.trim() || saving) && styles.disabled]}>{saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.saveText}>Сохранить проверку</Text>}</Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>

    <View style={styles.stats}><View><Text style={styles.statValue}>{history.length}</Text><Text style={styles.statLabel}>выполнений</Text></View><View><Text style={styles.statValue}>{xp}</Text><Text style={styles.statLabel}>XP активности</Text></View></View>
    <Text style={styles.section}>История навыка</Text>
    {history.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Доказательств пока нет</Text><Text style={styles.emptyText}>Заверши связанный квест, чтобы история начала расти.</Text></View> : history.map((item) => <View key={`${item.questId}_${item.completedAt}`} style={styles.item}><View style={styles.itemTop}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.itemXp}>+{item.xpGranted}</Text></View><Text style={styles.date}>{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(item.completedAt))}</Text>{item.evidenceNote ? <Text style={styles.evidence}>{item.evidenceNote}</Text> : null}{item.reflection ? <Text style={styles.reflection}>«{item.reflection}»</Text> : null}</View>)}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.canvas }, center: { flex: 1, backgroundColor: theme.colors.canvas, alignItems: "center", justifyContent: "center", gap: 14 }, content: { padding: 20, paddingBottom: 42 }, back: { color: theme.colors.blue, fontSize: 16, fontWeight: "700", paddingVertical: 10, marginBottom: 20 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, lineHeight: 40, fontWeight: "700", marginTop: 7 }, badges: { flexDirection: "row", gap: 8, marginTop: 14 }, badge: { color: theme.colors.blue, backgroundColor: theme.colors.blueSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontWeight: "800" }, mastery: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 18, marginTop: 22 }, masteryTop: { flexDirection: "row", justifyContent: "space-between" }, masteryLabel: { color: theme.colors.text, fontWeight: "700" }, masteryValue: { color: theme.colors.text, fontWeight: "800" }, track: { height: 7, backgroundColor: theme.colors.soft, borderRadius: 4, overflow: "hidden", marginTop: 13 }, fill: { height: "100%", backgroundColor: theme.colors.blue, borderRadius: 4 }, masteryNote: { color: theme.colors.muted, lineHeight: 20, marginTop: 10 }, reviewCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 18, marginTop: 12 }, reviewTitle: { color: theme.colors.text, fontSize: 19, fontWeight: "800" }, reviewText: { color: theme.colors.muted, lineHeight: 20, marginTop: 5 }, scoreRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 18 }, scoreButton: { minWidth: 58, minHeight: 44, borderRadius: 10, backgroundColor: theme.colors.blueSoft, alignItems: "center", justifyContent: "center" }, scoreButtonText: { color: theme.colors.blue, fontSize: 17, fontWeight: "800" }, scoreValue: { color: theme.colors.text, minWidth: 72, textAlign: "center", fontSize: 20, fontWeight: "800" }, fieldLabel: { color: theme.colors.text, fontWeight: "700", marginTop: 18, marginBottom: 8 }, levels: { gap: 7 }, level: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }, levelActive: { borderColor: theme.colors.blue, backgroundColor: theme.colors.blueSoft }, levelText: { color: theme.colors.muted, fontWeight: "600" }, levelTextActive: { color: theme.colors.blue, fontWeight: "800" }, input: { minHeight: 90, color: theme.colors.text, backgroundColor: theme.colors.canvas, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, fontSize: 15, lineHeight: 21, textAlignVertical: "top" }, saveButton: { minHeight: 50, borderRadius: 12, backgroundColor: theme.colors.blue, alignItems: "center", justifyContent: "center", marginTop: 14 }, disabled: { opacity: 0.45 }, saveText: { color: "#FFFFFF", fontWeight: "800" }, message: { color: theme.colors.green, lineHeight: 20, marginTop: 10 }, stats: { flexDirection: "row", gap: 28, marginTop: 18 }, statValue: { color: theme.colors.text, fontSize: 24, fontWeight: "800" }, statLabel: { color: theme.colors.muted, marginTop: 2 }, section: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 28, marginBottom: 12 }, item: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }, itemTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 }, itemTitle: { flex: 1, color: theme.colors.text, fontSize: 16, fontWeight: "700" }, itemXp: { color: theme.colors.green, fontWeight: "800" }, date: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }, evidence: { color: theme.colors.text, lineHeight: 21, marginTop: 10 }, reflection: { color: theme.colors.muted, fontStyle: "italic", lineHeight: 21, marginTop: 8 }, empty: { backgroundColor: theme.colors.soft, borderRadius: 14, padding: 18 }, emptyTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, emptyText: { color: theme.colors.muted, lineHeight: 21, marginTop: 5 }, error: { color: theme.colors.red, fontSize: 20, fontWeight: "700" } });
