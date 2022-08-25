import {
    SlashCommandBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    SelectMenuBuilder,
    Interaction,
    GuildMember
} from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('color')
    .setDescription('Toggle a color role');

const command = async (interaction: Interaction): Promise<void> => {
    if (interaction.isChatInputCommand()) {
        if (!interaction.guild) {
            await interaction.reply('This command can only be used in a guild');
            return;
        }
        const roles = interaction.guild.roles.cache;
        const colorRoles = [];
        for (const role of roles.values()) {
            if (role.name.startsWith('color-')) {
                colorRoles.push(role);
            }
        }
        if (colorRoles.length === 0) {
            await interaction.reply('There are no color roles in this server');
            return;
        }
        colorRoles.sort((a, b) => a.comparePositionTo(b));
        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('color$select')
                    .addOptions(...colorRoles.map(role => ({
                        label: role.name,
                        value: role.id
                    })))
            );
        const embed = new EmbedBuilder()
            .addFields({
                name: 'Color roles:',
                value: colorRoles.map(role => `<@&${role.id}>`).join('\n')
            })
            .toJSON();
        await interaction.reply({components: [row as any], embeds: [embed]});
    } else if (interaction.isSelectMenu() && interaction.customId === 'color$select') {
        const resultRoleID = interaction.values[0];
        if (!(interaction.member instanceof GuildMember)) return;
        const userRoles = interaction.member.roles;
        if (userRoles.cache.has(resultRoleID)) {
            await userRoles.remove(resultRoleID);
        } else {
            await userRoles.add(resultRoleID);
        }

        await interaction.update(`Toggled role <@&${resultRoleID}>`);
    }
};

export default {data, command};
