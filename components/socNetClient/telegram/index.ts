/*
 * Copyright ©️ 2018-2021 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2021 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { computeCheck } = require("telegram/Password");
const includes = require('lodash/includes');
const pick = require('lodash/pick');

class Telegram {
	models;

	async init(databaseDriver) {
		if (databaseDriver.type === 'sql') {
			this.models = await require("./database")(databaseDriver.sequelize, databaseDriver.models);
		} else {
			throw new Error('socNetClient:telegram:unknown_database_driver_type');
		}
	}
	async login(userId, loginData) {
		let { phoneNumber, apiId, apiHash, password, phoneCode, phoneCodeHash } = loginData;
		apiId = parseInt(apiId);

		const acc = await this.models.Account.findOne({where: {userId}});
		const stringSession = new StringSession(acc && acc.sessionKey ? acc.sessionKey : '');
		const client = new TelegramClient(stringSession, apiId, apiHash, {});

		await client.connect();

		if (phoneCodeHash) {
			let res;
			try {
				res = await client.invoke(
					new Api.auth.SignIn({
						phoneNumber,
						phoneCodeHash,
						phoneCode
					}) as any
				);
			} catch (e) {
				if (!includes(e.message, 'SESSION_PASSWORD_NEEDED')) {
					throw e;
				}
				const passwordSrpResult = await client.invoke(new Api['account'].GetPassword({}) as any);
				const passwordSrpCheck = await computeCheck(passwordSrpResult, password);
				res = await client.invoke(
					new Api.auth.CheckPassword({
						password: passwordSrpCheck
					}) as any
				);
			}
			try {
				const sessionKey = client.session.save();
				await this.createOrUpdateAccount({userId, phoneNumber, apiId, apiHash, sessionKey});
			} catch (e) {}
			return res;
		} else {
			const res = await client.sendCode(
				{apiId, apiHash},
				phoneNumber,
			);
			try {
				const sessionKey = client.session.save();
				console.log('sendCode sessionKey', sessionKey);
				await this.createOrUpdateAccount({userId, phoneNumber, sessionKey});
			} catch (e) {}
			return res;
		}
	}
	async createOrUpdateAccount(accData) {
		const userAcc = await this.models.Account.findOne({where: {userId: accData.userId}});
		return userAcc ? userAcc.update(accData) : this.models.Account.create(accData);
	}
	async getMessages(userId, channelName, messagesIds) {
		let {sessionKey, apiId, apiHash} = await this.models.Account.findOne({where: {userId}});
		apiId = parseInt(apiId);
		const session = new StringSession(sessionKey); // You should put your string session here
		const client = new TelegramClient(session, apiId, apiHash, {});
		await client.connect(); // This assumes you have already authenticated with .start()

		return client.invoke(new Api.channels.GetMessages({ channel: channelName, id: messagesIds }) as any).then(({messages}) => {
			return messages.map(m => pick(m, ['id', 'replyTo', 'date', 'message', 'media', 'action']))
		});
	}
}

module.exports = Telegram;