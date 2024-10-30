import { app, ipcMain } from "electron";
import { readdir } from "fs/promises";

declare global {
  interface Window {
    api: {
      scan: () => string[];
    };
  }
}

const prismInstanceConfig = /\/instance\.cfg$/;

// Don't forget to add any new handlers to the context bridge in preload.ts
export const registerApiHandlers = () => {
  ipcMain.handle("scan", async (): Promise<string[]> => {
    const path = app.getPath("home");
    const prismFlatpakInstances =
      ".var/app/org.prismlauncher.PrismLauncher/data/PrismLauncher/instances";
    const contents = await readdir(`${path}/${prismFlatpakInstances}`, {
      recursive: true,
    });
    const instances = contents.filter((item) => prismInstanceConfig.test(item));
    return instances;
  });
};
