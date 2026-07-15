import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import type { Goal, Skill } from "../../src/domain/types";
import { theme } from "../../src/theme";

const statusLabel = { growing: "Растёт", stable: "Стабилен", due: "Повторить", fading: "Угасает", paused: "Пауза" } as const;
const statusColor = { growing: theme.colors.blue, stable: theme.colors.green, due: theme.colors.orange, fading: theme.colors.red, paused: theme.colors.muted } as const;

export default function SkillsScreen() {
  const router = useRouter();
  const { repository, revision } = usePersonalApp();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    let active = true;
    Promise.all([repository.listGoals("pavel"), repository.listSkillsForProfile("pavel")])
      .then(([nextGoals, nextSkills]) => { if (active) { setGoals(nextGoals.filter((goal) => goal.status !== "archived")); setSkills(nextSkills); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [repository, revision]));

  const rootTitle = goals[0]?.title ?? "Твой первый путь";

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ЛИЧНАЯ КАРТА РОСТА</Text><Text style={styles.title}>Древо навыков</Text><Text style={styles.subtitle}>Каждый навык хранит свой уровень, состояние и доказательства роста.</Text>
    <View style={styles.rootNode}><Text style={styles.rootTitle}>{rootTitle}</Text><Text style={styles.rootMeta}>{skills.length} активных навыка</Text></View><View style={styles.connector} />
    {loading ? <ActivityIndicator color={theme.colors.blue} style={styles.loader} /> : null}
    {!loading && skills.length === 0 ? <Pressable onPress={() => router.push("/setup")} style={styles.empty}><Text style={styles.emptyTitle}>Навыков пока нет</Text><Text style={styles.emptyText}>Создай первый путь, чтобы увидеть его здесь.</Text></Pressable> : null}
    {skills.map((skill, index) => <View key={skill.id}><Pressable onPress={() => router.push({ pathname: "/skill/[id]", params: { id: skill.id } })} style={({ pressed }) => [styles.node, pressed && styles.pressed]}><View style={[styles.statusDot, { backgroundColor: statusColor[skill.status] }]} /><View style={styles.nodeBody}><Text style={styles.nodeTitle}>{skill.title}</Text><View style={styles.nodeMeta}><Text style={styles.level}>L{skill.supportLevel}</Text><Text style={[styles.status, { color: statusColor[skill.status] }]}>{statusLabel[skill.status]}</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${skill.masteryScore}%` }]} /></View></View><Text style={styles.score}>{skill.masteryScore}</Text></Pressable>{index < skills.length - 1 && <View style={styles.smallConnector} />}</View>)}
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 40 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: 6 }, subtitle: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, marginTop: 8, marginBottom: 24 },
  rootNode: { backgroundColor: theme.colors.text, borderRadius: 16, padding: 18 }, rootTitle: { color: "#FFFFFF", fontSize: 19, fontWeight: "700" }, rootMeta: { color: "rgba(255,255,255,.65)", marginTop: 5 }, connector: { height: 24, width: 2, backgroundColor: theme.colors.border, alignSelf: "center" }, smallConnector: { height: 12, width: 2, backgroundColor: theme.colors.border, marginLeft: 27 }, loader: { marginVertical: 30 },
  node: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }, pressed: { opacity: 0.72 }, statusDot: { width: 12, height: 12, borderRadius: 6 }, nodeBody: { flex: 1 }, nodeTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, nodeMeta: { flexDirection: "row", gap: 8, marginTop: 5, marginBottom: 9 }, level: { color: theme.colors.muted, fontSize: 12, fontWeight: "700" }, status: { fontSize: 12, fontWeight: "700" }, track: { height: 5, backgroundColor: theme.colors.soft, borderRadius: 3, overflow: "hidden" }, fill: { height: "100%", backgroundColor: theme.colors.blue, borderRadius: 3 }, score: { color: theme.colors.text, fontSize: 17, fontWeight: "800", width: 34, textAlign: "right" },
  empty: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 18 }, emptyTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, emptyText: { color: theme.colors.muted, marginTop: 5, lineHeight: 21 },
});
