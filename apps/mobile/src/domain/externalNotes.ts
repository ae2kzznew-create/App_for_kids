import type { ExternalNoteEntityType, ExternalNoteLink } from "./types";

export function createExternalNoteLink(entityType: ExternalNoteEntityType, entityId: string, input: string, updatedAt: string): ExternalNoteLink {
  const value = input.trim();
  if (!value) throw new Error("Укажи путь к заметке или ссылку");
  const id = `external_${entityType}_${entityId}`;
  if (/^obsidian:\/\//i.test(value)) return { id, entityType, entityId, provider: "obsidian", externalUrl: value, updatedAt };
  if (/^https?:\/\//i.test(value)) return { id, entityType, entityId, provider: "web", externalUrl: value, updatedAt };
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) throw new Error("Поддерживаются Obsidian URI, http(s) или путь внутри vault");
  return { id, entityType, entityId, provider: "obsidian", externalPath: value.replace(/^\/+/, ""), updatedAt };
}

export function externalNoteOpenUrl(link: ExternalNoteLink) {
  if (link.externalUrl) return link.externalUrl;
  if (link.externalPath) return `obsidian://open?path=${encodeURIComponent(link.externalPath)}`;
  throw new Error("У внешней заметки нет пути или URL");
}

export function externalNoteDisplayValue(link: ExternalNoteLink | null) { return link?.externalUrl ?? link?.externalPath ?? ""; }
