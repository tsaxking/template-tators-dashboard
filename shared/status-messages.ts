export type StatusColor = 'success' | 'danger' | 'warning' | 'info';
export type StatusCode =
    | 100
    | 101
    | 102
    | 103
    | 200
    | 201
    | 202
    | 203
    | 204
    | 205
    | 206
    | 207
    | 208
    | 226
    | 300
    | 301
    | 302
    | 303
    | 304
    | 305
    | 306
    | 307
    | 308
    | 400
    | 401
    | 402
    | 403
    | 404
    | 405
    | 406
    | 407
    | 408
    | 409
    | 410
    | 411
    | 412
    | 413
    | 414
    | 415
    | 416
    | 417
    | 418
    | 421
    | 422
    | 423
    | 424
    | 425
    | 426
    | 428
    | 429
    | 431
    | 451
    | 500
    | 501
    | 502
    | 503
    | 504
    | 505
    | 506
    | 507
    | 508
    | 510
    | 511;
export type StatusMessage = {
    message: string;
    color: StatusColor;
    code: StatusCode;
    instructions: string;
    redirect?: string;
};

export const messages: {
    [key in StatusId]: StatusMessage;
} = {
    'account:already-logged-in': {
        message: 'You are already logged in.',
        color: 'danger',
        code: 400,
        instructions: 'Please log out.',
    },
    'account:cannot-edit-other-account': {
        message: 'You cannot edit or view information about another account',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'account:cannot-edit-self': {
        message: 'You cannot edit this part of your account presently',
        color: 'danger',
        code: 403,
        instructions: '',
    },
    'account:cannot-reject-verified': {
        message: 'You cannot reject a verified account',
        color: 'danger',
        code: 403,
        instructions: '',
    },
    'account:check-email': {
        message:
            'An email was sent to the email address associated with this account',
        color: 'info',
        code: 200,
        instructions: '',
    },
    'account:created': {
        message: 'Your account has been created.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the login page',
        redirect: '/account/sign-in',
    },
    'account:email-change-expired': {
        message: 'Your email change expired',
        color: 'danger',
        code: 400,
        instructions: 'Please retry changing your email address',
    },
    'account:email-taken': {
        message: 'That email is already taken.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another email.',
    },
    'account:has-role': {
        message: 'This account has this role already',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'account:incorrect-username-or-password': {
        message: 'Incorrect username or password.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'account:insufficient-permissions': {
        message: 'You do not have the permissions to send that request',
        color: 'danger',
        code: 403,
        instructions: '',
    },
    'account:invalid-email': {
        message: 'That email is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another email.',
    },
    'account:invalid-first-name': {
        message:
            'Your first name was invalid. It likely has characters that are not implemented yet.',
        color: 'danger',
        code: 400,
        instructions: 'Please fix the first name',
    },
    'account:invalid-last-name': {
        message:
            'Your last name was invalid. It likely has characters that are not implemented yet.',
        color: 'danger',
        code: 400,
        instructions: 'Please fix the last name',
    },
    'account:invalid-password': {
        message: 'That password is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another password.',
    },
    'account:invalid-password-reset-key': {
        message: 'Invalid password reset key.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'account:invalid-settings': {
        message: 'Your settings were invalid, please fix the data structure',
        color: 'danger',
        code: 406,
        instructions: '',
    },
    'account:invalid-username': {
        message: 'That username is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another username.',
    },
    'account:invalid-verification-key': {
        message: 'Invalid verification key.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'account:logged-in': {
        message: 'You have been logged in.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the home page.',
        redirect: '/home',
    },
    'account:logged-out': {
        message: 'You have been logged out.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the home page.',
        redirect: '/home',
    },
    'account:no-role': {
        message: 'This account does not have this role',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'account:not-found': {
        message: 'Account not found.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'account:not-logged-in': {
        message: 'You are not logged in.',
        color: 'danger',
        code: 400,
        instructions: 'Please log in.',
    },
    'account:not-verified': {
        message: 'Account is not verified',
        color: 'danger',
        code: 403,
        instructions: 'Please wait for your account to be verified',
    },
    'account:password-mismatch': {
        message: 'Passwords do not match.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'account:password-reset-request': {
        message: 'Password reset request has been sent to your email',
        color: 'success',
        code: 200,
        instructions:
            'Please follow the instructions in the email to reset your password.',
    },
    'account:password-reset-success': {
        message: 'The password associated with this account has been updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:picture-updated': {
        message: 'Added a picture to this account',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:removed': {
        message: 'Account has been removed.',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:role-added': {
        message: 'Added a role to this account',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:role-removed': {
        message: 'Removed a role from this account',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:server-error': {
        message: 'There was a server error.',
        color: 'danger',
        code: 500,
        instructions: 'Please try again.',
    },
    'account:settings-set': {
        message: 'Your settings have been successfully saved',
        color: 'success',
        code: 202,
        instructions: '',
    },
    'account:unverified': {
        message: 'Account has been unverified',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:updated': {
        message: 'Account has been updated.',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:username-changed': {
        message: 'The username associated with this account has changed',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'account:username-taken': {
        message: 'That username is already taken.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another username.',
    },
    'account:verified': {
        message: 'Account has been verified.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the home page.',
        redirect: '/home',
    },
    'admin:invalid-key': {
        message: 'Invalid key',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'discord:account-linked': {
        message: 'Your discord account has been linked to this account',
        color: 'success',
        code: 200,
        instructions: 'you cannot use team tators discord commands',
    },
    'discord:invalid-link': {
        message:
            'This discord link is invalid. You must generate a valid link using /connect',
        color: 'danger',
        code: 400,
        instructions: 'use connect in the discord server',
    },
    'discord:link-expired': {
        message: 'This discord link has expired, please try again.',
        color: 'danger',
        code: 400,
        instructions: 'please try again',
    },
    'event:update-properties': {
        message: 'Event properties updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'files:invalid': {
        message: 'Invalid file',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'files:invalid-extension': {
        message: 'Invalid file extension',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'files:no-files': {
        message: 'Request was empty',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'files:too-large': {
        message: 'File too large',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'files:too-many-files': {
        message: 'Too many files were uploaded',
        color: 'danger',
        code: 413,
        instructions: 'please upload fewer files',
    },
    'files:uploaded': {
        message: 'File uploaded',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'match:not-found': {
        message: 'Match was not found',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'match-comments:delete': {
        message: 'Match comment deleted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'match-comments:new': {
        message: 'Match comment saved',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'match-scouting:delete': {
        message: 'Deleted Match Scouting',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'match-scouting:new': {
        message: 'Match scouting submitted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:accepted': {
        message: 'This member was accepted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:add-skill': {
        message: 'Skill added',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:already-member': {
        message: 'This account is already a member',
        color: 'warning',
        code: 400,
        instructions: '',
    },
    'member:cannot-manage': {
        message: 'Cannot manage member',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'member:invalid-request': {
        message: 'Please send a valid request',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'member:membership-responded': {
        message: 'This membership request has already been responded to',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'member:not-found': {
        message: 'Member not found',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'member:not-member': {
        message: 'Not a member',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'member:rejected': {
        message: 'This member has been rejected',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:remove-skill': {
        message: 'Skill removed',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:request-sent': {
        message: 'Request sent',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:revoked': {
        message: 'This membership has been revoked',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:status-updated': {
        message: 'This member has been updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:update-bio': {
        message: 'Bio updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:update-resume': {
        message: 'Resume updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'member:update-title': {
        message: 'Title updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'page:not-found': {
        message: 'Page not found',
        color: 'danger',
        code: 404,
        instructions:
            'This page was not found. Please check your link and try again.',
    },
    'permissions:error': {
        message: 'Permissions error',
        color: 'danger',
        code: 401,
        instructions: '',
    },
    'permissions:forbidden': {
        message: 'Forbidden',
        color: 'danger',
        code: 403,
        instructions: '',
    },
    'permissions:invalid': {
        message: 'Invalid permissions',
        color: 'danger',
        code: 401,
        instructions: '',
    },
    'permissions:unauthorized': {
        message: 'Unauthorized',
        color: 'danger',
        code: 401,
        instructions: '',
    },
    'pit-scouting:delete': {
        message: 'Pit Scouting Submission has been deleted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'pit-scouting:new': {
        message: 'Pit Scouting Submitted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'profanity:detected': {
        message: 'Profanity detected',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'role:not-found': {
        message: 'Role was not found',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'roles:added': {
        message: 'Role added',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'roles:invalid-role': {
        message: 'Invalid role',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'roles:not-found': {
        message: 'Role not found',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'roles:removed': {
        message: 'Role removed',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:answer-not-found': {
        message: 'Answer was not found, nothing was changed',
        color: 'danger',
        code: 404,
        instructions:
            'please ensure you have selected a valid answer to update',
    },
    'scouting-question:new-answer': {
        message: 'New answer submitted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:new-group': {
        message: 'New group created',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:new-question': {
        message: 'New question created',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:new-section': {
        message: 'Section was created',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:update-section': {
        message: 'Section updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'scouting-question:updated-answer': {
        message: 'Answer updated',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'server:invalid-data': {
        message: 'Invalid data types received',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'server:unknown-server-error': {
        message:
            'There was an unknown error. If this persists, please contact an administrator/developer.',
        color: 'danger',
        code: 500,
        instructions: '',
    },
    'skills:added': {
        message: 'Skill added',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'skills:has-skill': {
        message: 'User already has skill',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'skills:invalid-skill': {
        message: 'Invalid skill',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'skills:not-found': {
        message: 'Skill not found',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'skills:removed': {
        message: 'Skill removed',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'spam:detected': {
        message: 'Spam detected',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.',
    },
    'strategy:delete': {
        message: 'Strategy deleted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'strategy:new': {
        message: 'Strategy submitted',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'test:fail': {
        message: 'This test failed',
        color: 'danger',
        code: 400,
        instructions: '',
    },
    'test:success': {
        message: 'This test was successful',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'unknown:error': {
        message: 'Unknown error',
        color: 'danger',
        code: 500,
        instructions: 'Please try again.',
    },
    'webhook:invalid-url': {
        message: 'Invalid url for webhook',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'webhook:not-found': {
        message: 'Webhook not found',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'whiteboard:created': {
        message: 'Whiteboard created successfully',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'whiteboard:deleted': {
        message: 'Whiteboard deleted successfully',
        color: 'success',
        code: 200,
        instructions: '',
    },
    'whiteboard:match-not-found': {
        message:
            'The match for the selected whiteboard was not found, please try again using different parameters',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'whiteboard:not-found': {
        message: 'Whiteboard was not found',
        color: 'danger',
        code: 404,
        instructions: '',
    },
    'whiteboard:update': {
        message: 'Whiteboard updated successfully',
        color: 'success',
        code: 200,
        instructions: '',
    },
};

export type StatusId =
    | 'account:already-logged-in'
    | 'account:cannot-edit-other-account'
    | 'account:cannot-edit-self'
    | 'account:cannot-reject-verified'
    | 'account:check-email'
    | 'account:created'
    | 'account:email-change-expired'
    | 'account:email-taken'
    | 'account:has-role'
    | 'account:incorrect-username-or-password'
    | 'account:insufficient-permissions'
    | 'account:invalid-email'
    | 'account:invalid-first-name'
    | 'account:invalid-last-name'
    | 'account:invalid-password'
    | 'account:invalid-password-reset-key'
    | 'account:invalid-settings'
    | 'account:invalid-username'
    | 'account:invalid-verification-key'
    | 'account:logged-in'
    | 'account:logged-out'
    | 'account:no-role'
    | 'account:not-found'
    | 'account:not-logged-in'
    | 'account:not-verified'
    | 'account:password-mismatch'
    | 'account:password-reset-request'
    | 'account:password-reset-success'
    | 'account:picture-updated'
    | 'account:removed'
    | 'account:role-added'
    | 'account:role-removed'
    | 'account:server-error'
    | 'account:settings-set'
    | 'account:unverified'
    | 'account:updated'
    | 'account:username-changed'
    | 'account:username-taken'
    | 'account:verified'
    | 'admin:invalid-key'
    | 'discord:account-linked'
    | 'discord:invalid-link'
    | 'discord:link-expired'
    | 'event:update-properties'
    | 'files:invalid'
    | 'files:invalid-extension'
    | 'files:no-files'
    | 'files:too-large'
    | 'files:too-many-files'
    | 'files:uploaded'
    | 'match-comments:delete'
    | 'match-comments:new'
    | 'match-scouting:delete'
    | 'match-scouting:new'
    | 'match:not-found'
    | 'member:accepted'
    | 'member:add-skill'
    | 'member:already-member'
    | 'member:cannot-manage'
    | 'member:invalid-request'
    | 'member:membership-responded'
    | 'member:not-found'
    | 'member:not-member'
    | 'member:rejected'
    | 'member:remove-skill'
    | 'member:request-sent'
    | 'member:revoked'
    | 'member:status-updated'
    | 'member:update-bio'
    | 'member:update-resume'
    | 'member:update-title'
    | 'page:not-found'
    | 'permissions:error'
    | 'permissions:forbidden'
    | 'permissions:invalid'
    | 'permissions:unauthorized'
    | 'pit-scouting:delete'
    | 'pit-scouting:new'
    | 'profanity:detected'
    | 'role:not-found'
    | 'roles:added'
    | 'roles:invalid-role'
    | 'roles:not-found'
    | 'roles:removed'
    | 'scouting-question:answer-not-found'
    | 'scouting-question:new-answer'
    | 'scouting-question:new-group'
    | 'scouting-question:new-question'
    | 'scouting-question:new-section'
    | 'scouting-question:update-section'
    | 'scouting-question:updated-answer'
    | 'server:invalid-data'
    | 'server:unknown-server-error'
    | 'skills:added'
    | 'skills:has-skill'
    | 'skills:invalid-skill'
    | 'skills:not-found'
    | 'skills:removed'
    | 'spam:detected'
    | 'strategy:delete'
    | 'strategy:new'
    | 'test:fail'
    | 'test:success'
    | 'unknown:error'
    | 'webhook:invalid-url'
    | 'webhook:not-found'
    | 'whiteboard:created'
    | 'whiteboard:deleted'
    | 'whiteboard:match-not-found'
    | 'whiteboard:not-found'
    | 'whiteboard:update';

export type AccountStatusId =
    | 'already-logged-in'
    | 'cannot-edit-other-account'
    | 'cannot-edit-self'
    | 'cannot-reject-verified'
    | 'check-email'
    | 'created'
    | 'email-change-expired'
    | 'email-taken'
    | 'has-role'
    | 'incorrect-username-or-password'
    | 'insufficient-permissions'
    | 'invalid-email'
    | 'invalid-first-name'
    | 'invalid-last-name'
    | 'invalid-password'
    | 'invalid-password-reset-key'
    | 'invalid-settings'
    | 'invalid-username'
    | 'invalid-verification-key'
    | 'logged-in'
    | 'logged-out'
    | 'no-role'
    | 'not-found'
    | 'not-logged-in'
    | 'not-verified'
    | 'password-mismatch'
    | 'password-reset-request'
    | 'password-reset-success'
    | 'picture-updated'
    | 'removed'
    | 'role-added'
    | 'role-removed'
    | 'server-error'
    | 'unverified'
    | 'updated'
    | 'username-changed'
    | 'username-taken'
    | 'verified'
    | 'settings-set';

export type AdminStatusId = 'invalid-key';

export type DiscordStatusId =
    | 'account-linked'
    | 'invalid-link'
    | 'link-expired';

export type EventStatusId = 'update-properties';

export type FilesStatusId =
    | 'invalid'
    | 'invalid-extension'
    | 'no-files'
    | 'too-large'
    | 'too-many-files'
    | 'uploaded';

export type MatchStatusId = 'not-found';

export type MatchcommentsStatusId =
    | 'delete'
    | 'new';

export type MatchscoutingStatusId =
    | 'delete'
    | 'new';

export type MemberStatusId =
    | 'accepted'
    | 'add-skill'
    | 'already-member'
    | 'cannot-manage'
    | 'invalid-request'
    | 'membership-responded'
    | 'not-found'
    | 'not-member'
    | 'rejected'
    | 'remove-skill'
    | 'request-sent'
    | 'revoked'
    | 'status-updated'
    | 'update-bio'
    | 'update-resume'
    | 'update-title';

export type PageStatusId = 'not-found';

export type PermissionsStatusId =
    | 'error'
    | 'forbidden'
    | 'invalid'
    | 'unauthorized';

export type PitscoutingStatusId =
    | 'delete'
    | 'new';

export type ProfanityStatusId = 'detected';

export type RoleStatusId = 'not-found';

export type RolesStatusId =
    | 'added'
    | 'invalid-role'
    | 'not-found'
    | 'removed';

export type ScoutingquestionStatusId =
    | 'answer-not-found'
    | 'new-answer'
    | 'new-group'
    | 'new-question'
    | 'new-section'
    | 'update-section'
    | 'updated-answer';

export type ServerStatusId =
    | 'invalid-data'
    | 'unknown-server-error';

export type SkillsStatusId =
    | 'added'
    | 'has-skill'
    | 'invalid-skill'
    | 'not-found'
    | 'removed';

export type SpamStatusId = 'detected';

export type StrategyStatusId =
    | 'delete'
    | 'new';

export type TestStatusId =
    | 'fail'
    | 'success';

export type UnknownStatusId = 'error';

export type WebhookStatusId =
    | 'invalid-url'
    | 'not-found';

export type WhiteboardStatusId =
    | 'created'
    | 'deleted'
    | 'match-not-found'
    | 'not-found'
    | 'update';
