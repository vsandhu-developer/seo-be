import z from "zod";

export const CREATE_USER = z.object({
  username: z.string("Username is required").min(5),
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

export const GET_USER = z.object({
  userId: z.string(),
});
