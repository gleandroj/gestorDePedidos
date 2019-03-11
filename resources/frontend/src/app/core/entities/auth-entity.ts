export class AuthEntity {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

export class AuthTokenEntity {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
}
