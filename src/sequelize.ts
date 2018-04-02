import * as Sequelize from 'sequelize';
const config = require('../config.json');

export const sequelize = new Sequelize(config.sequelize);

export interface ISequelizeBaseType {
  createdAt: Date;
  updatedAt: Date;
}

export interface IDBMember extends ISequelizeBaseType {
  id: string;
  name: string;
}

export const members = sequelize.define<any, any>('member', {
  id: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING
});

export interface IDBGuild extends ISequelizeBaseType {
  id: string;
  name: string;
  icon: string;
}

export const guilds = sequelize.define<any, any>('guild', {
  id: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  icon: Sequelize.STRING,
});

export enum SettingsKeys {
  PREFIX = 'prefix',
  JOIN_MESSAGE_CHANNEL = 'joinMessageChannel',
  LANG = 'lang',
  MOD_ROLE = 'modRole',
  MOD_CHANNEL = 'modChannel',
}

export const settings = sequelize.define<any, any>('setting',
  {
    key: Sequelize.ENUM(
      SettingsKeys.PREFIX,
      SettingsKeys.JOIN_MESSAGE_CHANNEL,
      SettingsKeys.LANG,
      SettingsKeys.MOD_ROLE,
      SettingsKeys.MOD_CHANNEL,
    ),
    value: Sequelize.STRING,
  }, {
    indexes: [{
      unique: true,
      fields: ['guildId', 'key']
    }],
  }
);
settings.belongsTo(guilds);

export interface IDBInviteCode extends ISequelizeBaseType {
  id: number;
  exactMatch: string;
  possibleMatches: string;
  guildId: string;
  memberId: string;
}

export const inviteCodes = sequelize.define<any, any>('inviteCode', {
  code: { type: Sequelize.STRING, primaryKey: true },
  channelId: Sequelize.STRING,
  isNative: Sequelize.BOOLEAN,
  reason: Sequelize.STRING,
  maxAge: Sequelize.INTEGER,
  maxUses: Sequelize.INTEGER,
  uses: Sequelize.INTEGER,
  temporary: Sequelize.BOOLEAN,
  deletedAt: Sequelize.DATE,
});

inviteCodes.belongsTo(guilds);
inviteCodes.belongsTo(members, { as: 'inviter' });

export interface IDBJoin extends ISequelizeBaseType {
  id: number;
  exactMatch: string;
  possibleMatches: string;
  guildId: string;
  memberId: string;
}

export const joins = sequelize.define<any, any>('join',
  {
    possibleMatches: Sequelize.STRING,
  }, {
    indexes: [{
      unique: true,
      fields: ['guildId', 'memberId', 'createdAt']
    }],
  }
);

joins.belongsTo(guilds);
joins.belongsTo(members);
joins.belongsTo(inviteCodes, { as: 'exactMatch' });

export interface IDBLeave extends ISequelizeBaseType {
  id: number;
  guildId: string;
  inviterId: string;
}

export const leaves = sequelize.define<any, any>('leave', {});

leaves.belongsTo(guilds);
leaves.belongsTo(members);

export interface IDBCustomInvite extends ISequelizeBaseType {
  id: number;
}

export const customInvites = sequelize.define<any, any>('customInvite', {
  amount: Sequelize.INTEGER,
  reason: Sequelize.STRING,
});

customInvites.belongsTo(guilds);
customInvites.belongsTo(members);
customInvites.belongsTo(members, { as: 'creator' });

export interface IDBRank extends ISequelizeBaseType {
  id: number;
  roleId: string;
  numInvites: number;
  description: string;
}

export const ranks = sequelize.define<any, any>('rank',
  {
    roleId: Sequelize.STRING,
    numInvites: Sequelize.INTEGER,
    description: Sequelize.STRING,
  }, {
    indexes: [{
      unique: true,
      fields: ['guildId', 'roleId']
    }],
  }
);

ranks.belongsTo(guilds);

export enum DBPresences {
  ONLINE = 'on',
  OFFLINE = 'off'
}

export interface IDBPresence extends ISequelizeBaseType {
  id: number;
  status: DBPresences;
  guildId: string;
  memberId: string;
}

export const presences = sequelize.define<any, any>('presence', {
  status: {
    type: Sequelize.ENUM,
    values: ['on', 'off']
  }
});

presences.belongsTo(guilds);
presences.belongsTo(members);
