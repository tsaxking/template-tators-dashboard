<script lang="ts">
import { onMount } from 'svelte';
import { capitalize, fromSnakeCase } from '../../../../shared/text';
export let title: string;
export let navItems: string[] = [];
import { Account } from '../../../models/account';
import { Modal } from '../../../utilities/modals';
import Settings from '../../pages/Settings.svelte';
import { AccountNotification } from '../../../models/account-notifications';
import AccountNotifications from './AccountNotifications.svelte';

export let active: string = '';

let account: Account = Account.guest;
let notifications: AccountNotification[] = [];
let showNotifications = false;
let unread: number;

$: unread = notifications.filter(n => !n.read).length;

export let accountLinks: (string | null)[] = [];

const openSettings = () => {
    const m = new Modal();
    const body = document.createElement('div');
    new Settings({
        target: body,
        props: {
            settings: []
        }
    });

    m.setTitle('Settings');
    m.setBody(body);
    m.show();
};

const initAccount = async () => {
    const a = await Account.getAccount();
    if (a.isOk() && a.value) {
        account = a.value;
        const n = await a.value.getNotifications();
        if (n.isOk()) {
            notifications = n.value;
        }
    }
};

onMount(() => {
    initAccount();
});
</script>

<nav
    class="navbar navbar-expand-lg fixed-top shadow text-light bg-dark d-flex justify-content-between"
    id="top-navbar"
>
    <div class="d-inline-flex p-0" style="height: 42px;">
        <button
            class="btn btn-dark border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar-nav"
            aria-controls="sidebar-nav"
        >
            <i class="bi bi-layout-sidebar"></i>
        </button>
        <a
            href="/home"
            class="ps-3 pt-2 navbar-brand fw-bold no-select h-100 align-middle text-light"
            >{title}</a
        >

        <div class="collapse navbar-collapse bg-dark rounded" id="nav-items">
            <ul class="navbar-nav mr-auto">
                {#each navItems as item}
                    <li class="nav-item">
                        <a
                            class="link-light {item === active
                                ? 'nav-link active'
                                : 'nav-link'}"
                            href="/{item}"
                        >
                            {capitalize(fromSnakeCase(item, '-'))}
                        </a>
                    </li>
                {/each}
            </ul>
            <div class="form-inline my-2 my-lg-0">
                <slot name="form" />
            </div>
        </div>
    </div>

    <div class="d-inline-flex p-0 align-items-center">
        <a
            class="nav-link dropdown-toggle me-3"
            href="#navbarDropdown"
            id="navbarDropdown-link"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            Hello, {account.username}&nbsp;
            {#if account.picture}
                <img
                    src="../uploads/${account.picture}"
                    class="profile-pic mx-1"
                    alt=""
                />
            {:else}
                <span class="material-icons">person</span>
            {/if}
        </a>
        <button
            type="button"
            class="btn btn-primary position-relative p-2 me-5"
            data-bs-toggle="offcanvas"
            data-bs-target="#notifications-offcanvas"
            aria-controls="notifications-offcanvas"
            on:click="{() => {
                showNotifications = !showNotifications;
            }}"
        >
            <i class="material-icons"> notifications </i>
            {#if !!unread}
                <span
                    class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                    {unread}
                </span>
            {/if}
        </button>
        <ul
            class="dropdown-menu dropdown-menu-end p-0"
            aria-labelledby="navbarDropdown"
            id="navbarDropdown"
        >
            <li>
                <a
                    href="javascript:void(0);"
                    class="dropdown-item"
                    on:click="{openSettings}"
                >
                    <i class="material-icons">settings</i>&nbsp;Settings
                </a>
            </li>
            {#each accountLinks as link}
                {#if link}
                    <li>
                        <a href="{link}" class="dropdown-item"
                            >{capitalize(fromSnakeCase(link, '-'))}</a
                        >
                    </li>
                {:else}
                    <li><hr class="dropdown-divider" /></li>
                {/if}
            {/each}

            <!-- <li><a href="/institution/new" class="dropdown-item">Create Institution <span class="material-icons">home</span></a></li> -->
            <!-- <li><a class="dropdown-item" href="/my-account">My Account</a></li> -->
            <!-- <li>
            <hr class="dropdown-divider">
        </li> -->
            <li class="p-1">
                <a class="dropdown-item" href="/account/sign-out">Sign Out</a>
            </li>
        </ul>
        <button
            class="btn btn-dark navbar-toggler border-0 h-100 text-light"
            type="button"
            data-bs-toggle="collapse"
            aria-controls="nav-items"
            data-bs-target="#nav-items"
            aria-expanded="false"
        >
            <i class="bi bi-box-arrow-up-left"></i>
        </button>
    </div>
</nav>

<AccountNotifications {notifications} />
