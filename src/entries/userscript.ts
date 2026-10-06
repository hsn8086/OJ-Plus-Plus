import { startApp } from '../app.ts';
import { createUserscriptPlatform } from '../platforms/userscript.ts';
import { resolveSite } from '../sites/index.ts';
import { toast } from '../ui/toast.ts';

const site = resolveSite(new URL(location.href));
if (site) {
  try {
    const platform = createUserscriptPlatform();
    void startApp(platform, site).catch((error) => toast(String(error), 'error'));
  } catch (error) {
    console.error('[OJ++]', error);
    alert(error instanceof Error ? error.message : String(error));
  }
}
