import { Command } from '../discord';
import { DB } from '../../databases';
import { uuid } from '../../uuid';
import env from '../../env';

export default {
    name: 'connect',
    description: 'Connect your Discord account to your Minecraft account.',
    execute: async interaction => {
        // const discordId = interaction.member?.user.id;
        // if (discordId) {
        //     const a = DB.get('account/from-discord-id', {
        //         discordId
        //     });
        //     if (a) {
        //         return interaction.reply('Your account is already connected.');
        //     }
        //     const key = uuid();
        //     DB.run('discord/insert', {
        //         id: discordId,
        //         key,
        //         date: Date.now().toString()
        //     });
        //     interaction.member?.user.send(
        //         `Your link is generated, please go to: ${env.DOMAIN}/api/discord/link/${key}`
        //     );
        // } else {
        //     interaction.reply('You must be logged in to use this command.');
        // }
    }
} as Command;
