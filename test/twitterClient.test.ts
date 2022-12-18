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
	ContentView,
	CorePermissionName,
} from "../app/modules/database/interface";
import IGeesomeTwitterClient from "../app/modules/twitterClient/interface";
import {PostStatus} from "../app/modules/group/interface";
import IGeesomeSocNetImport from "../app/modules/socNetImport/interface";
import IGeesomeSocNetAccount from "../app/modules/socNetAccount/interface";

const twitterHelpers = require('../app/modules/twitterClient/helpers');

const assert = require('assert');

describe("twitterClient", function () {
	const databaseConfig = {
		name: 'geesome_test', options: {
			logging: () => {
			}, storage: 'database-test.sqlite'
		}
	};

	this.timeout(60000);

	let admin, app: IGeesomeApp, twitterClient: IGeesomeTwitterClient, socNetAccount: IGeesomeSocNetAccount,
		socNetImport: IGeesomeSocNetImport;

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
			twitterClient = app.ms['twitterClient'];
			socNetImport = app.ms['socNetImport'];
			socNetAccount = app.ms['socNetAccount'];
		} catch (e) {
			console.error('error', e);
			assert.equal(true, false);
		}
	});

	afterEach(async () => {
		await app.stop();
	});

	//
	//{"context_annotations":[{"domain":{"id":"45","name":"Brand Vertical","description":"Top level entities that describe a Brands industry"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"781974596794716162","name":"Financial services"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"913142676819648512","name":"Cryptocurrencies","description":"Cryptocurrency"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}}],"author_id":"3142378517","created_at":"2020-10-16T22:57:23.000Z","possibly_sensitive":false,"lang":"en","attachments":{"media_keys":["3_1317238234095779846","3_1317238236327063553"]},"source":"Twitter for Android","entities":{"mentions":[{"start":11,"end":21,"username":"etherscan","id":"3313312856"}],"urls":[{"start":74,"end":97,"url":"https://t.co/aXSCv1889k","expanded_url":"https://twitter.com/jony_bang/status/1317238238252290048/photo/1","display_url":"pic.twitter.com/aXSCv1889k","media_key":"3_1317238234095779846"},{"start":74,"end":97,"url":"https://t.co/aXSCv1889k","expanded_url":"https://twitter.com/jony_bang/status/1317238238252290048/photo/1","display_url":"pic.twitter.com/aXSCv1889k","media_key":"3_1317238236327063553"}]},"reply_settings":"everyone","conversation_id":"1317238238252290048","text":"Seems like @etherscan looks too optimistic about gas prices in Ethereum 😅 https://t.co/aXSCv1889k","id":"1317238238252290048"}
	//{"author_id":"3142378517","created_at":"2020-08-22T10:32:09.000Z","possibly_sensitive":false,"lang":"en","source":"Twitter for Android","entities":{"mentions":[{"start":0,"end":14,"username":"unrealSatoshi","id":"1441577430091636750"}]},"referenced_tweets":[{"type":"replied_to","id":"1297041073445928960"}],"reply_settings":"everyone","in_reply_to_user_id":"846770450462072833","conversation_id":"1297041073445928960","text":"@UnrealSatoshi It's awesome, thank you! Did you participate in yesterday voting?","id":"1297119358813122565"}
	//{"entities":{"hashtags":[{"start":105,"end":114,"tag":"ethereum"},{"start":115,"end":124,"tag":"solidity"}],"mentions":[{"start":3,"end":10,"username":"mudgen","id":"6078352"},{"start":36,"end":46,"username":"jony_bang","id":"1500113611108196356"}],"urls":[{"start":81,"end":104,"url":"https://t.co/przCAVYNNe","expanded_url":"https://medium.com/coinmonks/how-to-optimize-eth-smart-contract-size-part-1-a393f444a1df","display_url":"medium.com/coinmonks/how-…"}]},"context_annotations":[{"domain":{"id":"45","name":"Brand Vertical","description":"Top level entities that describe a Brands industry"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"781974596794716162","name":"Financial services"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}},{"domain":{"id":"65","name":"Interests and Hobbies Vertical","description":"Top level interests and hobbies groupings, like Food or Travel"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"66","name":"Interests and Hobbies Category","description":"A grouping of interests and hobbies entities, like Novelty Food or Destinations"},"entity":{"id":"847888632711061504","name":"Personal finance","description":"Personal finance"}},{"domain":{"id":"66","name":"Interests and Hobbies Category","description":"A grouping of interests and hobbies entities, like Novelty Food or Destinations"},"entity":{"id":"913142676819648512","name":"Cryptocurrencies","description":"Cryptocurrency"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"913142676819648512","name":"Cryptocurrencies","description":"Cryptocurrency"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}}],"author_id":"3142378517","created_at":"2020-08-13T12:07:50.000Z","possibly_sensitive":false,"lang":"en","source":"Twitter Web App","referenced_tweets":[{"type":"retweeted","id":"1293881636392771584"}],"reply_settings":"everyone","conversation_id":"1293881948356718594","text":"RT @mudgen: A new article series by @jony_bang on how to optimize contract size: https://t.co/przCAVYNNe #ethereum #solidity #smartcontract…","id":"1293881948356718594"}
	//{"author_id":"3142378517","created_at":"2020-02-14T17:27:15.000Z","possibly_sensitive":false,"lang":"en","attachments":{"media_keys":["3_1228370112291524609","3_1228370120042569728"]},"source":"Twitter for Android","referenced_tweets":[{"type":"replied_to","id":"1228369054949396482"}],"reply_settings":"everyone","in_reply_to_user_id":"3142378517","conversation_id":"1228369054949396482","text":"Also, there's a button that looks like menu BUT IT'S NOT. It's just a help captions, and when I'm trying to push it again - nothing happens. I think it's terrible. That button in standard menu place, and looks like menu, but It's lying to user and forces him to relearn https://t.co/8qoV79GyLi","id":"1228370130234675200","entities":{"urls":[{"start":270,"end":293,"url":"https://t.co/8qoV79GyLi","expanded_url":"https://twitter.com/jony_bang/status/1228370130234675200/photo/1","display_url":"pic.twitter.com/8qoV79GyLi","media_key":"3_1228370112291524609"},{"start":270,"end":293,"url":"https://t.co/8qoV79GyLi","expanded_url":"https://twitter.com/jony_bang/status/1228370130234675200/photo/1","display_url":"pic.twitter.com/8qoV79GyLi","media_key":"3_1228370120042569728"}]}}
	//{"entities":{"hashtags":[{"start":0,"end":7,"tag":"shitUX"}],"annotations":[{"start":11,"end":21,"probability":0.3696,"type":"Product","normalized_text":"Google maps"}],"urls":[{"start":267,"end":290,"url":"https://t.co/MNwZoHsqcY","expanded_url":"https://twitter.com/jony_bang/status/1228369054949396482/photo/1","display_url":"pic.twitter.com/MNwZoHsqcY","media_key":"3_1228369041208811520"},{"start":267,"end":290,"url":"https://t.co/MNwZoHsqcY","expanded_url":"https://twitter.com/jony_bang/status/1228369054949396482/photo/1","display_url":"pic.twitter.com/MNwZoHsqcY","media_key":"3_1228369048309768198"}]},"context_annotations":[{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"781974596752842752","name":"Services"}},{"domain":{"id":"47","name":"Brand","description":"Brands and Companies"},"entity":{"id":"10026378521","name":"Google "}},{"domain":{"id":"48","name":"Product","description":"Products created by Brands.  Examples: Ford Explorer, Apple iPhone."},"entity":{"id":"1006154112021377024","name":"Google Maps","description":"Google Maps"}},{"domain":{"id":"67","name":"Interests and Hobbies","description":"Interests, opinions, and behaviors of individuals, groups, or cultures; like Speciality Cooking or Theme Parks"},"entity":{"id":"1037076248877395968","name":"GPS and maps","description":"GPS & Maps"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"781974596752842752","name":"Services"}},{"domain":{"id":"47","name":"Brand","description":"Brands and Companies"},"entity":{"id":"10026378521","name":"Google "}},{"domain":{"id":"48","name":"Product","description":"Products created by Brands.  Examples: Ford Explorer, Apple iPhone."},"entity":{"id":"10043701926","name":"Google Maps"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"10026378521","name":"Google "}}],"author_id":"3142378517","created_at":"2020-02-14T17:22:59.000Z","possibly_sensitive":false,"lang":"en","attachments":{"media_keys":["3_1228369041208811520","3_1228369048309768198"]},"source":"Twitter for Android","reply_settings":"everyone","conversation_id":"1228369054949396482","text":"#shitUX in Google maps.\nThey changed buttons placement, and now - in the most convenient place you can find menu with settings, account management and so on. How many times user should press that menu button? I don't think that often. So why it placed in that place? https://t.co/MNwZoHsqcY","id":"1228369054949396482"}
	//{"id":"1296972062662234112","entities":{"urls":[{"start":13,"end":36,"url":"https://t.co/YLaRuCVX7F","expanded_url":"https://twitter.com/galtproject/status/1296887930074607616","display_url":"twitter.com/galtproject/st…"}]},"referenced_tweets":[{"type":"quoted","id":"1296887930074607616"}],"context_annotations":[{"domain":{"id":"45","name":"Brand Vertical","description":"Top level entities that describe a Brands industry"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"781974596794716162","name":"Financial services"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}},{"domain":{"id":"65","name":"Interests and Hobbies Vertical","description":"Top level interests and hobbies groupings, like Food or Travel"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"66","name":"Interests and Hobbies Category","description":"A grouping of interests and hobbies entities, like Novelty Food or Destinations"},"entity":{"id":"847888632711061504","name":"Personal finance","description":"Personal finance"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"857879456773357569","name":"Technology","description":"Technology"}},{"domain":{"id":"66","name":"Interests and Hobbies Category","description":"A grouping of interests and hobbies entities, like Novelty Food or Destinations"},"entity":{"id":"913142676819648512","name":"Cryptocurrencies","description":"Cryptocurrency"}},{"domain":{"id":"30","name":"Entities [Entity Service]","description":"Entity Service top level domain, every item that is in Entity Service should be in this domain"},"entity":{"id":"1001503516555337728","name":"Blockchain","description":"Blockchain"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"913142676819648512","name":"Cryptocurrencies","description":"Cryptocurrency"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"1007361429752594432","name":"Ethereum cryptocurrency","description":"Ethereum Cryptocurrency"}},{"domain":{"id":"65","name":"Interests and Hobbies Vertical","description":"Top level interests and hobbies groupings, like Food or Travel"},"entity":{"id":"781974596148793345","name":"Business & finance"}},{"domain":{"id":"66","name":"Interests and Hobbies Category","description":"A grouping of interests and hobbies entities, like Novelty Food or Destinations"},"entity":{"id":"847888632711061504","name":"Personal finance","description":"Personal finance"}},{"domain":{"id":"67","name":"Interests and Hobbies","description":"Interests, opinions, and behaviors of individuals, groups, or cultures; like Speciality Cooking or Theme Parks"},"entity":{"id":"847894737281470464","name":"Real estate","description":"Real estate"}},{"domain":{"id":"131","name":"Unified Twitter Taxonomy","description":"A taxonomy view into the Semantic Core knowledge graph"},"entity":{"id":"847894737281470464","name":"Real estate","description":"Real estate"}}],"lang":"en","reply_settings":"everyone","possibly_sensitive":false,"source":"Twitter for Android","author_id":"3142378517","created_at":"2020-08-22T00:46:50.000Z","text":"We did it! 🎉 https://t.co/YLaRuCVX7F","conversation_id":"1296972062662234112"}
	const includes = {
		"users": [{
			"username": "MicrowaveDev",
			"id": "3142378517",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1465436672942878726/FQc-4TP__normal.jpg",
			"name": "Microwave Dev"
		}, {
			"username": "sparkpool_eth",
			"id": "955345726858452992",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1143714781666217984/aUVasr8L_normal.png",
			"name": "SparkPool"
		}, {
			"username": "IliaAskey",
			"id": "846770450462072833",
			"profile_image_url": "https://pbs.twimg.com/profile_images/941128141115936768/LpKoSTDZ_normal.jpg",
			"name": "Ilia Askey"
		}, {
			"username": "galtproject",
			"id": "1041654490523287552",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1163710784377110529/LZCq11V4_normal.jpg",
			"name": "Galt Project"
		}, {
			"username": "mudgen",
			"id": "6078352",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1449724448614109189/lk5uULBG_normal.jpg",
			"name": "Nick Mudge 💎"
		}, {
			"username": "UR_LYING_MORGAN",
			"id": "783283130958569472",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1458073873937747976/7FLDP6xZ_normal.jpg",
			"name": "метатель кабанчиков"
		}, {
			"username": "vasa_develop",
			"id": "893875627916378112",
			"profile_image_url": "https://pbs.twimg.com/profile_images/935095664165339136/ZL_MUi2U_normal.jpg",
			"name": "vasa"
		}, {
			"username": "zeligenm",
			"id": "781435180800176128",
			"profile_image_url": "https://pbs.twimg.com/profile_images/1358412570881892354/8xHb-Nym_normal.jpg",
			"name": "Maria Zeligen"
		}],
		"tweets": [
			{
				"author_id": "955345726858452992",
				"created_at": "2021-05-21T08:48:45.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1395662829345132544"]},
				"source": "Twitter for iPhone",
				"referenced_tweets": [{"type": "replied_to", "id": "1395662646951641090"}],
				"reply_settings": "everyone",
				"in_reply_to_user_id": "955345726858452992",
				"conversation_id": "1395662646951641090",
				"text": "2/ ETH1 pow lauched on 2015-07-30. After about 6 years, Top5 mining pools have 64.1% share. https://t.co/NY6CGB7WtB",
				"id": "1395662836840288261",
				"entities": {
					"urls": [{
						"start": 92,
						"end": 115,
						"url": "https://t.co/NY6CGB7WtB",
						"expanded_url": "https://twitter.com/sparkpool_eth/status/1395662836840288261/photo/1",
						"display_url": "pic.twitter.com/NY6CGB7WtB",
						"media_key": "3_1395662829345132544"
					}]
				}
			},
			{
				"author_id": "846770450462072833",
				"created_at": "2020-08-22T05:21:04.000Z",
				"possibly_sensitive": false,
				"lang": "cs",
				"source": "Twitter Web App",
				"referenced_tweets": [{"type": "quoted", "id": "1296972062662234112"}],
				"reply_settings": "everyone",
				"conversation_id": "1297041073445928960",
				"text": "LOL WTF?! THat's the house I used to live in! (not first floor though), but OMFG THE WORLD IS SO SMALL!!! Поздравляю, Жека =D https://t.co/05VGyxiyK8",
				"id": "1297041073445928960",
				"entities": {
					"urls": [{
						"start": 126,
						"end": 149,
						"url": "https://t.co/05VGyxiyK8",
						"expanded_url": "https://twitter.com/MicrowaveDev/status/1296972062662234112",
						"display_url": "twitter.com/MicrowaveDev/s…"
					}]
				}
			},
			{
				"entities": {
					"hashtags": [{"start": 211, "end": 220, "tag": "Ethereum"}, {
						"start": 221,
						"end": 230,
						"tag": "proptech"
					}, {"start": 231, "end": 235, "tag": "DAO"}],
					"mentions": [{
						"start": 29,
						"end": 41,
						"username": "galtproject",
						"id": "1041654490523287552"
					}, {"start": 46, "end": 56, "username": "xdaichain", "id": "1448922864380416006"}, {
						"start": 182,
						"end": 192,
						"username": "xdaichain",
						"id": "1448922864380416006"
					}],
					"urls": [{
						"start": 236,
						"end": 259,
						"url": "https://t.co/toAO8u2UR2",
						"expanded_url": "https://twitter.com/galtproject/status/1296887930074607616/photo/1",
						"display_url": "pic.twitter.com/toAO8u2UR2",
						"media_key": "3_1296887923065917441"
					}, {
						"start": 236,
						"end": 259,
						"url": "https://t.co/toAO8u2UR2",
						"expanded_url": "https://twitter.com/galtproject/status/1296887930074607616/photo/1",
						"display_url": "pic.twitter.com/toAO8u2UR2",
						"media_key": "3_1296887923045011458"
					}]
				},
				"author_id": "1041654490523287552",
				"created_at": "2020-08-21T19:12:32.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1296887923065917441", "3_1296887923045011458"]},
				"source": "Twitter for iPhone",
				"reply_settings": "everyone",
				"conversation_id": "1296887930074607616",
				"text": "First HOA meeting powered by @galtproject and @xdaichain is live. \nFor the first time in history, real estate owners vote on self-government issues on a public blockchain. Thank you @xdaichain team for support! #Ethereum #proptech #DAO https://t.co/toAO8u2UR2",
				"id": "1296887930074607616"
			},
			{
				"entities": {
					"hashtags": [{"start": 93, "end": 102, "tag": "ethereum"}, {
						"start": 103,
						"end": 112,
						"tag": "solidity"
					}, {"start": 113, "end": 128, "tag": "smartcontracts"}, {
						"start": 129,
						"end": 140,
						"tag": "blockchain"
					}],
					"mentions": [{"start": 24, "end": 34, "username": "jony_bang", "id": "1500113611108196356"}],
					"urls": [{
						"start": 69,
						"end": 92,
						"url": "https://t.co/przCAVYNNe",
						"expanded_url": "https://medium.com/coinmonks/how-to-optimize-eth-smart-contract-size-part-1-a393f444a1df",
						"display_url": "medium.com/coinmonks/how-…"
					}]
				},
				"author_id": "6078352",
				"created_at": "2020-08-13T12:06:35.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"source": "Twitter Web App",
				"reply_settings": "everyone",
				"conversation_id": "1293881636392771584",
				"text": "A new article series by @jony_bang on how to optimize contract size: https://t.co/przCAVYNNe #ethereum #solidity #smartcontracts #blockchain",
				"id": "1293881636392771584"
			},
			{
				"entities": {
					"hashtags": [{"start": 0, "end": 7, "tag": "shitUX"}],
					"annotations": [{
						"start": 11,
						"end": 21,
						"probability": 0.3696,
						"type": "Product",
						"normalized_text": "Google maps"
					}],
					"urls": [{
						"start": 267,
						"end": 290,
						"url": "https://t.co/MNwZoHsqcY",
						"expanded_url": "https://twitter.com/jony_bang/status/1228369054949396482/photo/1",
						"display_url": "pic.twitter.com/MNwZoHsqcY",
						"media_key": "3_1228369041208811520"
					}, {
						"start": 267,
						"end": 290,
						"url": "https://t.co/MNwZoHsqcY",
						"expanded_url": "https://twitter.com/jony_bang/status/1228369054949396482/photo/1",
						"display_url": "pic.twitter.com/MNwZoHsqcY",
						"media_key": "3_1228369048309768198"
					}]
				},
				"author_id": "3142378517",
				"created_at": "2020-02-14T17:22:59.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1228369041208811520", "3_1228369048309768198"]},
				"source": "Twitter for Android",
				"reply_settings": "everyone",
				"conversation_id": "1228369054949396482",
				"text": "#shitUX in Google maps.\nThey changed buttons placement, and now - in the most convenient place you can find menu with settings, account management and so on. How many times user should press that menu button? I don't think that often. So why it placed in that place? https://t.co/MNwZoHsqcY",
				"id": "1228369054949396482"
			},
			{
				"entities": {
					"hashtags": [{"start": 229, "end": 238, "tag": "ethereum"}, {
						"start": 239,
						"end": 243,
						"tag": "dao"
					}, {"start": 244, "end": 249, "tag": "web3"}, {"start": 250, "end": 256, "tag": "DApps"}, {
						"start": 257,
						"end": 261,
						"tag": "ETH"
					}, {"start": 262, "end": 271, "tag": "PropTech"}],
					"urls": [{
						"start": 91,
						"end": 114,
						"url": "https://t.co/1y7g8B7tMN",
						"expanded_url": "https://medium.com/galtproject/galt-project-live-on-ethereum-mainnet-athens-release-ca11087828f6",
						"display_url": "medium.com/galtproject/ga…",
						"status": 200,
						"unwound_url": "https://medium.com/galtproject/galt-project-live-on-ethereum-mainnet-athens-release-ca11087828f6"
					}, {
						"start": 131,
						"end": 154,
						"url": "https://t.co/Ey9CKYSBph",
						"expanded_url": "http://app.galtproject.io",
						"display_url": "app.galtproject.io",
						"unwound_url": "http://app.galtproject.io"
					}]
				},
				"author_id": "1041654490523287552",
				"created_at": "2020-01-15T11:23:20.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"source": "Twitter for iPhone",
				"reply_settings": "everyone",
				"conversation_id": "1217406911303372800",
				"text": "Hey everyone! 🎊 Amazing news! Galt•Project is live on Ethereum mainnet. More details here: https://t.co/1y7g8B7tMN.  DApp is here: https://t.co/Ey9CKYSBph Put your land, house or apartment on Ethereum! Create community and Vote! #ethereum #dao #web3 #DApps #ETH #PropTech",
				"id": "1217406911303372800"
			},
			{
				"author_id": "783283130958569472",
				"created_at": "2019-08-30T13:35:17.000Z",
				"possibly_sensitive": false,
				"lang": "und",
				"source": "Twitter for Android",
				"entities": {
					"mentions": [{"start": 0, "end": 10, "username": "chebyster", "id": "197293842"}, {
						"start": 11,
						"end": 21,
						"username": "jony_bang",
						"id": "1500113611108196356"
					}]
				},
				"referenced_tweets": [{"type": "replied_to", "id": "1167413304584785921"}],
				"reply_settings": "everyone",
				"in_reply_to_user_id": "197293842",
				"conversation_id": "1167413304584785921",
				"text": "@chebyster @jony_bang Ебать женя fabulous",
				"id": "1167430592335622144"
			},
			{
				"author_id": "3142378517",
				"created_at": "2019-05-03T23:09:05.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1124450638400716801"]},
				"source": "Twitter Web Client",
				"entities": {
					"mentions": [{"start": 56, "end": 67, "username": "passportjs", "id": "401463291"}],
					"urls": [{
						"start": 68,
						"end": 91,
						"url": "https://t.co/rd5WWeQiId",
						"expanded_url": "https://twitter.com/jony_bang/status/1124450838188052481/photo/1",
						"display_url": "pic.twitter.com/rd5WWeQiId",
						"media_key": "3_1124450638400716801"
					}]
				},
				"reply_settings": "everyone",
				"conversation_id": "1124450838188052481",
				"text": "😑 Too hard to read. Where is switcher to light theme? 😆\n@passportjs https://t.co/rd5WWeQiId",
				"id": "1124450838188052481"
			},
			{
				"author_id": "3142378517",
				"created_at": "2019-05-02T12:51:18.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1123932947881582594", "3_1123932965329952770"]},
				"source": "Twitter for Android",
				"reply_settings": "everyone",
				"conversation_id": "1123932977195515904",
				"text": "Who would win? https://t.co/5CGtg47NMU",
				"id": "1123932977195515904",
				"entities": {
					"urls": [{
						"start": 15,
						"end": 38,
						"url": "https://t.co/5CGtg47NMU",
						"expanded_url": "https://twitter.com/jony_bang/status/1123932977195515904/photo/1",
						"display_url": "pic.twitter.com/5CGtg47NMU",
						"media_key": "3_1123932947881582594"
					}, {
						"start": 15,
						"end": 38,
						"url": "https://t.co/5CGtg47NMU",
						"expanded_url": "https://twitter.com/jony_bang/status/1123932977195515904/photo/1",
						"display_url": "pic.twitter.com/5CGtg47NMU",
						"media_key": "3_1123932965329952770"
					}]
				}
			},
			{
				"entities": {
					"hashtags": [{"start": 11, "end": 15, "tag": "bjd"}, {
						"start": 16,
						"end": 32,
						"tag": "balljointeddoll"
					}, {"start": 33, "end": 38, "tag": "doll"}, {"start": 39, "end": 46, "tag": "zombie"}, {
						"start": 47,
						"end": 57,
						"tag": "fairyland"
					}],
					"urls": [{
						"start": 58,
						"end": 81,
						"url": "https://t.co/042cUgItDi",
						"expanded_url": "https://twitter.com/zeligenm/status/1117795803005845504/photo/1",
						"display_url": "pic.twitter.com/042cUgItDi",
						"media_key": "3_1117795791274500102"
					}]
				},
				"author_id": "781435180800176128",
				"created_at": "2019-04-15T14:24:21.000Z",
				"possibly_sensitive": false,
				"lang": "en",
				"attachments": {"media_keys": ["3_1117795791274500102"]},
				"source": "Twitter for Android",
				"reply_settings": "everyone",
				"conversation_id": "1117795803005845504",
				"text": "Brains plz #bjd #balljointeddoll #doll #zombie #fairyland https://t.co/042cUgItDi",
				"id": "1117795803005845504"
			}
		],
		"media": [
			{
				"media_key": "3_1317238234095779846",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EkfFMePXgAYd1zm.jpg"
			}, {
				"media_key": "3_1317238236327063553",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EkfFMmjWMAEpGZ0.jpg"
			}, {
				"media_key": "3_1289679911796576258",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EeXdC_iXkAISk6X.jpg"
			}, {
				"media_key": "3_1228370112291524609",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EQwMG-PX0AEw1hX.jpg"
			}, {
				"media_key": "3_1228370120042569728",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EQwMHbHXYAA3SP5.jpg"
			}, {
				"media_key": "3_1228369041208811520",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EQwLIoJWoAANMJC.jpg"
			}, {
				"media_key": "3_1228369048309768198",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EQwLJCmWoAY37Ji.jpg"
			}, {
				"media_key": "3_1218102715173220354",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EOeR9zXWsAIzjf2.jpg"
			}, {
				"media_key": "3_1182615617603604480",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/EGl-o3EXkAATDov.jpg"
			}, {
				"media_key": "3_1126597347973242889",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D6J6UarXoAkspq4.jpg"
			}, {
				"media_key": "3_1124451483641106432",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D5raqrGW0AAvDai.jpg"
			}, {
				"media_key": "3_1124450638400716801",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D5rZ5eVWAAEWB7C.jpg"
			}, {
				"media_key": "3_1123933187758088195",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D5kDR4eX4AMZGj5.jpg"
			}, {
				"media_key": "3_1123932947881582594",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D5kDD63W4AIzg04.jpg"
			}, {
				"media_key": "3_1123932965329952770",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D5kDE73X4AIaID2.jpg"
			}, {
				"media_key": "3_1117942294227881984",
				"type": "photo",
				"url": "https://pbs.twimg.com/media/D4O6l-7WkAAtD_H.jpg"
			}]
	};
	const mediasByKey = {};
	includes.media.forEach(item => {
		mediasByKey[item.media_key] = item;
	});
	const tweetsById = {};
	includes.tweets.forEach(item => {
		tweetsById[item.id] = item;
	});
	const channelsById = {};
	includes.users.forEach(item => {
		channelsById[item.id] = item;
	});

	it('entities and line breaks should handle correctly', async () => {
		const testUser = (await app.ms.database.getAllUserList('user'))[0];
		const testGroup = (await app.ms.group.getAllGroupList(admin.id, 'test').then(r => r.list))[0];

		let message = {
			"attachments": {"media_keys": ["3_1289679911796576258"]},
			"created_at": "2020-08-01T21:50:27.000Z",
			"reply_settings": "everyone",
			"source": "Twitter for Android",
			"entities": {
				"urls": [{
					"start": 114,
					"end": 137,
					"url": "https://t.co/UUvfhl88b2",
					"expanded_url": "https://twitter.com/jony_bang/status/1289679914124247040/photo/1",
					"display_url": "pic.twitter.com/UUvfhl88b2",
					"media_key": "3_1289679911796576258"
				}], "mentions": [{"start": 15, "end": 27, "username": "fontawesome", "id": "515543735"}]
			},
			"conversation_id": "1289679914124247040",
			"possibly_sensitive": false,
			"author_id": "3142378517",
			"text": "It's not cool, @fontawesome why did you spam several messages in a day to me? I should have unsubscribed long ago https://t.co/UUvfhl88b2",
			"lang": "en",
			"id": "1289679914124247040"
		};

		const {list: [m]} = twitterHelpers.parseTweetsList([message], includes);

		const channel = await socNetImport.createDbChannel({
			userId: testUser.id,
			groupId: testGroup.id,
			channelId: 1,
			title: "1",
			lastMessageId: 0,
			postsCounts: 0,
		});

		const contents = await twitterClient.messageToContents(testUser.id, channel, m);
		assert.equal(contents.length, 2);
		const [messageContent, imageContent] = contents;
		assert.equal(messageContent.view, ContentView.Contents);
		assert.equal(imageContent.view, ContentView.Media);

		const testPost = await app.ms.group.createPost(testUser.id, {
			contents,
			groupId: testGroup.id,
			status: PostStatus.Published
		});

		const postContents = await app.ms.group.getPostContentWithUrl('https://my.site/ipfs/', testPost);
		assert.equal(postContents.length, 2);
		const [messageC, imageC] = postContents;

		assert.equal(messageC.type, 'text');
		assert.equal(messageC.mimeType, 'text/html');
		assert.equal(messageC.view, 'contents');
		assert.equal(messageC.text, "It's not cool, @fontawesome why did you spam several messages in a day to me? I should have unsubscribed long ago");
		assert.equal(messageC.manifestId, 'bafyreihs2buxiuh7m5bqkq57pnthcoa2hvxc2oq2w7kthijmanodckpuya');

		assert.equal(imageC.type, 'image');
		assert.equal(imageC.mimeType, 'image/jpeg');
		assert.equal(imageC.view, 'media');
		assert.equal(imageC.url, 'https://my.site/ipfs/bafkreihlgzev575iuq3stroxmymtprwbfpd4aocdrreqmtzxgbitvcfc5e');
		assert.equal(imageC.manifestId, 'bafyreifukz7avkeb6rhkmj4jgnqv3u2e72ipbnmrezdui5d47fzjgdv3le');
	});

	it('webpage message should import properly', async () => {
		const testUser = (await app.ms.database.getAllUserList('user'))[0];
		const testGroup = (await app.ms.group.getAllGroupList(admin.id, 'test').then(r => r.list))[0];

		const message = {
			"author_id": "3142378517",
			"created_at": "2021-05-21T22:39:35.000Z",
			"possibly_sensitive": false,
			"lang": "en",
			"source": "Twitter for Android",
			"entities": {
				"mentions": [{
					"start": 0,
					"end": 14,
					"username": "sparkpool_eth",
					"id": "955345726858452992"
				}]
			},
			"referenced_tweets": [{"type": "replied_to", "id": "1395662836840288261"}],
			"reply_settings": "everyone",
			"in_reply_to_user_id": "955345726858452992",
			"conversation_id": "1395662646951641090",
			"text": "@sparkpool_eth Can you please share the link of this page?",
			"id": "1395871923561803781"
		};

		const {list: [m], tweetsById} = twitterHelpers.parseTweetsList([message], includes);

		const channel = await socNetImport.createDbChannel({
			userId: testUser.id,
			groupId: testGroup.id,
			channelId: 1,
			title: "1",
			lastMessageId: 0,
			postsCounts: 0,
		});

		const contents = await twitterClient.messageToContents(testUser.id, channel, m);
		assert.equal(contents.length, 1);
		const [messageContent] = contents;
		assert.equal(messageContent.view, ContentView.Contents);

		const testPost = await app.ms.group.createPost(testUser.id, {
			contents,
			groupId: testGroup.id,
			status: PostStatus.Published
		});

		const postContents = await app.ms.group.getPostContentWithUrl('https://my.site/ipfs/', testPost);
		assert.equal(postContents.length, 1);
		const [messageC] = postContents;

		assert.equal(messageC.text, "Can you please share the link of this page?");
		assert.equal(messageC.manifestId, 'bafyreiazgkzyg2skgvj7cuympxptjjqhjyth25wfpzftylj7wflxcgg6qe');

		let tweetsToFetch = [];
		let repliesToImport = [];

		twitterHelpers.makeRepliesList(m, tweetsById, repliesToImport, tweetsToFetch);
		assert.equal(tweetsToFetch.length, 2);
		assert.equal(tweetsToFetch[0], '1395662646951641090');
		assert.equal(tweetsToFetch[1], '1395662836840288261');
		assert.equal(repliesToImport.length, 1);
		assert.equal(repliesToImport[0].id, '1395662836840288261');
		assert.equal(repliesToImport[0].text, '2/ ETH1 pow lauched on 2015-07-30. After about 6 years, Top5 mining pools have 64.1% share. https://t.co/NY6CGB7WtB');
		assert.equal(repliesToImport[0].medias.length, 1);

		const replyContents = await twitterClient.messageToContents(testUser.id, channel, repliesToImport[0]);
		const testReplyPost = await app.ms.group.createPost(testUser.id, {
			contents: replyContents,
			groupId: testGroup.id,
			status: PostStatus.Published
		});
		const replyPostContents = await app.ms.group.getPostContentWithUrl('https://my.site/ipfs/', testReplyPost);
		const [replyMessageC] = replyPostContents;
		assert.equal(replyMessageC.text, "2/ ETH1 pow lauched on 2015-07-30. After about 6 years, Top5 mining pools have 64.1% share.");

	});

	it('local webpage message should import properly', async () => {
		const testUser = (await app.ms.database.getAllUserList('user'))[0];
		const testGroup = (await app.ms.group.getAllGroupList(admin.id, 'test').then(r => r.list))[0];

		const message = {
			"author_id": "3142378517",
			"created_at": "2020-01-15T11:25:24.000Z",
			"possibly_sensitive": false,
			"lang": "en",
			"source": "Twitter for Android",
			"entities": {
				"mentions": [{"start": 3, "end": 15, "username": "galtproject", "id": "1041654490523287552"}],
				"urls": [{
					"start": 108,
					"end": 131,
					"url": "https://t.co/1y7g8B7tMN",
					"expanded_url": "https://medium.com/galtproject/galt-project-live-on-ethereum-mainnet-athens-release-ca11087828f6",
					"display_url": "medium.com/galtproject/ga…",
					"status": 200,
					"unwound_url": "https://medium.com/galtproject/galt-project-live-on-ethereum-mainnet-athens-release-ca11087828f6"
				}]
			},
			"referenced_tweets": [{"type": "retweeted", "id": "1217406911303372800"}],
			"reply_settings": "everyone",
			"conversation_id": "1217407431157960704",
			"text": "RT @galtproject: Hey everyone! 🎊 Amazing news! Galt•Project is live on Ethereum mainnet. More details here: https://t.co/1y7g8B7tMN.  DApp…",
			"id": "1217407431157960704"
		};
		const {list: [m]} = twitterHelpers.parseTweetsList([message], includes);

		const channel = await socNetImport.createDbChannel({
			userId: testUser.id,
			groupId: testGroup.id,
			channelId: 1,
			title: "1",
			lastMessageId: 0,
			postsCounts: 0,
		});

		const contents = await twitterClient.messageToContents(testUser.id, channel, m);
		assert.equal(contents.length, 2);
		const [textContent, linkContent] = contents;
		assert.equal(linkContent.view, ContentView.Link);
		assert.equal(linkContent.mimeType, 'application/json');
		assert.equal(await app.ms.storage.getFileDataText(linkContent.storageId), JSON.stringify({
			"url": "https://t.me/inside_microwave/161",
			"displayUrl": "t.me/inside_microwave/161",
			"siteName": "Telegram",
			"title": "Внутри Микроволновки",
			"description": "Для всех новоприбывших: если вы увидели тут какие-то сложные посты про #блокчейн - то настоятельно рекомендую прочитать тред про него с начала.\n\nВот первый пост:\nhttps://t.me/inside_microwave/33\nЯ там сделал цепочку из ссылок на следующие посты, так что читать должно быть удобно\n\nЕщё написал FAQ с описанием терминов, которые юзаю в треде:\ntelegra.ph/Blockchain-FAQ-06-22\n\nФишка в том что я стараюсь объяснить блокчейн и экосистему вокруг него так, чтобы он был понятен простому человеку, ну и заодно то, что блокчейн не равно биткоин, всё гораздо сложнее и интереснее. Рассказываю также про смарт контракты и децентрализованные финансы то что знаю, и надеюсь что получается донести почему я считаю эту технологию перспективной и крутой.\n\nА вообще я очень рад что сюда подключается много интересных и, что самое главное, адекватных людей, я давно хочу сформировать островок адекватности на котором люди с разными точками зрения будут учиться…",
			"type": "url"
		}));
		assert.equal(textContent.view, ContentView.Contents);
	});
});