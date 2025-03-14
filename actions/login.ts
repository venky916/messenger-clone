"use server";
// import { LoginSchema } from "@/schemas";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import * as z from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

// export const login = async (values: z.infer<typeof LoginSchema>) => {
//   const validatedFields = LoginSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return { error: "Invalid fields!" };
//   }

//   const { email, password } = validatedFields.data;

//   try {
//     const user = await signIn("credentials", {
//       email,
//       password,
//       redirectTo: DEFAULT_LOGIN_REDIRECT,
//     });
//     return {
//       success: user,
//     };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return {
//             error: "Invalid Credentials",
//           };

//         default:
//           return {
//             error: "Something went Wrong",
//           };
//       }
//     }

//     throw error;
//   }
// };

export const login = async (data: any) => {
  // console.log(data, "login");
  const { email, password } = data;

  try {
    const user = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return {
      success: user,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          };

        default:
          return {
            error: "Something went Wrong",
          };
      }
    }
    throw error;
  }
};
