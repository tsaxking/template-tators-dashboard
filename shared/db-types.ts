// this file contains all the types that are used in the database for sending/receiving data to/from the server

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {Account}
 */
export type Account = {
    id: string;
    username: string;
    key: string;
    salt: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordChange?: string;
    verified: number;
    verification?: string;
    emailChange?: string;
    passwordChangeDate?: number;
    created: number;
    phoneNumber?: string;
    picture?: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {AccountSafe}
 */
export type AccountSafe = {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    verified: number;
    created: number;
    phoneNumber: string;
    picture?: string;
    id: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {MembershipStatus}
 */
export type MembershipStatus =
    | 'pending'
    | 'twicePending'
    | 'accepted'
    | 'rejected'
    | 'notAllowed'
    | 'notMember';

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {Member}
 */
export type Member = {
    id: string;
    title?: string;
    status: string;
    bio?: string;
    resume?: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {MemberSafe}
 */
export type MemberSafe = Member & {
    skills: Skill[];
    status: MembershipStatus;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {Role}
 */
export type Role = {
    id: string;
    name: string;
    description: string | undefined;
    rank: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {AccountRole}
 */
export type AccountRole = {
    accountId: string;
    roleId: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {RolePermission}
 */
export type RolePermission = {
    permission: string;
    description?: string;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {Skill}
 */
export type Skill = {
    id: string;
    skill: string;
    years: number;
};

/**
 * Description placeholder
 * @date 1/11/2024 - 3:10:52 AM
 *
 * @export
 * @typedef {DiscordLink}
 */
export type DiscordLink = {
    id: string;
    discordId: string;
    created: number;
    username: string;
};

export type AccountSettings = {
    accountId: string;
    settings: string;
};
