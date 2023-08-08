import { SessionRepository } from "../repository/session";
import { UserRepository } from "../repository/user";
import { AuthError } from "./error";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import dayjs from "dayjs";

type LoginError<T extends AuthError = AuthError> = {
    success: false;
    type: T;
};

type LoginSuccess = {
    success: true;
    user: {
        id: string;
        email: string;
        createdAt: Date;
    };
    session: {
        token: string;
        expires: Date;
    };
};

export class AuthService {
    private userRepository;
    private sessionRepository;

    constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    async login(
        email: string,
        password: string,
    ): Promise<LoginSuccess | LoginError<AuthError.invalidCredentials | AuthError.loginFailure>> {
        // 1. Select user from database by email
        // 2. Compare password with node:crypto.timingsafeequal
        // 3. Create session
        // 4. Return session and user

        const userInDatabase = await this.userRepository.getByEmail(email);

        if (!userInDatabase) {
            return { success: false, type: AuthError.invalidCredentials };
        }

        const givenPassword = this.hashPassword(password, userInDatabase.salt);

        if (
            !timingSafeEqual(
                Buffer.from(givenPassword.hashed),
                Buffer.from(userInDatabase.password),
            )
        ) {
            return { success: false, type: AuthError.invalidCredentials };
        }

        const createdSession = await this.createSession(userInDatabase);

        if (!createdSession) {
            return { success: false, type: AuthError.loginFailure };
        }

        return {
            success: true,
            user: {
                id: userInDatabase.id,
                email: userInDatabase.email,
                createdAt: userInDatabase.createdAt,
            },
            session: {
                token: createdSession.token,
                expires: createdSession.expires,
            },
        };
    }

    async register(
        email: string,
        password: string,
        repeatPassword: string,
    ): Promise<
        | LoginError<AuthError.passwordMismatch | AuthError.emailTaken | AuthError.loginFailure>
        | LoginSuccess
    > {
        // 1. compare given passwords
        // 2. Check if email is taken
        // 3. if not, create user with hashed password (node:crypto.pbkdf2)
        // 4. create session
        // 5. return session and user

        if (password !== repeatPassword) {
            return { success: false, type: AuthError.passwordMismatch };
        }

        const hash = this.hashPassword(password);

        if (await this.userRepository.getByEmail(email)) {
            return { success: false, type: AuthError.emailTaken };
        }

        const createdUser = await this.userRepository.createOne({
            email,
            password: hash.hashed,
            salt: hash.salt,
        });

        if (!createdUser) {
            return { success: false, type: AuthError.emailTaken };
        }

        const createdSession = await this.createSession(createdUser);

        if (!createdSession) {
            return { success: false, type: AuthError.loginFailure };
        }

        return {
            success: true,
            user: {
                id: createdUser.id,
                email: createdUser.email,
                createdAt: createdUser.createdAt,
            },
            session: {
                token: createdSession.token,
                expires: createdSession.expires,
            },
        };
    }

    async logout() {
        // TODO)) implement logout function
    }

    async createSession(user: { id: string }) {
        const createdSession = await this.sessionRepository.createOne({
            userId: user.id,
            ip: "", // TODO
            userAgent: "", // TODO
            token: this.createSessionToken(),
            expires: dayjs().add(30, "day").toDate(),
        });
        return createdSession;
    }

    hashPassword(password: string, salt?: string): { hashed: string; salt: string } {
        const _salt = salt ?? randomBytes(64).toString("hex");
        const hashed = pbkdf2Sync(password, _salt, 100000, 64, "sha512");

        return {
            hashed: hashed.toString("hex"),
            salt: _salt,
        };
    }

    createSessionToken() {
        return randomBytes(64).toString("hex");
    }
}
