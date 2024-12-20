<<<<<<< HEAD
import { read } from 'fs';
=======
import { EventEmitter } from '../../shared/event-emitter';
import { Cache } from './cache';
import { AccountSafe, Role as R, RolePermission } from '../../shared/db-types';
import { attemptAsync, Result } from '../../shared/check';
import { ServerRequest } from '../utilities/requests';
import { Role } from './roles';
>>>>>>> 048907bc93d45ebbcced368d851f649e5127a4a7
import { socket } from '../utilities/socket';
import { Data, StructData, Struct, SingleWritable, Structable } from './struct';
import { Blank } from '../../shared/struct';
import { attemptAsync } from '../../shared/check';
import { Writable } from 'svelte/store';

export namespace Accounts {
    export const Account = new Struct({
        name: 'Account',
        socket,
        structure: {
            username: 'text',
            key: 'text',
            salt: 'text',
            firstName: 'text',
            lastName: 'text',
            email: 'text',
            picture: 'text',
            verified: 'boolean',
            verification: 'text'
        }
    });

    export type AccountData = StructData<typeof Account.data.structure>;

    export const self = new SingleWritable(
        Account.Generator({
            username: 'guest',
            firstName: 'Guest',
            lastName: 'Guest',
            key: '',
            salt: '',
            email: '',
            picture: '',
            verified: false,
            verification: ''
        })
    );

<<<<<<< HEAD
    export const DiscordLink = new Struct({
        name: 'DiscordLink',
        socket,
        structure: {
            discordID: 'text',
            account: 'text'
=======
    private static requested: string[] = [];

    public static async get(
        ids: (string | undefined)[]
    ): Promise<(Account | undefined)[]> {
        const output = new Array<Account | undefined>(ids.length).fill(
            undefined
        );
        const toRequest = new Set<string>();
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            if (!id) continue;
            if (Account.cache.has(id) || Account.requested.includes(id)) {
                output[i] = Account.cache.get(id);
            } else {
                toRequest.add(id);
            }
        }

        if (toRequest.size) {
            Account.requested.push(...Array.from(toRequest));
            const res = await ServerRequest.post<(AccountSafe | undefined)[]>(
                '/account/account-info',
                {
                    ids: Array.from(toRequest)
                }
            );

            if (res.isOk()) {
                for (const i in res.value) {
                    const account = res.value[i];
                    if (!account) continue;
                    const a = new Account(account);
                    output[i] = a;
                }
            }
        }

        return output;
    }

    /**
     * Account emitter
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @static
     * @readonly
     * @type {*}
     */
    public static readonly emitter = new EventEmitter<Events>();

    get name() {
        return `${this.firstName} ${this.lastName}`;
    }

    /**
     * adds a listener to the account emitter
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @static
     * @template {keyof Events} T
     * @param {T} event
     * @param {(data: Events[T]) => void} listener
     * @returns {void) => void}
     */
    public static on<T extends keyof Events>(
        event: T,
        listener: (data: Events[T]) => void
    ) {
        this.emitter.on(event, listener);
    }

    /**
     *  removes a listener from the account emitter
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @static
     * @template {keyof Events} T
     * @param {T} event
     * @param {(data: Events[T]) => void} listener
     * @returns {void) => void}
     */
    public static off<T extends keyof Events>(
        event: T,
        listener: (data: Events[T]) => void
    ) {
        this.emitter.off(event, listener);
    }

    /**
     * emits an event from the account emitter
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @static
     * @template {keyof Events} T
     * @param {T} event
     * @param {Events[T]} data
     */
    public static emit<T extends keyof Events>(event: T, data: Events[T]) {
        this.emitter.emit(event, data);
    }

    /**
     * adds a listener to the account emitter that only triggers once
     * @date 2/8/2024 - 4:22:42 PM
     *
     * @public
     * @static
     * @template {keyof Events} T
     * @param {T} event
     * @param {(data: Events[T]) => void} listener
     * @returns {void) => void}
     */
    public static once<T extends keyof Events>(
        event: T,
        listener: (data: Events[T]) => void
    ) {
        this.emitter.once(event, listener);
    }

    /**
     * Gets all accounts
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @static
     * @async
     * @returns {Promise<Result<Account[]>>}
     */
    public static async all(): Promise<Result<Account[]>> {
        return attemptAsync(async () => {
            if (Account.cache.size > 1) {
                // guest account is included
                return Array.from(Account.cache.values());
            }

            const res = await ServerRequest.post<AccountSafe[]>('/account/all');

            if (res.isOk()) {
                return res.value.map(account => new Account(account));
            }

            throw res.error;
        });
    }

    /**
     * Account id
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @readonly
     * @type {string}
     */
    public readonly id: string;
    /**
     * Account username
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {string}
     */
    public username: string;
    /**
     * Account first name
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {string}
     */
    public firstName: string;
    /**
     * Account last name
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {string}
     */
    public lastName: string;
    /**
     * Account email
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {string}
     */
    public email: string;
    /**
     * Account verification status
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {(0 | 1)}
     */
    public verified: 0 | 1;
    /**
     * Account creation date
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {number}
     */
    public created: number;
    /**
     * Account phone number
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {string}
     */
    public phoneNumber: string;
    /**
     * Account picture
     * @date 2/1/2024 - 12:54:21 AM
     *
     * @public
     * @type {?string}
     */
    public picture?: string;

    /**
     * Creates an instance of Account.
     * @date 2/1/2024 - 12:54:20 AM
     *
     * @constructor
     * @param {AccountSafe} data
     */
    constructor(data: AccountSafe) {
        super();
        this.id = data.id;
        this.username = data.username;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.verified = data.verified ? 1 : 0;
        this.created = data.created;
        this.phoneNumber = data.phoneNumber;
        this.picture = data.picture;

        if (Account.cache.has(this.id)) {
            Account.cache.delete(this.id);
>>>>>>> 048907bc93d45ebbcced368d851f649e5127a4a7
        }
    });

    export const PasswordChange = new Struct({
        name: 'PasswordChange',
        socket,
        structure: {
            account: 'text',
            key: 'text'
        }
    });

    export const EmailChange = new Struct({
        name: 'EmailChange',
        socket,
        structure: {
            account: 'text',
            email: 'text',
            key: 'text',

            expires: 'text'
        }
    });

    export const Notification = new Struct({
        name: 'Notification',
        socket,
        structure: {
            accountId: 'text',
            type: 'text',
            data: 'text',
            read: 'boolean',
            message: 'text',
            title: 'text'
        }
    });

    export type NotificationData = StructData<
        typeof Notification.data.structure
    >;

    export const Settings = new Struct({
        name: 'Settings',
        socket,
        structure: {
            accountId: 'text',
            key: 'text',
            value: 'text'
        }
    });

    export type SettingsData = StructData<typeof Settings.data.structure>;

    export const signIn = (username: string, password: string) => {
        return Account.post('/sign-in', { username, password });
    };

    export const signUp = (data: {
        username: string;
        password: string;
        confirmPassword: string;
        email: string;
        firstName: string;
        lastName: string;
        // phoneNumber: string;
    }) => {
        return Account.post('/sign-up', data);
    };

    export const signOut = () => {
        return attemptAsync(async () => {
            (await Account.post('/sign-out', {})).unwrap();
            self.set(
                Account.Generator({
                    username: 'guest',
                    firstName: 'Guest',
                    lastName: 'Guest',
                    key: '',
                    salt: '',
                    email: '',
                    picture: '',
                    verified: false,
                    verification: ''
                })
            );
        });
    };

    export const getSelf = () => {
        return attemptAsync(async () => {
            if (self.get().data.username !== 'guest') return self;

            const a = (
                await Account.post<Structable<typeof Account.data.structure>>(
                    '/self',
                    {}
                )
            ).unwrap();
            self.set(Account.Generator(a));

            return self;
        });
    };

    export const requestPasswordReset = (username: string) => {
        return Account.post('/request-password-reset', {
            username
        });
    };

    export const changePassword = (
        password: string,
        confirmPassword: string,
        key: string
    ) => {
        return Account.post('/change-password', {
            password,
            confirmPassword,
            key
        });
    };
}
<<<<<<< HEAD
=======

Object.assign(window, {
    Account
});

socket.on('account:removed', (accountId: string) => {
    const account = Account.cache.get(accountId);
    Account.cache.delete(accountId);
    if (account) {
        console.log('account removed', account);
        Account.emit('delete', account);
        Account.cache.delete(accountId);
        account.emit('delete', undefined);
        account.destroy();
    }
});

socket.on('account:created', (account: AccountSafe) => {
    const a = new Account(account);
    Account.emit('new', a);
});

socket.on(
    'account:role-removed',
    async (data: { accountId: string; roleId: string }) => {
        const { accountId, roleId } = data;
        const account = Account.cache.get(accountId);
        if (account) {
            await account.getRoles(true); // force update

            account.emit('update', undefined);
            account.emit('role-removed', roleId);
            Account.emit('update', account);
        }
    }
);

socket.on(
    'account:role-added',
    async (data: { accountId: string; roleId: string }) => {
        const { accountId, roleId } = data;
        const account = Account.cache.get(accountId);
        if (account) {
            await account.getRoles(true); // force update

            account.emit('update', undefined);
            account.emit('role-added', roleId);
            Account.emit('update', account);
        }
    }
);

socket.on('account:verified', (accountId: string) => {
    const account = Account.cache.get(accountId);
    if (account) {
        account.verified = 1;
        account.emit('verified', account);
        account.emit('update', undefined);
        Account.emit('update', account);
    }
});

socket.on('account:unverified', (accountId: string) => {
    const account = Account.cache.get(accountId);
    if (account) {
        account.verified = 0;
        account.emit('unverified', account);
        account.emit('update', undefined);
        Account.emit('update', account);
    }
});
>>>>>>> 048907bc93d45ebbcced368d851f649e5127a4a7
