import cron from "node-cron";
import { TaskModel } from "../models/task.model";

export const initCleanupJob = () => {
  cron.schedule("0 3 * * *", async () => {
    console.log("--- Starting nightly cleanup of old tasks ---");

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await TaskModel.deleteMany({
        dueDate: { $lt: thirtyDaysAgo },
      });

      console.log(
        `Cleanup completed. Deleted tasks count: ${result.deletedCount}`
      );
    } catch (error) {
      console.error("Error during database cleanup:", error);
    }
  });
};
