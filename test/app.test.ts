/*
 * Copyright ©️ 2019 GaltProject Society Construction and Terraforming Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka)
 *
 * Copyright ©️ 2019 Galt•Core Blockchain Company
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) by
 * [Basic Agreement](ipfs/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS)).
 */

import {IGeesomeApp} from "../components/app/interface";
import {FileCatalogItemType, UserLimitName} from "../components/database/interface";

const assert = require('assert');
const fs = require('fs');

describe("app", function () {
  const databaseConfig = {name: 'test_geesome_core', options: {logging: true}};

  this.timeout(30000);

  let app: IGeesomeApp;

  const versions = ['v1'];//'ipfs-http-client'

  versions.forEach((appVersion) => {
    describe('app ' + appVersion, () => {
      beforeEach(async () => {
        const appConfig = require('../components/app/v1/config');
        appConfig.storageConfig.jsNode.repo = '.jsipfs-test';
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
          app = await require('../components/app/' + appVersion)({databaseConfig, storageConfig: appConfig.storageConfig, port: 7771});

          await app.setup({email: 'admin@admin.com', name: 'admin', password: 'admin'});
          const testUser = await app.registerUser({email: 'user@user.com', name: 'user', password: 'user'});
          await app.createGroup(testUser.id, {
            name: 'test',
            title: 'Test'
          });
        } catch (e) {
          console.error(e);
          assert.equal(true, false);
        }
      });
      
      afterEach(async () => {
        await app.database.flushDatabase();
        await app.storage.node.stop();
      });

      it("should initialized successfully", async () => {
        assert.equal(await app.database.getUsersCount(), 2);

        await new Promise((resolve, reject) => {
          fs.writeFile('/tmp/test', 'test', resolve);
        });
        const resultFile = await app.storage.saveFileByPath('/tmp/test');

        assert.notEqual(resultFile.id, undefined);

        const adminUser = (await app.database.getAllUserList('admin'))[0];
        const testUser = (await app.database.getAllUserList('user'))[0];
        const testGroup = (await app.database.getAllGroupList('test'))[0];

        const limitData = {
          name: UserLimitName.SaveContentSize,
          value: 100 * (10 ** 3),
          adminId: adminUser.id,
          userId: testUser.id,
          periodTimestamp: 60,
          isActive: true
        };
        await app.setUserLimit(adminUser.id, limitData);

        try {
          await app.saveData(fs.createReadStream(`${__dirname}/../exampleContent/post3.jpg`), 'post3.jpg', {
            userId: testUser.id,
            groupId: testGroup.id
          });
          assert.equal(true, false);
        } catch (e) {
          assert.equal(true, true);
        }

        limitData.value = 1000 * (10 ** 3);

        await app.setUserLimit(adminUser.id, limitData);

        await app.saveData(fs.createReadStream(`${__dirname}/../exampleContent/post3.jpg`), 'post3.jpg', {
          userId: testUser.id,
          groupId: testGroup.id
        })

        // const contentObj = await app.saveDataByUrl('https://www.youtube.com/watch?v=rxGnonKB7TY', {userId: 1, groupId: 1, driver: 'youtube-video'});
        // console.log('contentObj', contentObj);
        //
        // assert.notEqual(contentObj.storageAccountId, null);
      });

      it("should file catalog working properly", async () => {
        const testUser = (await app.database.getAllUserList('user'))[0];
        
        const indexHtml = '<h1>Hello world</h1>';
        const fileName = 'index.html';
        const foldersPath = '/1/2/3/';
        const filePath = foldersPath + fileName;
        
        const indexHtmlContent = await app.saveData(indexHtml, fileName, {userId: testUser.id});
        const indexHtmlFileItem = await app.saveContentByPath(testUser.id, filePath, indexHtmlContent.id);
        assert.equal(indexHtmlFileItem.name, fileName);
        
        let parentFolderId = indexHtmlFileItem.parentItemId;
        let level = 3;
        
        while(parentFolderId) {
          const parentFolder = await app.database.getFileCatalogItem(parentFolderId);
          assert.equal(parentFolder.name, level.toString());
          level -= 1;
          parentFolderId = parentFolder.parentItemId;
        }
        
        const foundIndexHtmlFileContent = await app.getContentByPath(testUser.id, filePath);

        assert.equal(foundIndexHtmlFileContent.id, indexHtmlFileItem.content.id);
        
        const gotIndexHtml = await app.storage.getFileData(indexHtmlFileItem.content.storageId);
        
        assert.equal(gotIndexHtml, indexHtml);

        console.log('publishFolder indexHtmlFileItem.parentItem');
        let publishFolderResult = await app.publishFolder(testUser.id, indexHtmlFileItem.parentItemId);
        
        const resolvedStorageId = await app.resolveStaticId(publishFolderResult.staticId);
        
        assert.equal(publishFolderResult.storageId, resolvedStorageId);
        
        let gotIndexHtmlByFolder = await app.storage.getFileData(publishFolderResult.storageId + '/' + fileName);

        assert.equal(gotIndexHtmlByFolder, indexHtml);
        
        try {
          await app.storage.getFileData(publishFolderResult.storageId + '/incorrect' + fileName);
          assert.equal(true, false);
        } catch (e) {
          assert.equal(e.message, 'file does not exist');
        }
        
        const firstFolder = await app.getFileCatalogItemByPath(testUser.id, '/1/', FileCatalogItemType.Folder);

        console.log('publishFolder firstFolder', firstFolder.name);
        publishFolderResult = await app.publishFolder(testUser.id, firstFolder.id);

        gotIndexHtmlByFolder = await app.storage.getFileData(publishFolderResult.storageId + '/2/3/' + fileName);
        
        assert.equal(gotIndexHtmlByFolder, indexHtml);

        const indexHtml2 = '<h1>Hello world 2</h1>';
        const fileName2 = 'index2.json';
        const filePath2 = foldersPath + fileName2;
        await app.saveData(indexHtml2, fileName2, {userId: testUser.id, path: filePath2 });

        try {
          await app.storage.getFileData(publishFolderResult.storageId + '/2/3/' + fileName2);
          assert.equal(true, false);
        } catch (e) {
          assert.equal(e.message, 'file does not exist');
        }

        publishFolderResult = await app.publishFolder(testUser.id, firstFolder.id);
        gotIndexHtmlByFolder = await app.storage.getFileData(publishFolderResult.storageId + '/2/3/' + fileName2);
        assert.equal(gotIndexHtmlByFolder, indexHtml2);
      });
    });
  });
});
