import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import type { CompletedQuestSummary } from "../../src/domain/repository";
import type { Goal, Skill } from "../../src/domain/types";
import { theme } from "../../src/theme";

const statusLabel = { growing: "Растёт", stable: "Стабилен", due: "Повторить", fading: "Угасает", paused: "Пауза" } as const;

export default function SkillDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const skillId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { repository, revision } = usePersonalApp();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [history, setHistory] = useState<CompletedQuestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillId) return;
    repository.getSkill(skillId).then(async (nextSkill) => {
      setSkill(nextSkill);
      if (nextSkill) setGoal(await repository.getGoal(nextSkill.goalId));
      setHistory(await repository.listSkillHistory(skillId));
    }).finally(() => setLoading(false));
  }, [repository, revision, skillId]);

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator color={theme.colors.blue} /></SafeAreaView>;
  if (!skill) return <SafeAreaView style={styles.center}><Text style={styles.error}>Навык не найден</Text><Pressable onPress={() => router.back()}><Text style={styles.back}>Вернуться</Text></Pressable></SafeAreaView>;

  const xp = history.reduce((sum, item) => sum + item.xpGranted, 0);
  return <SafeAreaView style={styles.safe} edges={["top", "bottom"]}><ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={() => router.back()}><Text style={styles.back}>← Навыки</Text></Pressable>
    <Text style={styles.eyebrow}>{goal?.title.toUpperCase() ?? "ЛИЧНЫЙ ПУТЬ"}</Text><Text style={styles.title}>{skill.title}</Text>
    <View style={styles.badges}><Text style={styles.badge}>L{skill.supportLevel}</Text><Text style={styles.badge}>{statusLabel[skill.status]}</Text></View>
    <View style={styles.mastery}><View style={styles.masteryTop}><Text style={styles.masteryLabel}>Проверенное мастерство</Text><Text style={styles.masteryValue}>{skill.masteryScore}/100</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${skill.masteryScore}%` }]} /></View><Text style={styles.masteryNote}>Квесты дают доказательства. Значение меняется только после обзора.</Text></View>
    <View style={styles.stats}><View><Text style={styles.statValue}>{history.length}</Text><Text style={styles.statLabel}>выполнений</Text></View><View><Text style={styles.statValue}>{xp}</Text><Text style={styles.statLabel}>XP активности</Text></View></View>
    <Text style={styles.section}>История навыка</Text>
    {history.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Доказательств пока нет</Text><Text style={styles.emptyText}>Заверши связанный квест, чтобы история начала расти.</Text></View> : history.map((item) => <View key={`${item.questId}_${item.completedAt}`} style={styles.item}><View style={styles.itemTop}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.itemXp}>+{item.xpGranted}</Text></View><Text style={styles.date}>{new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(item.completedAt))}</Text>{item.evidenceNote ? <Text style={styles.evidence}>{item.evidenceNote}</Text> : null}{item.reflection ? <Text style={styles.reflection}>«{item.reflection}»</Text> : null}</View>)}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.canvas }, center: { flex: 1, backgroundColor: theme.colors.canvas, alignItems: "center", justifyContent: "center", gap: 14 }, content: { padding: 20, paddingBottom: 42 }, back: { color: theme.colors.blue, fontSize: 16, fontWeight: "700", paddingVertical: 10, marginBottom: 20 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, lineHeight: 40, fontWeight: "700", marginTop: 7 }, badges: { flexDirection: "row", gap: 8, marginTop: 14 }, badge: { color: theme.colors.blue, backgroundColor: theme.colors.blueSoft, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontWeight: "800" }, mastery: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 18, marginTop: 22 }, masteryTop: { flexDirection: "row", justifyContent: "space-between" }, masteryLabel: { color: theme.colors.text, fontWeight: "700" }, masteryValue: { color: theme.colors.text, fontWeight: "800" }, track: { height: 7, backgroundColor: theme.colors.soft, borderRadius: 4, overflow: "hidden", marginTop: 13 }, fill: { height: "100%", backgroundColor: theme.colors.blue, borderRadius: 4 }, masteryNote: { color: theme.colors.muted, lineHeight: 20, marginTop: 10 }, stats: { flexDirection: "row", gap: 12, marginTop: 12 }, statValue: { color: theme.colors.text, fontSize: 24, fontWeight: "800" }, statLabel: { color: theme.colors.muted, marginTop: 2 }, section: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 28, marginBottom: 12 }, item: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 16, marginBottom: 10 }, itemTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 }, itemTitle: { flex: 1, color: theme.colors.text, fontSize: 16, fontWeight: "700" }, itemXp: { color: theme.colors.green, fontWeight: "800" }, date: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }, evidence: { color: theme.colors.text, lineHeight: 21, marginTop: 10 }, reflection: { color: theme.colors.muted, fontStyle: "italic", lineHeight: 21, marginTop: 8 }, empty: { backgroundColor: theme.colors.soft, borderRadius: 14, padding: 18 }, emptyTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, emptyText: { color: theme.colors.muted, lineHeight: 21, marginTop: 5 }, error: { color: theme.colors.red, fontSize: 20, fontWeight: "700" } });
