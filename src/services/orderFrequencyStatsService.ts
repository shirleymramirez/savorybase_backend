import { type PipelineStage } from "mongoose";

import OrderFrequencyStat from "../models/OrderFrequencyStat.ts";
import OrderItem from "../models/OrderItem.ts";
import { env } from "../config/env.ts";

type OrderFrequencyPeriod = "daily" | "weekly";

type OrderFrequencyStatRow = {
  period: OrderFrequencyPeriod;
  period_start: Date;
  food_item_id: unknown;
  order_count: number;
  item_quantity: number;
  gross_revenue: number;
  refreshed_at: Date;
};

const buildStatsPipeline = (period: OrderFrequencyPeriod): PipelineStage[] => [
  {
    $lookup: {
      from: "orders",
      localField: "order_id",
      foreignField: "_id",
      as: "order"
    }
  },
  {
    $unwind: "$order"
  },
  {
    $match: {
      canceled_at: null,
      "order.status": {
        $ne: "canceled"
      }
    }
  },
  {
    $group: {
      _id: {
        food_item_id: "$food_item_id",
        period_start: {
          $dateTrunc: {
            date: "$order.created_at",
            unit: period === "daily" ? "day" : "week",
            timezone: env.orderStatsTimezone,
            startOfWeek: "Monday"
          }
        }
      },
      order_ids: {
        $addToSet: "$order_id"
      },
      item_quantity: {
        $sum: "$quantity"
      },
      gross_revenue: {
        $sum: {
          $multiply: ["$price_at_time_of_order", "$quantity"]
        }
      }
    }
  },
  {
    $project: {
      _id: 0,
      period: period,
      period_start: "$_id.period_start",
      food_item_id: "$_id.food_item_id",
      order_count: {
        $size: "$order_ids"
      },
      item_quantity: 1,
      gross_revenue: 1,
      refreshed_at: "$$NOW"
    }
  }
];

let activeRefresh: Promise<OrderFrequencyStatRow[]> | null = null;
let refreshQueued = false;

const runRefresh = async (): Promise<OrderFrequencyStatRow[]> => {
  const [dailyStats, weeklyStats] = await Promise.all([
    OrderItem.aggregate<OrderFrequencyStatRow>(buildStatsPipeline("daily")),
    OrderItem.aggregate<OrderFrequencyStatRow>(buildStatsPipeline("weekly"))
  ]);

  const stats = [...dailyStats, ...weeklyStats];

  await OrderFrequencyStat.deleteMany({});

  if (stats.length > 0) {
    await OrderFrequencyStat.insertMany(stats, {
      ordered: false
    });
  }

  return stats;
};

const refreshOrderFrequencyStats = async (): Promise<OrderFrequencyStatRow[]> => {
  if (activeRefresh) {
    refreshQueued = true;
    return activeRefresh;
  }

  activeRefresh = runRefresh()
    .finally(async () => {
      activeRefresh = null;

      if (refreshQueued) {
        refreshQueued = false;
        await refreshOrderFrequencyStats();
      }
    });

  return activeRefresh;
};

export {
  buildStatsPipeline,
  refreshOrderFrequencyStats
};
export type {
  OrderFrequencyPeriod,
  OrderFrequencyStatRow
};
