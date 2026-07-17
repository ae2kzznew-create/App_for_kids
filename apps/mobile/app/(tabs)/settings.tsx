import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePersonalApp } from "../../src/application/PersonalAppProvider";
import { buildMarkdownBundle, buildMarkdownDocuments } from "../../src/domain/markdownExport";
import { loadMarkdownExportInput } from "../../src/domain/markdownExportInput";
import { importMarkdownBundle } from "../../src/domain/markdownImport";
import { exportDocumentsToVault, readVaultBundle } from "../../src/domain/vaultSync";
import { useDatabase } from "../../src/storage/DatabaseProvider";
import { type DatabaseHealth, readDatabaseHealth } from "../../src/storage/database";
import { requestVaultFolderAccess, safVaultFileSystem } from "../../src/storage/vaultFileSystem";
import { readVaultFolderUri, saveVaultFolderUri } from "../../src/storage/vaultSettings";
import { theme } from "../../src/theme";

export default function SettingsScreen() {
  const database = useDatabase();
  const { repository, refresh } = usePersonalApp();
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [documentCount, setDocumentCount] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [vaultFolderUri, setVaultFolderUri] = useState<string | null>(null);
  const [vaultBusy, setVaultBusy] = useState<"pick" | "export" | "import" | null>(null);
  const [vaultMessage, setVaultMessage] = useState("");
  const [vaultError, setVaultError] = useState("");

  useFocusEffect(useCallback(() => {
    let active = true;
    setHealthLoading(true);
    setHealthError("");
    readDatabaseHealth(database)
      .then((nextHealth) => {
        if (active) setHealth(nextHealth);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setHealthError(error instanceof Error ? error.message : "Не удалось прочитать состояние SQLite");
      })
      .finally(() => {
        if (active) setHealthLoading(false);
      });
    return () => { active = false; };
  }, [database]));

  useFocusEffect(useCallback(() => {
    let active = true;
    readVaultFolderUri(database)
      .then((uri) => {
        if (active) setVaultFolderUri(uri);
      })
      .catch((error: unknown) => {
        if (active) setVaultError(error instanceof Error ? error.message : "Не удалось прочитать настройку папки");
      });
    return () => { active = false; };
  }, [database]));

  async function refreshHealthStatus() {
    setHealthLoading(true);
    setHealthError("");
    try {
      setHealth(await readDatabaseHealth(database));
    } catch (error) {
      setHealthError(error instanceof Error ? error.message : "Не удалось прочитать состояние SQLite");
    } finally {
      setHealthLoading(false);
    }
  }

  async function buildExport(share: boolean) {
    setExporting(true); setExportError("");
    try {
      const input = await loadMarkdownExportInput(repository, "pavel");
      const documents = buildMarkdownDocuments(input); const bundle = buildMarkdownBundle(input);
      setDocumentCount(documents.length); setMarkdown(bundle);
      if (share) await Share.share({ title: "Levera Markdown export", message: bundle });
    } catch (error) { setExportError(error instanceof Error ? error.message : "Не удалось собрать экспорт"); }
    finally { setExporting(false); }
  }

  async function runImport() {
    if (!importText.trim() || importing) return;
    setImporting(true); setImportMessage("");
    try {
      const result = await importMarkdownBundle(repository, importText, { defaultProfileId: "pavel", displayName: "Pavel", importedAt: new Date().toISOString() });
      setImportMessage(`Готово: ${result.created} создано, ${result.updated} обновлено, ${result.total} обработано. Повторный импорт обновит те же ID без копий.`);
      refresh();
    } catch (error) { setImportMessage(error instanceof Error ? error.message : "Не удалось импортировать Markdown"); }
    finally { setImporting(false); }
  }

  async function pickVaultFolder() {
    if (vaultBusy) return;
    setVaultBusy("pick"); setVaultError(""); setVaultMessage("");
    try {
      const directoryUri = await requestVaultFolderAccess();
      if (directoryUri) {
        await saveVaultFolderUri(database, directoryUri);
        setVaultFolderUri(directoryUri);
        setVaultMessage("Папка выбрана. Добавь её в Autosync for Google Drive — файлы будут уходить на Диск автоматически.");
      }
    } catch (error) { setVaultError(error instanceof Error ? error.message : "Не удалось выбрать папку"); }
    finally { setVaultBusy(null); }
  }

  async function exportToVault() {
    if (!vaultFolderUri || vaultBusy) return;
    setVaultBusy("export"); setVaultError(""); setVaultMessage("");
    try {
      const input = await loadMarkdownExportInput(repository, "pavel");
      const documents = buildMarkdownDocuments(input);
      const result = await exportDocumentsToVault(safVaultFileSystem, vaultFolderUri, documents);
      setVaultMessage(`В папку записано ${result.total} документов: ${result.created} создано, ${result.updated} обновлено.`);
    } catch (error) { setVaultError(error instanceof Error ? error.message : "Не удалось записать файлы в папку"); }
    finally { setVaultBusy(null); }
  }

  async function importFromVault() {
    if (!vaultFolderUri || vaultBusy) return;
    setVaultBusy("import"); setVaultError(""); setVaultMessage("");
    try {
      const bundle = await readVaultBundle(safVaultFileSystem, vaultFolderUri);
      const result = await importMarkdownBundle(repository, bundle, { defaultProfileId: "pavel", displayName: "Pavel", importedAt: new Date().toISOString() });
      setVaultMessage(`Импорт из папки: ${result.created} создано, ${result.updated} обновлено, ${result.total} обработано.`);
      refresh();
    } catch (error) { setVaultError(error instanceof Error ? error.message : "Не удалось импортировать из папки"); }
    finally { setVaultBusy(null); }
  }

  return <SafeAreaView style={styles.safe} edges={["top"]}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>ВТОРОЙ МОЗГ</Text><Text style={styles.title}>Связи</Text>
    <View style={styles.exportCard}><View style={styles.exportHeader}><View style={styles.icon}><MaterialCommunityIcons name="language-markdown-outline" size={26} color={theme.colors.blue} /></View><View style={styles.body}><Text style={styles.cardTitle}>Markdown export</Text><Text style={styles.cardText}>Цели, навыки, квесты, обзоры и связанные внешние заметки становятся отдельными документами со стабильными YAML ID.</Text></View></View>
      <View style={styles.actions}><Pressable disabled={exporting} onPress={() => buildExport(false)} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Собрать</Text></Pressable><Pressable disabled={exporting} onPress={() => buildExport(true)} style={styles.primaryButton}>{exporting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Поделиться</Text>}</Pressable></View>
      {exportError ? <Text style={styles.error}>{exportError}</Text> : null}
      {markdown ? <View style={styles.preview}><Text style={styles.previewTitle}>{documentCount} Markdown-документов готовы</Text><Text selectable numberOfLines={12} style={styles.previewText}>{markdown}</Text></View> : <Text style={styles.exportHint}>Экспорт остаётся локальным, пока ты не выберешь приложение через системное меню.</Text>}
    </View>

    <View style={styles.exportCard}><View style={styles.exportHeader}><View style={styles.vaultIcon}><MaterialCommunityIcons name="folder-sync-outline" size={26} color={theme.colors.orange} /></View><View style={styles.body}><Text style={styles.cardTitle}>Папка синхронизации</Text><Text style={styles.cardText}>Выбери папку для MD-файлов — например ту, которую Autosync for Google Drive зеркалит на Диск. Экспорт пишет каждый документ отдельным файлом, импорт читает их обратно без дублей.</Text></View></View>
      {vaultFolderUri ? <Text style={styles.vaultPath} numberOfLines={2}>{decodeURIComponent(vaultFolderUri)}</Text> : null}
      {Platform.OS === "android" ? <>
        <View style={styles.actions}><Pressable disabled={vaultBusy !== null} onPress={pickVaultFolder} style={styles.secondaryButton}>{vaultBusy === "pick" ? <ActivityIndicator color={theme.colors.blue} /> : <Text style={styles.secondaryButtonText}>{vaultFolderUri ? "Сменить папку" : "Выбрать папку"}</Text>}</Pressable></View>
        {vaultFolderUri ? <View style={styles.actions}><Pressable disabled={vaultBusy !== null} onPress={exportToVault} style={styles.primaryButton}>{vaultBusy === "export" ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Экспорт в папку</Text>}</Pressable><Pressable disabled={vaultBusy !== null} onPress={importFromVault} style={styles.vaultImportButton}>{vaultBusy === "import" ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Импорт из папки</Text>}</Pressable></View> : null}
      </> : <Text style={styles.exportHint}>Выбор папки работает на Android. На других платформах используй экспорт через «Поделиться».</Text>}
      {vaultMessage ? <Text style={styles.importMessage}>{vaultMessage}</Text> : null}
      {vaultError ? <Text style={styles.error}>{vaultError}</Text> : null}
      {!vaultMessage && !vaultError ? <Text style={styles.exportHint}>Приложение пишет только в выбранную папку. Облачную синхронизацию выполняет внешнее приложение.</Text> : null}
    </View>

    <View style={styles.exportCard}><View style={styles.exportHeader}><View style={styles.importIcon}><MaterialCommunityIcons name="file-import-outline" size={26} color={theme.colors.green} /></View><View style={styles.body}><Text style={styles.cardTitle}>Markdown import</Text><Text style={styles.cardText}>Вставь один документ или bundle. `levera_id` обновляет существующую запись вместо создания копии.</Text></View></View>
      <TextInput accessibilityLabel="Markdown для импорта" multiline value={importText} onChangeText={setImportText} placeholder={'---\nlevera_id: "goal_..."\nlevera_type: "goal"\n---'} placeholderTextColor={theme.colors.muted} style={styles.importInput} textAlignVertical="top" autoCapitalize="none" autoCorrect={false} />
      <Pressable disabled={!importText.trim() || importing} onPress={runImport} style={[styles.importButton, (!importText.trim() || importing) && styles.disabled]}>{importing ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Импортировать без дублей</Text>}</Pressable>
      {importMessage ? <Text style={styles.importMessage}>{importMessage}</Text> : <Text style={styles.exportHint}>Сначала экспортируй резервную копию. Импорт проверяет связи цель → навык → квест до сохранения.</Text>}
    </View>

    <View style={styles.card}><View style={styles.icon}><MaterialCommunityIcons name="cube-outline" size={26} color={theme.colors.muted} /></View><View style={styles.body}><Text style={styles.cardTitle}>Obsidian</Text><Text style={styles.cardText}>Ссылки на заметки и открытие через URI. Двусторонняя синхронизация позже.</Text></View><Text style={styles.later}>Позже</Text></View>
    <Text style={styles.sectionTitle}>Надёжность данных</Text>
    <View style={styles.card}><View style={[styles.icon, health?.persistenceVerified ? styles.verifiedIcon : null]}><MaterialCommunityIcons name={health?.persistenceVerified ? "database-check-outline" : "database-clock-outline"} size={26} color={health?.persistenceVerified ? theme.colors.green : theme.colors.orange} /></View><View style={styles.body}><Text style={styles.cardTitle}>SQLite между запусками</Text>{health ? <><Text style={styles.cardText}>{health.persistenceVerified ? "Предыдущая метка запуска найдена. Локальная база пережила повторный запуск приложения." : "Закрой приложение полностью и открой снова. После следующего запуска здесь появится подтверждение."}</Text><Text style={styles.healthMeta}>Текущий запуск: {formatDate(health.lastSuccessfulStart)}</Text>{health.previousSuccessfulStart ? <Text style={styles.healthMeta}>Предыдущий: {formatDate(health.previousSuccessfulStart)}</Text> : null}<View style={styles.healthActions}><Pressable disabled={healthLoading} onPress={refreshHealthStatus} style={[styles.healthButton, healthLoading && styles.disabled]}>{healthLoading ? <ActivityIndicator color={theme.colors.blue} size="small" /> : <Text style={styles.healthButtonText}>Обновить статус</Text>}</Pressable></View>{healthError ? <Text style={styles.healthError}>{healthError}</Text> : null}</> : healthLoading ? <ActivityIndicator color={theme.colors.blue} style={styles.loader} /> : healthError ? <Text style={styles.healthError}>{healthError}</Text> : null}</View><Text style={health?.persistenceVerified ? styles.verified : styles.pending}>{health?.persistenceVerified ? "Проверено" : "1 шаг"}</Text></View>
    <View style={styles.note}><Text style={styles.noteTitle}>Локально по умолчанию</Text><Text style={styles.noteText}>Экспорт и импорт выполняются только после явного действия. Никакой автоматической отправки или синхронизации.</Text></View>
  </ScrollView></SafeAreaView>;
}

const formatDate = (value: string) => value ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)) : "нет данных";
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: theme.colors.canvas }, content: { padding: 20, paddingBottom: 40, gap: 14 }, eyebrow: { color: theme.colors.blue, fontSize: 12, fontWeight: "800", letterSpacing: 1 }, title: { color: theme.colors.text, fontSize: 34, fontWeight: "700", marginTop: -8, marginBottom: 8 }, sectionTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "700", marginTop: 10 }, card: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }, exportCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, padding: 16 }, exportHeader: { flexDirection: "row", alignItems: "center", gap: 12 }, icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.blueSoft, justifyContent: "center", alignItems: "center" }, importIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.greenSoft, justifyContent: "center", alignItems: "center" }, vaultIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.orangeSoft, justifyContent: "center", alignItems: "center" }, verifiedIcon: { backgroundColor: theme.colors.greenSoft }, body: { flex: 1 }, cardTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, cardText: { color: theme.colors.muted, lineHeight: 20, marginTop: 4 }, actions: { flexDirection: "row", gap: 10, marginTop: 16 }, secondaryButton: { flex: 1, minHeight: 46, borderWidth: 1, borderColor: theme.colors.blue, borderRadius: 11, alignItems: "center", justifyContent: "center" }, secondaryButtonText: { color: theme.colors.blue, fontWeight: "800" }, primaryButton: { flex: 1, minHeight: 46, backgroundColor: theme.colors.blue, borderRadius: 11, alignItems: "center", justifyContent: "center" }, primaryButtonText: { color: "#FFFFFF", fontWeight: "800" }, vaultImportButton: { flex: 1, minHeight: 46, backgroundColor: theme.colors.green, borderRadius: 11, alignItems: "center", justifyContent: "center" }, vaultPath: { color: theme.colors.muted, fontFamily: "monospace", fontSize: 11, lineHeight: 16, marginTop: 12 }, exportHint: { color: theme.colors.muted, fontSize: 13, lineHeight: 19, marginTop: 12 }, preview: { backgroundColor: theme.colors.soft, borderRadius: 12, padding: 12, marginTop: 12 }, previewTitle: { color: theme.colors.text, fontWeight: "800", marginBottom: 8 }, previewText: { color: theme.colors.muted, fontFamily: "monospace", fontSize: 11, lineHeight: 16 }, importInput: { minHeight: 170, maxHeight: 260, color: theme.colors.text, backgroundColor: theme.colors.canvas, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, fontFamily: "monospace", fontSize: 12, lineHeight: 17, marginTop: 16 }, importButton: { minHeight: 48, backgroundColor: theme.colors.green, borderRadius: 11, alignItems: "center", justifyContent: "center", marginTop: 10 }, disabled: { opacity: 0.42 }, importMessage: { color: theme.colors.green, lineHeight: 20, marginTop: 10 }, error: { color: theme.colors.red, marginTop: 10 }, healthMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 5 }, healthActions: { marginTop: 12 }, healthButton: { minHeight: 40, borderWidth: 1, borderColor: theme.colors.blue, borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, alignSelf: "flex-start", minWidth: 150 }, healthButtonText: { color: theme.colors.blue, fontWeight: "800" }, healthError: { color: theme.colors.red, lineHeight: 19, marginTop: 10 }, loader: { alignSelf: "flex-start", marginTop: 8 }, later: { color: theme.colors.muted, fontWeight: "700", fontSize: 12 }, pending: { color: theme.colors.orange, fontWeight: "800", fontSize: 12 }, verified: { color: theme.colors.green, fontWeight: "800", fontSize: 12 }, note: { marginTop: 8, backgroundColor: theme.colors.soft, borderRadius: 16, padding: 18 }, noteTitle: { color: theme.colors.text, fontSize: 17, fontWeight: "700" }, noteText: { color: theme.colors.muted, lineHeight: 22, marginTop: 6 } });
