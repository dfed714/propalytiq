// settings/dto/update-notifications.dto.ts
import { z } from 'zod';

export const UpdateNotificationsSchema = z.object({
  email_reports: z.boolean(),
  market_updates: z.boolean(),
  product_updates: z.boolean(),
  security_alerts: z.boolean(),
});

export type UpdateNotificationsDto = z.infer<typeof UpdateNotificationsSchema>;
