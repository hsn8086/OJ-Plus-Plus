import type { Storage } from '../platforms/types.ts';
import { migrate, SETTINGS_KEY } from './config.ts';
import type { Settings } from './types.ts';

/** 旧键只作为迁移来源，保存一律写新键；保留旧数据以便回退。 */
export async function loadSettings(storage: Storage): Promise<Settings> {
  const current = await storage.get<unknown>(SETTINGS_KEY);
  if (current !== undefined) return migrate(current);
  const legacy = await storage.get<unknown>('ncb:settings');
  const settings = migrate(legacy);
  if (legacy !== undefined) await storage.set(SETTINGS_KEY, settings);
  return settings;
}

export async function saveSettings(storage: Storage, settings: Settings): Promise<void> {
  await storage.set(SETTINGS_KEY, settings);
}
