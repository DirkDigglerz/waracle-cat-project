// import { z } from 'zod';

// // Define your schema for expected env keys and their types
// const envSchema = z.object({
//   NODE_ENV: z.enum(['development', 'production', 'test']),
//   PORT: z
//     .string()
//     .transform((val) => parseInt(val, 10))
//     .refine((num) => !isNaN(num) && num > 0, { message: 'PORT must be a positive number' }),
//   DATABASE_URL: z.string().url(),
//   API_KEY: z.string().min(1), // non-empty string
// });

// // Validate process.env and get typed output
// const env = envSchema.parse(process.env);

// console.log(env.PORT); // number
// console.log(env.DATABASE_URL); // string (validated as URL)