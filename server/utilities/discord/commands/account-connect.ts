import { Command } from '../discord';

export default {
    name: 'ping',
    description: 'Ping the bot.',
    execute: async interaction => {
        interaction.reply('Pong!');
    }
} as Command;
