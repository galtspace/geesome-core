/*
 * Copyright ©️ 2018-2020 Galt•Project Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2018-2020 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGeesomeApp} from "../app/interface";
import {
	CorePermissionName,
	UserLimitName
} from "../app/modules/database/interface";

const assert = require('assert');
const _ = require('lodash');
const commonHelper = require('geesome-libs/src/common');

describe("app", function () {
	const databaseConfig = {
		name: 'geesome_test', options: {
			logging: () => {
			}, storage: 'database-test.sqlite'
		}
	};

	this.timeout(60000);

	let admin, app: IGeesomeApp;
	beforeEach(async () => {
		const appConfig = require('../app/config');
		appConfig.storageConfig.implementation = 'js-ipfs';
		appConfig.storageConfig.jsNode.repo = '.jsipfs-test';
		appConfig.storageConfig.jsNode.pass = 'test test test test test test test test test test';
		appConfig.storageConfig.jsNode.config = {
			Addresses: {
				Swarm: [
					"/ip4/0.0.0.0/tcp/40002",
					"/ip4/127.0.0.1/tcp/40003/ws",
					"/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star"
				]
			}
		};

		try {
			app = await require('../app')({databaseConfig, storageConfig: appConfig.storageConfig, port: 7771});
			await app.flushDatabase();

			admin = await app.setup({email: 'admin@admin.com', name: 'admin', password: 'admin'}).then(r => r.user);
			const testUser = await app.registerUser({
				email: 'user@user.com',
				name: 'user',
				password: 'user',
				permissions: [CorePermissionName.UserAll]
			});
			await app.ms.group.createGroup(testUser.id, {
				name: 'test',
				title: 'Test'
			});
		} catch (e) {
			console.error('error', e);
			assert.equal(true, false);
		}
	});

	afterEach(async () => {
		await app.stop();
	});

	it('user invites should work properly', async () => {
		const userAccountPrivateKey = '0xec63de747a7872b20793af42814ce92b5749dd13017887b6ab26754907b4934f';
		const userAccountAddress = '0x2FAa9af0dbD9d32722C494bAD6B4A2521d132003';
		const testGroup = (await app.ms.group.getAllGroupList(admin.id, 'test').then(r => r.list))[0];
		const testUser = (await app.ms.database.getAllUserList('user'))[0];
		const testAdmin = (await app.ms.database.getAllUserList('admin'))[0];

		const invite = await app.ms.invite.createInvite(testAdmin.id, {
			title: 'test invite',
			limits: JSON.stringify([{
				name: UserLimitName.SaveContentSize,
				value: 100 * (10 ** 3),
				periodTimestamp: 60,
				isActive: true
			}]),
			permissions: JSON.stringify([CorePermissionName.UserAll]),
			groupsToJoin: JSON.stringify([testGroup.manifestStaticStorageId]),
			maxCount: 1,
			isActive: true
		});

		try {
			await app.ms.invite.registerUserByInviteCode(invite.code, {
				email: 'new2@user.com',
				name: 'new2',
				password: 'new2',
				permissions: [CorePermissionName.UserAll],
				accounts: [{'address': userAccountAddress, 'provider': 'ethereum'}]
			});
			assert.equal(true, false);
		} catch (e) {
			assert.equal(_.includes(e.toString(), "signature_required"), true);
			//TODO: add test for ethereum signature
		}
		const {user: newMember} = await app.ms.invite.registerUserByInviteCode(invite.code, {
			email: 'new2@user.com',
			name: 'new2',
			password: 'new2',
			permissions: [CorePermissionName.UserAll],
		});
		assert.equal(await app.ms.invite.getInvitedUserOfJoinedUser(newMember.id).then(u => u.id), invite.createdById);
		assert.equal(await app.ms.invite.getInviteOfJoinedUser(newMember.id).then(i => i.id), invite.id);

		const userLimit = await app.getUserLimit(testAdmin.id, newMember.id, UserLimitName.SaveContentSize);
		assert.equal(userLimit.isActive, true);
		assert.equal(userLimit.periodTimestamp, 60);
		assert.equal(userLimit.value, 100 * (10 ** 3));

		assert.equal(await app.ms.database.isHaveCorePermission(newMember.id, CorePermissionName.UserAll), true);

		assert.equal(await app.ms.group.isMemberInGroup(newMember.id, testGroup.id), false);

		await app.ms.group.addAdminToGroup(testUser.id, testGroup.id, testAdmin.id);

		try {
			await app.ms.invite.registerUserByInviteCode(commonHelper.random('hash'), {
				email: 'new3@user.com',
				name: 'new3',
				password: 'new3',
				permissions: [CorePermissionName.UserAll],
			});
			assert.equal(true, false);
		} catch (e) {
			assert.equal(_.includes(e.toString(), "invite_not_found"), true);
		}

		try {
			await app.ms.invite.registerUserByInviteCode(invite.code, {
				email: 'new3@user.com',
				name: 'new3',
				password: 'new3',
				permissions: [CorePermissionName.UserAll],
			});
			assert.equal(true, false);
		} catch (e) {
			assert.equal(_.includes(e.toString(), "invite_max_count"), true);
		}

		await app.ms.invite.updateInvite(testAdmin.id, invite.id, {maxCount: 3});
		const foundInvite = await app.ms.invite.findInviteByCode(invite.code);
		assert.equal(foundInvite.maxCount, 3);

		const {user: newMember3} = await app.ms.invite.registerUserByInviteCode(invite.code, {
			email: 'new3@user.com',
			name: 'new3',
			password: 'new3',
			permissions: [CorePermissionName.UserAll],
		});

		assert.equal(await app.ms.group.isMemberInGroup(newMember.id, testGroup.id), false);
		assert.equal(await app.ms.group.isMemberInGroup(newMember3.id, testGroup.id), true);

		await app.ms.invite.updateInvite(testAdmin.id, invite.id, {isActive: false});

		try {
			await app.ms.invite.registerUserByInviteCode(invite.code, {
				email: 'new4@user.com',
				name: 'new4',
				password: 'new4',
				permissions: [CorePermissionName.UserAll],
			});
			assert.equal(true, false);
		} catch (e) {
			assert.equal(_.includes(e.toString(), "invite_not_active"), true);
		}
	});
});
