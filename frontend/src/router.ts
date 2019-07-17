/*
 * Copyright ©️ 2018 Galt•Space Society Construction and Terraforming Company 
 * (Founded by [Nikolai Popeka](https://github.com/npopeka),
 * [Dima Starodubcev](https://github.com/xhipster), 
 * [Valery Litvin](https://github.com/litvintech) by 
 * [Basic Agreement](http://cyb.ai/QmSAWEG5u5aSsUyMNYuX2A2Eaz4kEuoYWUkVBRdmu9qmct:ipfs)).
 * ​
 * Copyright ©️ 2018 Galt•Core Blockchain Company 
 * (Founded by [Nikolai Popeka](https://github.com/npopeka) and 
 * Galt•Space Society Construction and Terraforming Company by 
 * [Basic Agreement](http://cyb.ai/QmaCiXUmSrP16Gz8Jdzq6AJESY1EAANmmwha15uR3c1bsS:ipfs)).
 */
import Vue from 'vue';
import Router from 'vue-router';
import MainPage from "./pages/MainPage/MainPage";
import GroupPage from "./pages/GroupPage/GroupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import GroupLayout from "./pages/GroupPage/GroupLayout/GroupLayout";
import GroupPostPage from "./pages/GroupPage/GroupPostPage/GroupPostPage";
import NewGroup from "./pages/GroupPage/NewGroup/NewGroup";
import NewUser from "./pages/NewUser/NewUser";
import FileExplorerPage from "./pages/FileExplorerPage/FileExplorerPage";
import ContentPage from "./pages/ContentPage/ContentPage";
import EditGroup from "./pages/GroupPage/EditGroup/EditGroup";
import JoinedGroups from "./pages/GroupsList/JoinedGroups/JoinedGroups";
import AdminedGroups from "./pages/GroupsList/AdminedGroups/AdminedGroups";
import BootNodesPage from "./pages/BootNodesPage/BootNodesPage";
import SetupPage from "./pages/SetupPage/SetupPage";

Vue.use(Router);

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '',
      name: 'main-page',
      component: MainPage
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/file-explorer',
      name: 'file-explorer',
      component: FileExplorerPage
    },
    {
      path: '/boot-nodes',
      name: 'boot-nodes',
      component: BootNodesPage
    },
    {
      path: '/new-user',
      name: 'new-user',
      component: NewUser
    },
    {
      path: '/new-group',
      name: 'new-group',
      component: NewGroup
    },
    {
      path: '/edit-group/:groupId',
      name: 'edit-group',
      component: EditGroup
    },
    {
      path: '/content/:manifestId?',
      name: 'content-page',
      component: ContentPage
    },
    {
      path: '/joined-groups',
      name: 'joined-groups',
      component: JoinedGroups
    },
    {
      path: '/admined-groups',
      name: 'admined-groups',
      component: AdminedGroups
    },
    {
      path: '/group/',
      name: 'group-layout',
      component: GroupLayout,
      children: [
        {
          path: ':groupId',
          name: 'group-page',
          component: GroupPage
        },
        {
          path: ':groupId/posts/:postId',
          name: 'group-post-page',
          component: GroupPostPage
        }
      ]
    },
    {
      path: '*', redirect: '/'
    }
  ]
})
