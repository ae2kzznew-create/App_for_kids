import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../src/application/PersonalAppProvider";
import type { Goal, SupportLevel } from "../src/domain/types";
import { theme } from "../src/theme";

const levels: Array<{ value: SupportLevel; title: string; hint: string }> = [
  { value: 3, title: "L3", hint: "Подробно" },
  { value: 2, title: "L2", hint: "Чеклист" },
  { value: 1, title: "L1", hint: "Результат" },
  { value: 0, title: "L0", hint: "Сам" },
];

export default function SetupScreen() {
  const router = useRouter();
  const { repository, revision, service, refresh } = usePersonalApp();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [goalTitle, setGoalTitle] = useState("");
  const [skillTitle, setSkillTitle] = useState("");
  const [questTitle, setQuestTitle] = useState("");
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(2);
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setGoalsLoading(true);
      repository
        .listGoals("pavel")
        .then((items) => {
          if (!active) return;
          const activeGoals = items.filter((goal) => goal.status !== "archived");
          setGoals(activeGoals);
          setSelectedGoalId((current) => (current && activeGoals.some((goal) => goal.id === current) ? current : null));
        })
        .finally(() => {
          if (active) setGoalsLoading(false);
        });
      return () => {
        active = false;
      };
    }, [repository, revision]),
  );

  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? null;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const goalId = selectedGoal
        ? selectedGoal.id
        : (await service.createGoal({ profileId: "pavel", displayName: "Pavel", title: goalTitle })).id;
      const skill = await service.createSkill({ goalId, title: skillTitle, supportLevel });
      await service.createQuest({ title: questTitle, skillIds: [skill.id], supportLevel, xpReward: maintenance ? 0 : 10 });
      refresh();
      router.replace("/(tabs)");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить путь");
    } finally {
      setSaving(false);
    }
  };

  const ready = (selectedGoal || goalTitle.trim()) && skillTitle.trim() && questTitle.trim();
  const skillStep = selectedGoal ? "01" : "02";
  const questStep = selectedGoal ? "02" : "03";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} accessibilityRole="button">
            <Text style={styles.back}>← Назад</Text>
          </Pressable>
          <Text style={styles.eyebrow}>БЫСТРЫЙ ПУТЬ</Text>
          <Text style={styles.title}>Из намерения — в действие</Text>
          <Text style={styles.subtitle}>Можно начать новую цель или добавить следующий навык и квест в уже существующую.</Text>

          {goalsLoading ? (
            <View style={styles.goalLoading}>
              <ActivityIndicator size="small" color={theme.colors.blue} />
              <Text style={styles.goalLoadingText}>Загружаю активные цели…</Text>
            </View>
          ) : goals.length > 0 ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Куда добавить навык</Text>
              <View style={styles.goalModes}>
                <Pressable onPress={() => setSelectedGoalId(null)} style={[styles.goalChip, !selectedGoal && styles.goalChipActive]}>
                  <Text style={[styles.goalChipText, !selectedGoal && styles.goalChipTextActive]}>Новая цель</Text>
                </Pressable>
                {goals.map((goal) => (
                  <Pressable key={goal.id} onPress={() => setSelectedGoalId(goal.id)} style={[styles.goalChip, selectedGoal?.id === goal.id && styles.goalChipActive]}>
                    <Text style={[styles.goalChipText, selectedGoal?.id === goal.id && styles.goalChipTextActive]} numberOfLines={1}>
                      {goal.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.goalHint}>
                {selectedGoal ? "Новый навык и квест будут добавлены в выбранную цель." : "Выбери новую цель, если начинаешь отдельный трек."}
              </Text>
            </View>
          ) : null}

          {selectedGoal ? (
            <View style={styles.selectedGoalCard}>
              <Text style={styles.selectedGoalLabel}>Текущая цель</Text>
              <Text style={styles.selectedGoalTitle}>{selectedGoal.title}</Text>
              <Text style={styles.selectedGoalText}>Навык и квест привяжутся к этой цели без создания дубля.</Text>
            </View>
          ) : (
            <Field number="01" label="Цель" value={goalTitle} onChangeText={setGoalTitle} placeholder="Например: создать Levera" />
          )}

          <Field number={skillStep} label="Навык" value={skillTitle} onChangeText={setSkillTitle} placeholder="Например: React Native" />
          <Field number={questStep} label="Первый квест" value={questTitle} onChangeText={setQuestTitle} placeholder="Например: собрать форму цели" />

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

          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: maintenance }}
            onPress={() => setMaintenance((value) => !value)}
            style={[styles.maintenance, maintenance && styles.maintenanceActive]}
          >
            <View style={styles.maintenanceBody}>
              <Text style={styles.maintenanceTitle}>Режим поддержания</Text>
              <Text style={styles.maintenanceText}>Практика сохраняет форму, но не начисляет XP. Мастерство по-прежнему меняется только после проверки.</Text>
            </View>
            <View style={[styles.switch, maintenance && styles.switchActive]}>
              <View style={[styles.switchKnob, maintenance && styles.switchKnobActive]} />
            </View>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable disabled={!ready || saving} onPress={save} style={({ pressed }) => [styles.button, (!ready || saving) && styles.buttonDisabled, pressed && ready && styles.buttonPressed]}>
            <Text style={styles.buttonText}>{saving ? "Сохраняю…" : maintenance ? "Создать поддержание" : selectedGoal ? "Добавить в цель" : "Создать путь"}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ number, label, value, onChangeText, placeholder }: { number: string; label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return (
    <View style={styles.block}>
      <View style={styles.fieldHeader}>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.blockLabel}>{label}</Text>
      </View>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={theme.colors.muted} style={styles.input} maxLength={120} returnKeyType="next" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: 20, paddingBottom: 40 },
  back: { color: theme.colors.blue, fontSize: 16, fontWeight: "700", paddingVertical: 10, marginBottom: 18 },
  eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1.1 },
  title: { color: theme.colors.text, fontSize: 34, lineHeight: 40, fontWeight: "700", marginTop: 6 },
  subtitle: { color: theme.colors.muted, fontSize: 16, lineHeight: 23, marginTop: 10, marginBottom: 26 },
  block: { marginBottom: 20 },
  goalLoading: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  goalLoadingText: { color: theme.colors.muted, fontSize: 14 },
  goalModes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  goalChip: {
    maxWidth: "100%",
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  goalChipActive: { backgroundColor: theme.colors.blue, borderColor: theme.colors.blue },
  goalChipText: { color: theme.colors.text, fontSize: 14, fontWeight: "700" },
  goalChipTextActive: { color: "#FFFFFF" },
  goalHint: { color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 10 },
  selectedGoalCard: {
    backgroundColor: theme.colors.blueSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  selectedGoalLabel: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 0.8 },
  selectedGoalTitle: { color: theme.colors.text, fontSize: 19, fontWeight: "800", marginTop: 6 },
  selectedGoalText: { color: theme.colors.muted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  fieldHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  number: { color: theme.colors.blue, fontSize: 13, fontWeight: "800" },
  blockLabel: { color: theme.colors.text, fontSize: 15, fontWeight: "700", marginBottom: 8 },
  input: { minHeight: 54, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, paddingHorizontal: 16, color: theme.colors.text, fontSize: 16 },
  levels: { flexDirection: "row", gap: 8 },
  level: { flex: 1, minHeight: 68, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center" },
  levelActive: { backgroundColor: theme.colors.blue, borderColor: theme.colors.blue },
  levelTitle: { color: theme.colors.text, fontWeight: "800", fontSize: 15 },
  levelTitleActive: { color: "#FFFFFF" },
  levelHint: { color: theme.colors.muted, fontSize: 11, marginTop: 3 },
  levelHintActive: { color: "rgba(255,255,255,.78)" },
  maintenance: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 14, padding: 15, marginBottom: 20 },
  maintenanceActive: { backgroundColor: theme.colors.greenSoft, borderColor: theme.colors.green },
  maintenanceBody: { flex: 1 },
  maintenanceTitle: { color: theme.colors.text, fontSize: 16, fontWeight: "800" },
  maintenanceText: { color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 4 },
  switch: { width: 46, height: 28, borderRadius: 14, backgroundColor: theme.colors.soft, padding: 3 },
  switchActive: { backgroundColor: theme.colors.green },
  switchKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: theme.colors.surface },
  switchKnobActive: { marginLeft: 18 },
  error: { color: theme.colors.red, backgroundColor: "#FCE9E7", borderRadius: 10, padding: 12, marginBottom: 14, lineHeight: 20 },
  button: { minHeight: 54, borderRadius: 12, backgroundColor: theme.colors.blue, alignItems: "center", justifyContent: "center", marginTop: 4 },
  buttonDisabled: { opacity: 0.38 },
  buttonPressed: { opacity: 0.78 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});
