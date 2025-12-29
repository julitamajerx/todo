import cron from "node-cron";
import { TaskModel } from "../models/task.model";

export const initCleanupJob = () => {
  cron.schedule("0 3 * * *", async () => {
    console.log("--- Rozpoczynam nocne czyszczenie starych zadań ---");

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await TaskModel.deleteMany({
        dueDate: { $lt: thirtyDaysAgo },
      });

      console.log(
        `Czyszczenie zakończone. Usunięto zadań: ${result.deletedCount}`
      );
    } catch (error) {
      console.error("Błąd podczas czyszczenia bazy:", error);
    }
  });
};
