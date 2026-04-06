import { z } from "zod";

export const CommunicationStyleSchema = z.object({
  tone: z.string(),
  format: z.string(),
  uncertaintyLabeling: z.boolean(),
  noFiller: z.boolean(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  role: z.string(),
  organization: z.string(),
  startDate: z.string(),
  fullTimeDate: z.string(),
  location: z.string(),
  previousLocation: z.string(),
  reportsTo: z.string(),
  functionalLine: z.string(),
  domains: z.array(z.string()),
  background: z.array(z.string()),
  communicationStyle: CommunicationStyleSchema,
  lastUpdated: z.string(),
});

export type Profile = z.infer<typeof ProfileSchema>;
