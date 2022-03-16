export interface ApiUser {
    readonly id: string;
    readonly username: string;
    readonly discriminator: string;
    readonly avatar?: string;
    readonly bot?: boolean;
    readonly system?: boolean;
    readonly mfa_enabled?: boolean;
    readonly banner?: string;
    readonly accent_color?: number;
    readonly locale?: string;
    readonly verified?: boolean;
    readonly email?: string;
    readonly flags?: number;
    readonly premium_type?: number;
    readonly public_flags?: number;
}