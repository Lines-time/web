import { TRPCError } from "@trpc/server";

export enum AuthError {
    passwordMismatch = "passwordMismatch",
    invalidCredentials = "invalidCredentials",
    emailTaken = "emailTaken",
    loginFailure = "loginFailure",
}

export function convertAuthErrorToTRPCError(error: AuthError) {
    switch (error) {
        case AuthError.invalidCredentials:
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid credentials", // TODO)) translation
            });
        case AuthError.loginFailure:
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Login failed", // TODO)) translation
            });
        case AuthError.passwordMismatch:
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Passwords do not match", // TODO)) translation
            });
        case AuthError.emailTaken:
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Email is already taken", // TODO)) translation
            });
    }
}
