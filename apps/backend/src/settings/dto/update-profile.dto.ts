
// settings/dto/update-profile.dto.ts
import { z } from 'zod';

// Validation schema
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
