import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import type { CompletedQuestSummary } from "../../src/domain/repository";
import { buildProgressSummary } from "../../src/domain/progressSummary";
import type { Goal, Skill } from "../../src/domain/types";
import { theme } from "../../src/theme";

export default function ProgressScreen() {
  const { repository, revision } = usePersonalApp();
  const [history, setHistory] = useState<CompletedQuestSummary[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      repository.listCompletedQuests(200),
      repository.listGoals("pavel"),
      repository.listSkillsForProfile("pavel"),
    ])
      .then(([nextHistory, nextGoals, nextSkills]) => {
        if (!active) return;
        setHistory(nextHistory);
        setGoals(nextGoals.filter((goal) => goal.status !== "archived"));
        setSkills(nextSkills);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [repository, revision]));

  const xp = history.reduce((sum, item) => sum + item.xpGranted, 0);
  const growing = skills.filter((skill) => skill.status === "growing").length;
  const bars = useMemo(() => buildSevenDayBars(history), [history]);
  const summary = useMemo(() => buildProgressSummary({ history, goals, skills, now: new Date().toISOString() }), [history, goals, skills]);

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ФАКТЫ, НЕ ОЩУЩЕНИЯ</Text><Text style={styles.title}>Прогресс</Text>
    <View style={styles.stats}><Stat value={xp} label="XP всего" /><Stat value={history.length} label="завершено" /><Stat value={growing} label="навыка растут" /></View>

    <Text style={styles.sectionTitle}>Периоды</Text>
    <View style={styles.periods}>{summary.windows.map((window) => <View key={window.key} style={styles.period}><Text style={styles.periodLabel}>{window.label}</Text><Text style={styles.periodValue}>{window.xp} XP</Text><Text style={styles.periodMeta}>{window.completionCount} действий</Text></View>)}</View>

    <View style={styles.card}><Text style={styles.cardTitle}>Ритм последних 7 дней</Text><Text style={styles.cardSubtitle}>Высота показывает заработанный XP, а не оценку мастерства.</Text><View style={styles.chart}>{bars.map((item) => <View key={item.key} style={styles.barColumn}><View style={[styles.bar, { height: item.height }]} /><Text style={styles.day}>{item.label}</Text></View>)}</View></View>

    {summary.goalRollups.length > 0 ? <><Text style={styles.sectionTitle}>По целям</Text>{summary.goalRollups.map((goal) => <View key={goal.goalId} style={styles.rollup}><View style={styles.rollupBody}><Text style={styles.rollupTitle}>{goal.title}</Text><Text style={styles.rollupMeta}>{goal.skillCount} навыков · {goal.completionCount} действий</Text></View><Text style={styles.rollupXp}>{goal.xp} XP</Text></View>)}</> : null}

    {summary.skillRollups.length > 0 ? <><Text style={styles.sectionTitle}>По навыкам</Text>{summary.skillRollups.map((skill) => <View key={skill.skillId} style={styles.rollup}><View style={styles.rollupBody}><Text style={styles.rollupTitle}>{skill.title}</Text><Text style={styles.rollupMeta}>{skill.completionCount} действий · мастерство {skill.masteryScore}/100</Text></View><Text style={styles.rollupXp}>{skill.xp} XP</Text></View>)}</> : null}

    <Text style={styles.sectionTitle}>Завершённые действия</Text>
    {loading ? <ActivityIndicator color={theme.colors.blue} /> : null}
    {!loading && history.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>История появится после первого квеста</Text><Text style={styles.emptyText}>Здесь будут доказательства, рефлексия и честно заработанный XP.</Text></View> : null}
    {history.slice(0, 20).map((item) => <HistoryCard key={`${item.questId}_${item.completedAt}`} item={item} />)}
  </ScrollView></SafeAreaView>;
}

function Stat({ value, label }: { value: number; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function HistoryCard({ item }: { item: CompletedQuestSummary }) { return <View style={styles.historyCard}><View style={styles.historyTop}><Text style={styles.historyTitle}>{item.title}</Text><Text style={styles.historyXp}>+{item.xpGranted} XP</Text></View><Text style={styles.historyDate}>{formatDate(item.completedAt)}</Text>{item.evidenceNote ? <Text style={styles.historyText}>Доказательство: {item.evidenceNote}</Text> : null}{item.reflection ? <Text style={styles.reflection}>«{item.reflection}»</Text> : null}</View>; }

function buildSevenDayBars(history: CompletedQuestSummary[]) {
  const today = new Date();
  const points = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - (6 - index)); return { date, key: date.toISOString().slice(0, 10), xp: 0 }; });
  for (const item of history) { const key = item.completedAt.slice(0, 10); const point = points.find((candidate) => candidate.key === key); if (point) point.xp += item.xpGranted; }
  const max = Math.max(1, ...points.map((point) => point.xp));
  return points.map((point) => ({ key: point.key, label: new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(point.date).replace(".", ""), height: Math.max(6, Math.round((point.xp / max) * 92)) }));
}
const formatDate = (value: string) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 40, gap: 18 }, eyebrow: { color: theme.colors.green, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: -10 },
  stats: { flexDirection: "row", gap: 10 }, stat: { flex: 1, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 14 }, statValue: { color: theme.colors.text, fontSize: 24, fontWeight: "800" }, statLabel: { color: theme.colors.muted, fontSize: 12, marginTop: 3 },
  sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 6 }, periods: { flexDirection: "row", gap: 8 }, period: { flex: 1, minHeight: 94, backgroundColor: theme.colors.soft, borderRadius: 12, padding: 12 }, periodLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: "700" }, periodValue: { color: theme.colors.text, fontSize: 18, fontWeight: "800", marginTop: 8 }, periodMeta: { color: theme.colors.muted, fontSize: 11, marginTop: 4 },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 18, padding: 18 }, cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700" }, cardSubtitle: { color: theme.colors.muted, lineHeight: 20, marginTop: 6 }, chart: { height: 132, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 22 }, barColumn: { alignItems: "center", gap: 8, width: 30 }, bar: { width: 18, backgroundColor: theme.colors.blue, borderRadius: 5 }, day: { color: theme.colors.muted, fontSize: 11 },
  rollup: { minHeight: 72, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, rollupBody: { flex: 1 }, rollupTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, rollupMeta: { color: theme.colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }, rollupXp: { color: theme.colors.green, fontWeight: "800" },
  historyCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 16 }, historyTop: { flexDirection: "row", gap: 12, justifyContent: "space-between" }, historyTitle: { flex: 1, color: theme.colors.text, fontSize: 16, fontWeight: "700" }, historyXp: { color: theme.colors.green, fontWeight: "800" }, historyDate: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }, historyText: { color: theme.colors.text, lineHeight: 21, marginTop: 10 }, reflection: { color: theme.colors.muted, fontStyle: "italic", lineHeight: 21, marginTop: 8 },
  empty: { backgroundColor: theme.colors.soft, borderRadius: 14, padding: 18 }, emptyTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, emptyText: { color: theme.colors.muted, lineHeight: 21, marginTop: 5 },
});
