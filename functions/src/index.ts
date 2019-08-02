import * as functions from 'firebase-functions';
const App = require(`${process.cwd()}/dist/server`);
const universal = App.app;
// console.log(App);
// console.log(universal);
export const ssr = functions.https.onRequest(universal);