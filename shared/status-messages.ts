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
        instructions: 'Please log out.'
    },
    'account:cannot-edit-other-account': {
        message: 'You cannot edit or view information about another account',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'account:cannot-edit-self': {
        message: 'You cannot edit this part of your account presently',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'account:cannot-reject-verified': {
        message: 'You cannot reject a verified account',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'account:cannot-reset-guest': {
        message: 'Cannot reset guest account information',
        color: 'danger',
        code: 401,
        instructions: ''
    },
    'account:check-email': {
        message:
            'An email was sent to the email address associated with this account',
        color: 'info',
        code: 200,
        instructions: ''
    },
    'account:created': {
        message: 'Your account has been created.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the login page',
        redirect: '/account/sign-in'
    },
    'account:email-change-expired': {
        message: 'Your email change expired',
        color: 'danger',
        code: 400,
        instructions: 'Please retry changing your email address'
    },
    'account:email-taken': {
        message: 'That email is already taken.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another email.'
    },
    'account:has-role': {
        message: 'This account has this role already',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'account:incorrect-username-or-password': {
        message: 'Your username or password was incorrect, please try again',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'account:insufficient-permissions': {
        message: 'You do not have the permissions to send that request',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'account:invalid-email': {
        message: 'That email is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another email.'
    },
    'account:invalid-first-name': {
        message:
            'Your first name was invalid. It likely has characters that are not implemented yet.',
        color: 'danger',
        code: 400,
        instructions: 'Please fix the first name'
    },
    'account:invalid-last-name': {
        message:
            'Your last name was invalid. It likely has characters that are not implemented yet.',
        color: 'danger',
        code: 400,
        instructions: 'Please fix the last name'
    },
    'account:invalid-password': {
        message: 'That password is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another password.'
    },
    'account:invalid-password-reset-key': {
        message: 'Invalid password reset key.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'account:invalid-settings': {
        message: 'Your settings were invalid, please fix the data structure',
        color: 'danger',
        code: 406,
        instructions: ''
    },
    'account:invalid-username': {
        message: 'That username is invalid.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another username.'
    },
    'account:invalid-verification-key': {
        message: 'Invalid verification key.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'account:logged-in': {
        message: 'You have been logged in.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the home page.'
    },
    'account:logged-out': {
        message: 'You have been logged out.',
        color: 'success',
        code: 200,
        instructions: 'You will be redirected to the home page.',
        redirect: '/home'
    },
    'account:no-role': {
        message: 'This account does not have this role',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'account:not-found': {
        message: 'Account not found.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'account:not-logged-in': {
        message: 'You are not logged in.',
        color: 'danger',
        code: 400,
        instructions: 'Please log in.'
    },
    'account:not-verified': {
        message: 'Account is not verified',
        color: 'danger',
        code: 403,
        instructions: 'Please wait for your account to be verified'
    },
    'account:password-mismatch': {
        message: 'Passwords do not match.',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'account:password-reset-request': {
        message: 'Password reset request has been sent to your email',
        color: 'success',
        code: 200,
        instructions:
            'Please follow the instructions in the email to reset your password.'
    },
    'account:password-reset-success': {
        message: 'The password associated with this account has been updated',
        color: 'success',
        code: 200,
        instructions: '',
        redirect: '/account/sign-in'
    },
    'account:picture-updated': {
        message: 'Added a picture to this account',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:please-change-password': {
        message: 'Your password is out of date, please change it',
        color: 'warning',
        code: 400,
        instructions: ''
    },
    'account:removed': {
        message: 'Account has been removed.',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:role-added': {
        message: 'Added a role to this account',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:role-removed': {
        message: 'Removed a role from this account',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:server-error': {
        message: 'There was a server error.',
        color: 'danger',
        code: 500,
        instructions: 'Please try again.'
    },
    'account:settings-set': {
        message: 'Your settings have been successfully saved',
        color: 'success',
        code: 202,
        instructions: ''
    },
    'account:unverified': {
        message: 'Account has been unverified',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:updated': {
        message: 'Account has been updated.',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:username-changed': {
        message: 'The username associated with this account has changed',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account:username-taken': {
        message: 'That username is already taken.',
        color: 'danger',
        code: 400,
        instructions: 'Please try another username.'
    },
    'account:verified': {
        message: 'Account has been verified.',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account-notification:deleted': {
        message: 'Notification deleted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account-notification:mark-read': {
        message: 'Account notification was marked read',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account-notification:mark-unread': {
        message: 'Account notification was marked unread',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'account-notification:not-found': {
        message: 'Did not find the requested account notification',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'account-notification:not-owner': {
        message: 'You cannot alter this notification as you are not the owner',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'admin:invalid-key': {
        message: 'Invalid key',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'discord:account-linked': {
        message: 'Your discord account has been linked to this account',
        color: 'success',
        code: 200,
        instructions: 'you cannot use team tators discord commands'
    },
    'discord:invalid-link': {
        message:
            'This discord link is invalid. You must generate a valid link using /connect',
        color: 'danger',
        code: 400,
        instructions: 'use connect in the discord server'
    },
    'discord:link-expired': {
        message: 'This discord link has expired, please try again.',
        color: 'danger',
        code: 400,
        instructions: 'please try again'
    },
    'event:invalid-key': {
        message: 'Invalid event key',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'event:update-properties': {
        message: 'Event properties updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'files:invalid': {
        message: 'Invalid file',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'files:invalid-extension': {
        message: 'Invalid file extension',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'files:no-files': {
        message: 'Request was empty',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'files:too-large': {
        message: 'File too large',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'files:too-many-files': {
        message: 'Too many files were uploaded',
        color: 'danger',
        code: 413,
        instructions: 'please upload fewer files'
    },
    'files:unknown-error': {
        message: 'Unknown file uploading error',
        color: 'danger',
        code: 500,
        instructions: ''
    },
    'files:uploaded': {
        message: 'File uploaded',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'match:not-found': {
        message: 'Match was not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'match-comments:delete': {
        message: 'Match comment deleted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'match-comments:new': {
        message: 'Match comment saved',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'match-scouting:delete': {
        message: 'Deleted Match Scouting',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'match-scouting:new': {
        message: 'Match scouting submitted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:accepted': {
        message: 'This member was accepted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:add-skill': {
        message: 'Skill added',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:already-member': {
        message: 'This account is already a member',
        color: 'warning',
        code: 400,
        instructions: ''
    },
    'member:cannot-manage': {
        message: 'Cannot manage member',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'member:invalid-request': {
        message: 'Please send a valid request',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'member:membership-responded': {
        message: 'This membership request has already been responded to',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'member:not-found': {
        message: 'Member not found',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'member:not-member': {
        message: 'Not a member',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'member:rejected': {
        message: 'This member has been rejected',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:remove-skill': {
        message: 'Skill removed',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:request-sent': {
        message: 'Request sent',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:revoked': {
        message: 'This membership has been revoked',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:status-updated': {
        message: 'This member has been updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:update-bio': {
        message: 'Bio updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:update-resume': {
        message: 'Resume updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'member:update-title': {
        message: 'Title updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'page:not-found': {
        message: 'Page not found',
        color: 'danger',
        code: 404,
        instructions:
            'This page was not found. Please check your link and try again.'
    },
    'permissions:added': {
        message: 'Added permission to role',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'permissions:error': {
        message: 'Permissions error',
        color: 'danger',
        code: 401,
        instructions: ''
    },
    'permissions:forbidden': {
        message: 'Forbidden',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'permissions:invalid': {
        message: 'Invalid permissions',
        color: 'danger',
        code: 401,
        instructions: ''
    },
    'permissions:not-found': {
        message: 'Permission not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'permissions:removed': {
        message: 'Removed permissions from role',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'permissions:unauthorized': {
        message: 'Unauthorized',
        color: 'danger',
        code: 401,
        instructions: ''
    },
    'pit-scouting:delete': {
        message: 'Pit Scouting Submission has been deleted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'pit-scouting:new': {
        message: 'Pit Scouting Submitted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'profanity:detected': {
        message: 'Profanity detected',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'role:not-found': {
        message: 'Role was not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'roles:added': {
        message: 'Role added',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:added-permission': {
        message: 'Permission added to role',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:already-exists': {
        message: 'Role already exists',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'roles:cannot-edit-admin': {
        message: 'Cannot edit admin role',
        color: 'danger',
        code: 403,
        instructions: ''
    },
    'roles:deleted': {
        message: 'Role deleted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:invalid-role': {
        message: 'Invalid role',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'roles:new': {
        message: 'Role created',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:not-found': {
        message: 'Role not found',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'roles:removed': {
        message: 'Role removed',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:removed-permission': {
        message: 'Permission removed from role',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'roles:updated': {
        message: 'Role updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:answer-deleted': {
        message: 'Answer has been archived',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:answer-not-found': {
        message: 'Answer was not found, nothing was changed',
        color: 'danger',
        code: 404,
        instructions: 'please ensure you have selected a valid answer to update'
    },
    'scouting-question:group-deleted': {
        message: 'Group has been archived',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:group-updated': {
        message: 'Group has been updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:new-answer': {
        message: 'New answer submitted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:new-group': {
        message: 'New group created',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:new-question': {
        message: 'New question created',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:new-section': {
        message: 'Section was created',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:question-deleted': {
        message: 'Question has been archived',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:question-not-found': {
        message: 'The question was not found, please try again',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'scouting-question:question-updated': {
        message: 'Question updated successfully',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:questions-already-exist': {
        message: 'The questions have already been copied',
        color: 'danger',
        code: 412,
        instructions: ''
    },
    'scouting-question:questions-copied': {
        message: 'Questions copied from event',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:section-deleted': {
        message: 'Section has been archived',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:update-answer': {
        message: 'Answer Updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:update-section': {
        message: 'Section updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'scouting-question:updated-answer': {
        message: 'Answer updated',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'server:invalid-data': {
        message: 'Invalid data types received',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'server:not-implemented': {
        message: "This request's handler has not been implemented yet.",
        color: 'warning',
        code: 501,
        instructions: ''
    },
    'server:unknown-server-error': {
        message:
            'There was an unknown error. If this persists, please contact an administrator/developer.',
        color: 'danger',
        code: 500,
        instructions: ''
    },
    'session:rate-limited': {
        message: 'You are being rate limited',
        color: 'warning',
        code: 418,
        instructions: ''
    },
    'skills:added': {
        message: 'Skill added',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'skills:has-skill': {
        message: 'User already has skill',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'skills:invalid-skill': {
        message: 'Invalid skill',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'skills:not-found': {
        message: 'Skill not found',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'skills:removed': {
        message: 'Skill removed',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'spam:detected': {
        message: 'Spam detected',
        color: 'danger',
        code: 400,
        instructions: 'Please try again.'
    },
    'strategy:delete': {
        message: 'Strategy deleted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'strategy:new': {
        message: 'Strategy submitted',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'strategy:not-found': {
        message: 'Strategy not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'tba:invalid-path': {
        message: 'Invalid path when accessing TBA data',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'tba:not-updated': {
        message:
            'the blue alliance has not updated yet, please try again later',
        color: 'warning',
        code: 404,
        instructions: ''
    },
    'team-comment:new': {
        message: 'Created a new comment',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'teams:pictures-uploaded': {
        message: "Team's picture was uploaded successfully",
        color: 'success',
        code: 200,
        instructions: ''
    },
    'test:fail': {
        message: 'This test failed',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'test:success': {
        message: 'This test was successful',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'trace:year-not-supported': {
        message: 'This year is not yet supported',
        color: 'danger',
        code: 400,
        instructions: ''
    },
    'unknown:error': {
        message: 'Unknown error',
        color: 'danger',
        code: 500,
        instructions: 'Please try again.'
    },
    'webhook:invalid-url': {
        message: 'Invalid url for webhook',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'webhook:not-found': {
        message: 'Webhook not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'webhook:rate-limit': {
        message: 'Please do not send more than 1 request per minute',
        color: 'danger',
        code: 429,
        instructions: ''
    },
    'whiteboard:created': {
        message: 'Whiteboard created successfully',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'whiteboard:deleted': {
        message: 'Whiteboard deleted successfully',
        color: 'success',
        code: 200,
        instructions: ''
    },
    'whiteboard:match-not-found': {
        message:
            'The match for the selected whiteboard was not found, please try again using different parameters',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'whiteboard:not-found': {
        message: 'Whiteboard was not found',
        color: 'danger',
        code: 404,
        instructions: ''
    },
    'whiteboard:update': {
        message: 'Whiteboard updated successfully',
        color: 'success',
        code: 200,
        instructions: ''
    }
};

export type StatusId =
    | 'account-notification:deleted'
    | 'account-notification:mark-read'
    | 'account-notification:mark-unread'
    | 'account-notification:not-found'
    | 'account-notification:not-owner'
    | 'account:already-logged-in'
    | 'account:cannot-edit-other-account'
    | 'account:cannot-edit-self'
    | 'account:cannot-reject-verified'
    | 'account:cannot-reset-guest'
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
    | 'account:please-change-password'
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
    | 'account-notification:deleted'
    | 'account-notification:mark-read'
    | 'account-notification:mark-unread'
    | 'account-notification:not-found'
    | 'account-notification:not-owner'
    | 'admin:invalid-key'
    | 'discord:account-linked'
    | 'discord:invalid-link'
    | 'discord:link-expired'
    | 'event:invalid-key'
    | 'event:update-properties'
    | 'files:invalid'
    | 'files:invalid-extension'
    | 'files:no-files'
    | 'files:too-large'
    | 'files:too-many-files'
    | 'files:unknown-error'
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
    | 'permissions:added'
    | 'permissions:error'
    | 'permissions:forbidden'
    | 'permissions:invalid'
    | 'permissions:not-found'
    | 'permissions:removed'
    | 'permissions:unauthorized'
    | 'pit-scouting:delete'
    | 'pit-scouting:new'
    | 'profanity:detected'
    | 'role:not-found'
    | 'roles:added'
    | 'roles:added-permission'
    | 'roles:already-exists'
    | 'roles:cannot-edit-admin'
    | 'roles:deleted'
    | 'roles:invalid-role'
    | 'roles:new'
    | 'roles:not-found'
    | 'roles:removed'
    | 'roles:removed-permission'
    | 'roles:updated'
    | 'scouting-question:answer-deleted'
    | 'scouting-question:answer-not-found'
    | 'scouting-question:group-deleted'
    | 'scouting-question:group-updated'
    | 'scouting-question:new-answer'
    | 'scouting-question:new-group'
    | 'scouting-question:new-question'
    | 'scouting-question:new-section'
    | 'scouting-question:question-deleted'
    | 'scouting-question:question-not-found'
    | 'scouting-question:question-updated'
    | 'scouting-question:questions-already-exist'
    | 'scouting-question:questions-copied'
    | 'scouting-question:section-deleted'
    | 'scouting-question:update-answer'
    | 'scouting-question:update-section'
    | 'scouting-question:updated-answer'
    | 'server:invalid-data'
    | 'server:not-implemented'
    | 'server:unknown-server-error'
    | 'session:rate-limited'
    | 'skills:added'
    | 'skills:has-skill'
    | 'skills:invalid-skill'
    | 'skills:not-found'
    | 'skills:removed'
    | 'spam:detected'
    | 'strategy:delete'
    | 'strategy:new'
    | 'strategy:not-found'
    | 'tba:invalid-path'
    | 'tba:not-updated'
    | 'team-comment:new'
    | 'teams:pictures-uploaded'
    | 'test:fail'
    | 'test:success'
    | 'trace:year-not-supported'
    | 'unknown:error'
    | 'webhook:invalid-url'
    | 'webhook:not-found'
    | 'webhook:rate-limit'
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
    | 'cannot-reset-guest'
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
    | 'please-change-password'
    | 'removed'
    | 'role-added'
    | 'role-removed'
    | 'server-error'
    | 'settings-set'
    | 'unverified'
    | 'updated'
    | 'username-changed'
    | 'username-taken'
    | 'verified';

export type AdminStatusId = 'invalid-key';

export type DiscordStatusId =
    | 'account-linked'
    | 'invalid-link'
    | 'link-expired';

export type EventStatusId = 'invalid-key' | 'update-properties';

export type FilesStatusId =
    | 'invalid'
    | 'invalid-extension'
    | 'no-files'
    | 'too-large'
    | 'too-many-files'
    | 'unknown-error'
    | 'uploaded';

export type MatchStatusId = 'not-found';

export type MatchCommentsStatusId = 'delete' | 'new';

export type MatchScoutingStatusId = 'delete' | 'new';

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
    | 'added'
    | 'error'
    | 'forbidden'
    | 'invalid'
    | 'not-found'
    | 'removed'
    | 'unauthorized';

export type PitScoutingStatusId = 'delete' | 'new';

export type ProfanityStatusId = 'detected';

export type RoleStatusId = 'not-found';

export type RolesStatusId =
    | 'added'
    | 'added-permission'
    | 'already-exists'
    | 'cannot-edit-admin'
    | 'deleted'
    | 'invalid-role'
    | 'new'
    | 'not-found'
    | 'removed'
    | 'removed-permission'
    | 'updated';
export type ScoutingQuestionStatusId =
    | 'answer-deleted'
    | 'answer-not-found'
    | 'group-deleted'
    | 'group-updated'
    | 'new-answer'
    | 'new-group'
    | 'new-question'
    | 'new-section'
    | 'question-deleted'
    | 'question-not-found'
    | 'question-updated'
    | 'questions-already-exist'
    | 'questions-copied'
    | 'section-deleted'
    | 'update-answer'
    | 'update-section'
    | 'updated-answer';

export type ServerStatusId =
    | 'invalid-data'
    | 'not-implemented'
    | 'unknown-server-error';

export type SessionStatusId = 'rate-limited';

export type SkillsStatusId =
    | 'added'
    | 'has-skill'
    | 'invalid-skill'
    | 'not-found'
    | 'removed';

export type SpamStatusId = 'detected';

export type StrategyStatusId = 'delete' | 'new' | 'not-found';

export type TbaStatusId = 'invalid-path' | 'not-updated';

export type TeamCommentStatusId = 'new';

export type TeamsStatusId = 'pictures-uploaded';

export type TestStatusId = 'fail' | 'success';

export type TraceStatusId = 'year-not-supported';

export type UnknownStatusId = 'error';

export type WebhookStatusId = 'invalid-url' | 'not-found' | 'rate-limit';

export type WhiteboardStatusId =
    | 'created'
    | 'deleted'
    | 'match-not-found'
    | 'not-found'
    | 'update';
