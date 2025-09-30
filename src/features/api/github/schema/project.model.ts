import { z } from "zod";

const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  number: z.number(),
});

export const projectsSchema = z.array(projectSchema);

export type ProjectType = z.infer<typeof projectSchema>;
export type ProjectsType = z.infer<typeof projectsSchema>;
