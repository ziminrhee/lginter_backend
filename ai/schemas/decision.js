import { z } from 'zod';

// Zod schema for controller decision
export const DecisionZ = z.object({
  params: z.object({
    temp: z.number().min(-20).max(30),
    humidity: z.number().min(20).max(80),
    lightColor: z.string().regex(/^#?[0-9a-fA-F]{6}$/).transform((s) => (s.startsWith('#') ? s.toUpperCase() : `#${s.toUpperCase()}`)),
    music: z.string().min(1),
    windLevel: z.number().int().min(1).max(5).optional(),
    purifierOn: z.boolean().optional(),
    purifierMode: z.enum(['humidify', 'humidify_plus_purify', 'purify']).optional(),
  }),
  reason: z.string().optional(),
  flags: z
    .object({
      offTopic: z.boolean().optional(),
      abusive: z.boolean().optional(),
    })
    .optional(),
  emotionKeyword: z.string().optional(),
});

// Minimal JSON Schema for OpenAI tool parameters (no extra dependency)
export function toJsonSchema() {
  return {
    type: 'object',
    properties: {
      params: {
        type: 'object',
        properties: {
          temp: { type: 'number', minimum: -20, maximum: 30 },
          humidity: { type: 'number', minimum: 20, maximum: 80 },
          lightColor: { type: 'string', pattern: '^#?[0-9a-fA-F]{6}$' },
          music: { type: 'string' },
          windLevel: { type: 'integer', minimum: 1, maximum: 5 },
          purifierOn: { type: 'boolean' },
          purifierMode: { type: 'string', enum: ['humidify', 'humidify_plus_purify', 'purify'] },
        },
        required: ['temp', 'humidity', 'lightColor', 'music'],
        additionalProperties: false,
      },
      reason: { type: 'string' },
      flags: {
        type: 'object',
        properties: { offTopic: { type: 'boolean' }, abusive: { type: 'boolean' } },
        additionalProperties: false,
      },
      emotionKeyword: { type: 'string' },
    },
    required: ['params'],
    additionalProperties: false,
  };
}


