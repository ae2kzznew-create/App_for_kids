import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { demoQuests } from "../../src/data/demo";
import { theme } from "../../src/theme";

export default function TodayScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>СРЕДА, 15 ИЮЛЯ</Text><Text style={styles.title}>Сегодня</Text></View>
          <View style={styles.level}><Text style={styles.levelText}>Ур. 4</Text></View>
        </View>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View><Text style={styles.heroLabel}>Фокус недели</Text><Text style={styles.heroTitle}>Собрать фундамент Levera</Text></View>
            <MaterialCommunityIcons name="arrow-top-right" size={22} color={theme.colors.blue} />
          </View>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <View style={styles.heroMeta}><Text style={styles.metaStrong}>240 XP</Text><Text style={styles.meta}>ещё 60 до уровня</Text></View>
        </View>
        <View style={styles.sectionRow}><Text style={styles.sectionTitle}>Следующие действия</Text><Text style={styles.sectionCount}>{demoQuests.length}</Text></View>
        {demoQuests.map((quest, index) => (
          <Pressable key={quest.id} style={({ pressed }) => [styles.quest, pressed && styles.pressed]}>
            <View style={[styles.questIndex, index === 0 && styles.questIndexActive]}><Text style={[styles.questIndexText, index === 0 && styles.questIndexTextActive]}>{index + 1}</Text></View>
            <View style={styles.questBody}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questDescription}>{quest.description}</Text>
              <View style={styles.questMeta}><Text style={styles.tag}>L{quest.supportLevel}</Text><Text style={styles.xp}>+{quest.xpReward} XP</Text></View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.muted} />
          </Pressable>
        ))}
        <View style={styles.reviewCard}>
          <View style={styles.reviewIcon}><MaterialCommunityIcons name="calendar-week" size={22} color={theme.colors.green} /></View>
          <View style={styles.reviewBody}><Text style={styles.reviewTitle}>Обзор недели</Text><Text style={styles.reviewText}>3 навыка растут · 1 требует повторения</Text></View>
          <Text style={styles.reviewAction}>Открыть</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, eyebrow: { color: theme.colors.muted, fontSize: 12, letterSpacing: 1.2, fontWeight: "700" }, title: { color: theme.colors.text, fontSize: 36, lineHeight: 42, fontWeight: "700", marginTop: 4 },
  level: { backgroundColor: theme.colors.blueSoft, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 }, levelText: { color: theme.colors.blue, fontWeight: "700" },
  hero: { backgroundColor: theme.colors.surface, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 18, gap: 14 }, heroTop: { flexDirection: "row", justifyContent: "space-between" }, heroLabel: { color: theme.colors.muted, fontSize: 13, marginBottom: 5 }, heroTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", maxWidth: 260 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: theme.colors.soft, overflow: "hidden" }, progressFill: { width: "80%", height: "100%", backgroundColor: theme.colors.blue, borderRadius: 4 }, heroMeta: { flexDirection: "row", justifyContent: "space-between" }, metaStrong: { color: theme.colors.text, fontWeight: "700" }, meta: { color: theme.colors.muted },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }, sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700" }, sectionCount: { color: theme.colors.muted, backgroundColor: theme.colors.soft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, fontWeight: "700" },
  quest: { minHeight: 116, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12 }, pressed: { opacity: 0.72 }, questIndex: { width: 34, height: 34, borderRadius: 10, backgroundColor: theme.colors.soft, justifyContent: "center", alignItems: "center" }, questIndexActive: { backgroundColor: theme.colors.blue }, questIndexText: { color: theme.colors.muted, fontWeight: "800" }, questIndexTextActive: { color: "#FFFFFF" },
  questBody: { flex: 1, gap: 5 }, questTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "700" }, questDescription: { color: theme.colors.muted, lineHeight: 20 }, questMeta: { flexDirection: "row", gap: 8, marginTop: 4 }, tag: { color: theme.colors.blue, backgroundColor: theme.colors.blueSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 12, fontWeight: "700" }, xp: { color: theme.colors.green, backgroundColor: theme.colors.greenSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, fontSize: 12, fontWeight: "700" },
  reviewCard: { marginTop: 8, backgroundColor: theme.colors.greenSoft, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }, reviewIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: theme.colors.surface, justifyContent: "center", alignItems: "center" }, reviewBody: { flex: 1 }, reviewTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 16 }, reviewText: { color: theme.colors.muted, marginTop: 3 }, reviewAction: { color: theme.colors.green, fontWeight: "700" }
});
