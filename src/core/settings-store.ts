import type { Storage } from '../platforms/types.ts';
import { migrate, SETTINGS_KEY } from './config.ts';
import type { Settings } from './types.ts';

/**
 * 读写配置。
 *
 * 不再迁移 `ncb:settings`：脚本管理器的 GM 存储按脚本 uuid 隔离
 * （Tampermonkey 的 saveStorageKey 带 uuid 参数），uuid 由 @namespace + @name 决定。
 * 改名后两个脚本的 uuid 不同，旧键根本读不到，这段迁移是死代码。
 */
export async function loadSettings(storage: Storage): Promise<Settings> {
  return migrate(await storage.get<unknown>(SETTINGS_KEY));
}

export async function saveSettings(storage: Storage, settings: Settings): Promise<void> {
  await storage.set(SETTINGS_KEY, settings);
}
