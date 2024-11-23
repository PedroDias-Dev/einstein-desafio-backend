import { z } from "zod";

const validateSchema = (schema: any, data: any) => {
  try {
    schema.parse(data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.issues[0].message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export { validateSchema };
