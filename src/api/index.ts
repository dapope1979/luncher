import { app, ipcMain } from "electron";
import { readdir, readFile } from "fs/promises";

declare global {
  interface Window {
    api: {
      scan: () => string[];
    };
  }
}

const prismInstanceConfig = /\/instance\.cfg$/;
const prismInstanceName = /name=(.*)$/m;

interface PrismFlatpakInstance {
  path: string;
  name: string;
  command: string;
}

// Don't forget to add any new handlers to the context bridge in preload.ts
export const registerApiHandlers = () => {
  ipcMain.handle("scan", async (): Promise<string[]> => {
    const path = app.getPath("home");
    const prismFlatpakInstances =
      ".var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher/instances";
    const contents = await readdir(`${path}/${prismFlatpakInstances}`, {
      recursive: true,
    });
    const instanceConfigs = contents.filter((item) =>
      prismInstanceConfig.test(item),
    );

    instanceConfigs.forEach(async (instanceConfig) => {
      const contents = (
        await readFile(`${path}/${prismFlatpakInstances}/${instanceConfig}`)
      ).toString();

      const matches = contents.match(prismInstanceName);
      const instanceName = matches[1];
      const instancePath = instanceConfig.replace("/instance.cfg", "");
      const instance = {
        name: instanceName,
        path: instancePath,
        command: `flatpak run org.prismlauncher.PrismLauncher --launch "${instancePath}"`,
      } as PrismFlatpakInstance;
      console.log(instance);
    });

    // TODO: read servers, worlds, accounts?
    //https://github.com/PrismarineJS/prismarine-nbt
    return instanceConfigs;
  });
};
