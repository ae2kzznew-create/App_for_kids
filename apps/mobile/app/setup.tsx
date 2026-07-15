import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SupportLevel } from "../src/domain/types";
import { usePersonalApp } from "../src/application/PersonalAppProvider";
import { theme } from "../src/theme";

const levels: Array<{ value: SupportLevel; title: string; hint: string }> = [
  { value: 3, title: "L3", hint: "Подробно" },
  { value: 2, title: "L2", hint: "Чеклист" },
  { value: 1, title: "L1", hint: "Результат" },
  { value: 0, title: "L0", hint: "Сам" },
];

export default function SetupScreen() {
  const router = useRouter();
  const { service, refresh } = usePersonalApp();
  const [goalTitle, setGoalTitle] = useState("");
  const [skillTitle, setSkillTitle] = useState("");
  const [questTitle, setQuestTitle] = useState("");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const goal = await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: goalTitle });
      const skill = await service.createSkill({ goalId: goal.id, title: skillTitle, supportLevel });
      await service.createQuest({ title: questTitle, skillIds: [skill.id], supportLevel, xpReward: 10 });
      refresh();
      router.replace("/(tabs)");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить путь");
    } finally {
      setSaving(false);
    }
  };

  const ready = goalTitle.trim() && skillTitle.trim() && questTitle.trim();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} accessibilityRole="button"><Text style={styles.back}>← Назад</Text></Pressable>
          <Text style={styles.eyebrow}>ПЕРВЫЙ ПУТЬ</Text>
          <Text style={styles.title}>Из намерения — в действие</Text>
          <Text style={styles.subtitle}>Сначала цель. Затем навык. Потом один конкретный квест.</Text>

          <Field number="01" label="Цель" value={goalTitle} onChangeText={setGoalTitle} placeholder="Например: создать Levera" />
          <Field number="02" label="Навык" value={skillTitle} onChangeText={setSkillTitle} placeholder="Например: React Native" />
          <Field number="03" label="Первый квест" value={questTitle} onChangeText={setQuestTitle} placeholder="Например: собрать форму цели" />

          <View style={styles.block}>
            <Text style={styles.blockLabel}>Уровень поддержки</Text>
            <View style={styles.levels}>
              {levels.map((level) => (
                <Pressable key={level.value} onPress={() => setSupportLevel(level.value)} style={[styles.level, supportLevel === level.value && styles.levelActive]}>
                  <Text style={[styles.levelTitle, supportLevel === level.value && styles.levelTitleActive]}>{level.title}</Text>
                  <Text style={[styles.levelHint, supportLevel === level.value && styles.levelHintActive]}>{level.hint}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable disabled={!ready || saving} onPress={save} style={({ pressed }) => [styles.button, (!ready || saving) && styles.buttonDisabled, pressed && ready && styles.buttonPressed]}>
            <Text style={styles.buttonText}>{saving ? "Сохраняю…" : "Создать путь"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ number, label, value, onChangeText, placeholder }: { number: string; label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.block}>
      <View style={styles.fieldHeader}><Text style={styles.number}>{number}</Text><Text style={styles.blockLabel}>{label}</Text></View>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.colors.muted} style={styles.input} maxLength={120} returnKeyType="next" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 40 },
  back: { color: theme.colors.blue, fontSize: 16, fontWeight: "700", paddingVertical: 10, marginBottom: 18 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1.1 }, title: { color: theme.colors.text, fontSize: 34, lineHeight: 40, fontWeight: "700", marginTop: 6 }, subtitle: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, marginTop: 10, marginBottom: 26 },
  block: { marginBottom: 20 }, fieldHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }, number: { color: theme.colors.blue, fontSize: 13, fontWeight: "800" }, blockLabel: { color: theme.colors.text, fontSize: 15, fontWeight: "700", marginBottom: 8 },
  input: { minHeight: 54, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 16, color: theme.colors.text, fontSize: 16 },
  levels: { flexDirection: "row", gap: 8 }, level: { flex: 1, minHeight: 68, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center" }, levelActive: { backgroundColor: theme.colors.blue, borderColor: theme.colors.blue }, levelTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 15 }, levelTitleActive: { color: "#FFFFFF" }, levelHint: { color: theme.colors.muted, fontSize: 11, marginTop: 3 }, levelHintActive: { color: "rgba(255,255,255,.78)" },
  error: { color: theme.colors.red, backgroundColor: "#FCE9E7", borderRadius: 10, padding: 12, marginBottom: 14, lineHeight: 20 }, button: { minHeight: 54, borderRadius: 12, backgroundColor: theme.colors.blue, alignItems: "center", justifyContent: "center", marginTop: 4 }, buttonDisabled: { opacity: 0.38 }, buttonPressed: { opacity: 0.78 }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
