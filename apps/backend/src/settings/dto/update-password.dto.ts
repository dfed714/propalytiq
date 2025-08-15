// settings/dto/update-password.dto.ts
import { z } from 'zod';

// Validation schema
export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
