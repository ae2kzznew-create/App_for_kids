import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import { buildMarkdownBundle, buildMarkdownDocuments } from "../../src/domain/markdownExport";
import { useDatabase } from "../../src/storage/DatabaseProvider";
import { type DatabaseHealth, readDatabaseHealth } from "../../src/storage/database";
import { theme } from "../../src/theme";

export default function SettingsScreen() {
  const database = useDatabase();
  const { repository } = usePersonalApp();
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  useFocusEffect(useCallback(() => {
    let active = true;
    readDatabaseHealth(database).then((nextHealth) => { if (active) setHealth(nextHealth); });
    return () => { active = false; };
  }, [database]));

  async function buildExport(share: boolean) {
    setExporting(true); setExportError("");
    try {
      const [goals, skills, quests, reviews] = await Promise.all([
        repository.listGoals("pavel"),
        repository.listSkillsForProfile("pavel"),
        repository.listQuests(),
        repository.listWeeklyReviews("pavel", 52),
      ]);
      const exportQuests = await Promise.all(quests.map(async (quest) => ({ quest, skillIds: (await repository.listQuestSkills(quest.id)).map((link) => link.skillId) })));
      const input = { goals, skills, quests: exportQuests, reviews };
      const documents = buildMarkdownDocuments(input);
      const bundle = buildMarkdownBundle(input);
      setDocumentCount(documents.length); setMarkdown(bundle);
      if (share) await Share.share({ title: "Levera Markdown export", message: bundle });
    } catch (error) { setExportError(error instanceof Error ? error.message : "Не удалось собрать экспорт"); }
    finally { setExporting(false); }
  }

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ВТОРОЙ МОЗГ</Text><Text style={styles.title}>Связи</Text>
    <View style={styles.exportCard}><View style={styles.exportHeader}><View style={styles.icon}><MaterialCommunityIcons name="language-markdown-outline" size={26} color={theme.colors.blue} /></View><View style={styles.body}><Text style={styles.cardTitle}>Markdown export</Text><Text style={styles.cardText}>Цели, навыки, квесты и обзоры становятся отдельными документами со стабильными YAML ID.</Text></View></View>
      <View style={styles.actions}><Pressable disabled={exporting} onPress={() => buildExport(false)} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Собрать</Text></Pressable><Pressable disabled={exporting} onPress={() => buildExport(true)} style={styles.primaryButton}>{exporting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Поделиться</Text>}</Pressable></View>
      {exportError ? <Text style={styles.error}>{exportError}</Text> : null}
      {markdown ? <View style={styles.preview}><Text style={styles.previewTitle}>{documentCount} Markdown-документов готовы</Text><Text selectable numberOfLines={18} style={styles.previewText}>{markdown}</Text></View> : <Text style={styles.exportHint}>Экспорт остаётся локальным, пока ты не выберешь приложение через системное меню.</Text>}
    </View>

    <View style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="cube-outline" size={26} color={theme.colors.muted} /></View><View style={styles.body}><Text style={styles.cardTitle}>Obsidian</Text><Text style={styles.cardText}>Ссылки на заметки и открытие через URI. Двусторонняя синхронизация позже.</Text></View><Text style={styles.later}>Позже</Text></View>
    <Text style={styles.sectionTitle}>Надёжность данных</Text>
    <View style={styles.card}><View style={[styles.icon, health?.persistenceVerified ? styles.verifiedIcon : null]}><MaterialCommunityIcons name={health?.persistenceVerified ? "database-check-outline" : "database-clock-outline"} size={26} color={health?.persistenceVerified ? theme.colors.green : theme.colors.orange} /></View><View style={styles.body}><Text style={styles.cardTitle}>SQLite между запусками</Text>{health ? <><Text style={styles.cardText}>{health.persistenceVerified ? "Предыдущая метка запуска найдена. Локальная база пережила повторный запуск приложения." : "Закрой приложение полностью и открой снова. После следующего запуска здесь появится подтверждение."}</Text><Text style={styles.healthMeta}>Текущий запуск: {formatDate(health.lastSuccessfulStart)}</Text>{health.previousSuccessfulStart ? <Text style={styles.healthMeta}>Предыдущий: {formatDate(health.previousSuccessfulStart)}</Text> : null}</> : <ActivityIndicator color={theme.colors.blue} style={styles.loader} />}</View><Text style={health?.persistenceVerified ? styles.verified : styles.pending}>{health?.persistenceVerified ? "Проверено" : "1 шаг"}</Text></View>
    <View style={styles.note}><Text style={styles.noteTitle}>Локально по умолчанию</Text><Text style={styles.noteText}>Данные остаются на устройстве. Markdown передаётся наружу только после явного нажатия «Поделиться».</Text></View>
  </ScrollView></SafeAreaView>;
}

const formatDate = (value: string) => value ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "нет данных";
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 40, gap: 14 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: -8, marginBottom: 8 }, sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 10 }, card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }, exportCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16 }, exportHeader: { flexDirection: "row", alignItems: "center", gap: 12 }, icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.blueSoft, justifyContent: "center", alignItems: "center" }, verifiedIcon: { backgroundColor: theme.colors.greenSoft }, body: { flex: 1 }, cardTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, cardText: { color: theme.colors.muted, lineHeight: 20, marginTop: 4 }, actions: { flexDirection: "row", gap: 10, marginTop: 16 }, secondaryButton: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: theme.colors.blue, borderRadius: 11, alignItems: "center", justifyContent: "center" }, secondaryButtonText: { color: theme.colors.blue, fontWeight: "800" }, primaryButton: { flex: 1, minHeight: 46, backgroundColor: theme.colors.blue, borderRadius: 11, alignItems: "center", justifyContent: "center" }, primaryButtonText: { color: "#FFFFFF", fontWeight: "800" }, exportHint: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 12 }, preview: { backgroundColor: theme.colors.soft, borderRadius: 12, padding: 12, marginTop: 12 }, previewTitle: { color: theme.colors.text, fontWeight: "800", marginBottom: 8 }, previewText: { color: theme.colors.muted, fontFamily: "monospace", fontSize: 11, lineHeight: 16 }, error: { color: theme.colors.red, marginTop: 10 }, healthMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }, loader: { alignSelf: "flex-start", marginTop: 8 }, later: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 }, pending: { color: theme.colors.orange, fontWeight: "800", fontSize: 12 }, verified: { color: theme.colors.green, fontWeight: "800", fontSize: 12 }, note: { marginTop: 8, backgroundColor: theme.colors.soft, borderRadius: 16, padding: 18 }, noteTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, noteText: { color: theme.colors.muted, lineHeight: 22, marginTop: 6 } });
