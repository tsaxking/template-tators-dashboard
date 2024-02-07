// this file was generated by a script, please do not modify it. if you see any problems, please raise an issue on https://github.com/tsaxking/webpack-template/issues

// tables:

export type accounts = {
    id: string;
    username: string;
    key: string;
    salt: string;
    first_name: string;
    last_name: string;
    email: string;
    password_change: string | undefined;
    picture: string | undefined;
    verified: number;
    verification: string | undefined;
    email_change: string | undefined;
    password_change_date: number | undefined;
    phone_number: string | undefined;
    created: number;
};

export type members = {
    id: string;
    title: string | undefined;
    status: string;
    bio: string | undefined;
    resume: string | undefined;
    board: number;
};

export type roles = {
    id: string;
    name: string;
    description: string | undefined;
    rank: number;
};

export type account_roles = {
    account_id: string;
    role_id: string;
};

export type permissions = {
    role_id: string;
    permission: string;
    description: string | undefined;
};

export type version = {
    major: number;
    minor: number;
    patch: number;
};

export type sessions = {
    id: string;
    account_id: string | undefined;
    ip: string | undefined;
    user_agent: string | undefined;
    latest_activity: number | undefined;
    requests: number;
    created: number;
    prev_url: string | undefined;
};

export type account_settings = {
    account_id: string;
    settings: string;
};

// queries

export type select_permissions_all = undefined;

export type select_roles_from_name = {
    name: string;
};

export type delete_roles_delete = {
    id: string;
};

export type update_roles_update = {
    name: string;
    description: string | undefined;
    rank: number;
    id: string;
};

export type insert_roles_new = {
    id: string;
    name: string;
    description: string | undefined;
    rank: number;
};

export type select_roles_from_id = {
    id: string;
};

export type select_roles_all = undefined;

export type delete_sessions_delete = {
    id: string;
};

export type delete_sessions_delete_all = undefined;

export type update_sessions_update = {
    account_id: string | undefined;
    user_agent: string | undefined;
    latest_activity: number | undefined;
    requests: number;
    ip: string | undefined;
    prev_url: string | undefined;
    id: string;
};

export type insert_sessions_new = {
    id: string;
    account_id: string | undefined;
    user_agent: string | undefined;
    latest_activity: number | undefined;
    requests: number;
    created: number;
    ip: string | undefined;
    prev_url: string | undefined;
};

export type select_sessions_get = {
    id: string;
};

export type select_sessions_all = undefined;

export type delete_member_delete = {
    id: string;
};

export type update_member_update_title = {
    title: string | undefined;
    id: string;
};

export type update_member_update_status = {
    id: string;
    status: string;
};

export type update_member_update_resume = {
    id: string;
    resume: string | undefined;
};

export type update_member_remove_from_board = {
    id: string;
};

export type insert_member_new = {
    id: string;
    status: string;
};

export type update_member_update_bio = {
    bio: string | undefined;
    id: string;
};

export type update_member_add_to_board = {
    id: string;
};

export type select_member_all = undefined;

export type update_account_unverify = {
    id: string;
};

export type update_account_set_verification = {
    verification: string | undefined;
    id: string;
};

export type delete_account_delete = {
    id: string;
};

export type select_account_unverified = undefined;

export type update_account_change_password = {
    salt: string;
    password_change: string | undefined;
    id: string;
    key: string;
};

export type insert_account_save_settings = {
    account_id: string;
    settings: string;
};

export type select_account_from_username = {
    username: string;
};

export type update_account_update_picture = {
    picture: string | undefined;
    id: string;
};

export type select_account_from_verification_key = {
    verification: string | undefined;
};

export type select_account_verified = undefined;

export type update_account_verify = {
    id: string;
};

export type select_account_get_settings = {
    account_id: string;
};

export type update_account_change_email = {
    email: string;
    id: string;
};

export type delete_account_remove_role = {
    account_id: string;
    role_id: string;
};

export type insert_account_add_role = {
    account_id: string;
    role_id: string;
};

export type select_account_from_email = {
    email: string;
};

export type insert_account_new = {
    id: string;
    username: string;
    key: string;
    salt: string;
    first_name: string;
    last_name: string;
    email: string;
    verified: number;
    verification: string | undefined;
    created: number;
    phone_number: string | undefined;
};

export type update_account_request_password_change = {
    password_change: string | undefined;
    id: string;
};

export type select_account_from_password_change = {
    password_change: string | undefined;
};

export type select_account_from_id = {
    id: string;
};

export type select_account_all = undefined;

export type update_account_request_email_change = {
    email_change: string | undefined;
    id: string;
};

export type update_account_change_username = {
    username: string;
    id: string;
};

export type select_db_get_version = undefined;

export type update_db_change_version = {
    version: undefined;
};

export type insert_db_init = {
    id: string;
    username: string;
    key: string;
    salt: string;
    first_name: string;
    last_name: string;
    email: string;
    password_change: string | undefined;
    picture: string | undefined;
    verified: number;
    verification: string | undefined;
    email_change: string | undefined;
    password_change_date: number | undefined;
    phone_number: string | undefined;
    created: number;
};
