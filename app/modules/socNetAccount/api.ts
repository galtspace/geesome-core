import {IGeesomeApp} from "../../interface.js";
import IGeesomeSocNetAccount from "./interface.js";

export default (app: IGeesomeApp, socNetAccount: IGeesomeSocNetAccount) => {
	const api = app.ms.api.prefix('soc-net-account/');

	api.onAuthorizedPost('get', async (req, res) => {
		return res.send(await socNetAccount.getAccount(req.user.id, req.body.socNet, req.body.accountData), 200);
	});
	api.onAuthorizedPost('list', async (req, res) => {
		return res.send(await socNetAccount.getAccountList(req.user.id, req.body.accountData), 200);
	});
	api.onAuthorizedPost('update', async (req, res) => {
		return res.send(await socNetAccount.createOrUpdateAccount(req.user.id, req.body.accountData), 200);
	});
}