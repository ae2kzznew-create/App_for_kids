import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDatabase } from "../../src/storage/DatabaseProvider";
import { type DatabaseHealth, readDatabaseHealth } from "../../src/storage/database";
import { theme } from "../../src/theme";

export default function SettingsScreen() {
  const database = useDatabase();
  const [health, setHealth] = useState<DatabaseHealth | null>(null);

  useFocusEffect(useCallback(() => {
    let active = true;
    readDatabaseHealth(database).then((nextHealth) => {
      if (active) setHealth(nextHealth);
    });
    return () => { active = false; };
  }, [database]));

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ВТОРОЙ МОЗГ</Text><Text style={styles.title}>Связи</Text>
    <View style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="language-markdown-outline" size={26} color={theme.colors.blue} /></View><View style={styles.body}><Text style={styles.cardTitle}>Markdown</Text><Text style={styles.cardText}>Универсальный формат импорта, экспорта и резервной копии.</Text></View><Text style={styles.status}>MVP</Text></View>
    <View style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="cube-outline" size={26} color={theme.colors.muted} /></View><View style={styles.body}><Text style={styles.cardTitle}>Obsidian</Text><Text style={styles.cardText}>Ссылки на заметки и открытие через URI. Двусторонняя синхронизация позже.</Text></View><Text style={styles.later}>Позже</Text></View>

    <Text style={styles.sectionTitle}>Надёжность данных</Text>
    <View style={styles.card}><View style={[styles.icon, health?.persistenceVerified ? styles.verifiedIcon : null]}><MaterialCommunityIcons name={health?.persistenceVerified ? "database-check-outline" : "database-clock-outline"} size={26} color={health?.persistenceVerified ? theme.colors.green : theme.colors.orange} /></View><View style={styles.body}><Text style={styles.cardTitle}>SQLite между запусками</Text>{health ? <><Text style={styles.cardText}>{health.persistenceVerified ? "Предыдущая метка запуска найдена. Локальная база пережила повторный запуск приложения." : "Закрой приложение полностью и открой снова. После следующего запуска здесь появится подтверждение."}</Text><Text style={styles.healthMeta}>Текущий запуск: {formatDate(health.lastSuccessfulStart)}</Text>{health.previousSuccessfulStart ? <Text style={styles.healthMeta}>Предыдущий: {formatDate(health.previousSuccessfulStart)}</Text> : null}</> : <ActivityIndicator color={theme.colors.blue} style={styles.loader} />}</View><Text style={health?.persistenceVerified ? styles.verified : styles.pending}>{health?.persistenceVerified ? "Проверено" : "1 шаг"}</Text></View>

    <View style={styles.note}><Text style={styles.noteTitle}>Локально по умолчанию</Text><Text style={styles.noteText}>Данные остаются на устройстве. Облако появится только после надёжного локального опыта.</Text></View>
  </ScrollView></SafeAreaView>;
}

const formatDate = (value: string) => value
  ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value))
  : "нет данных";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: 20, paddingBottom: 40, gap: 14 },
  eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: -8, marginBottom: 8 },
  sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 10 },
  card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.blueSoft, justifyContent: "center", alignItems: "center" },
  verifiedIcon: { backgroundColor: theme.colors.greenSoft },
  body: { flex: 1 },
  cardTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" },
  cardText: { color: theme.colors.muted, lineHeight: 20, marginTop: 4 },
  healthMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 5 },
  loader: { alignSelf: "flex-start", marginTop: 8 },
  status: { color: theme.colors.blue, fontWeight: "800", fontSize: 12 },
  later: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 },
  pending: { color: theme.colors.orange, fontWeight: "800", fontSize: 12 },
  verified: { color: theme.colors.green, fontWeight: "800", fontSize: 12 },
  note: { marginTop: 8, backgroundColor: theme.colors.soft, borderRadius: 16, padding: 18 },
  noteTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" },
  noteText: { color: theme.colors.muted, lineHeight: 22, marginTop: 6 },
});
