// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // LOCALHOST
  base_api_url: '//project-manga.oo/',
  base_api_version: 'api/v1',
  base_api_key: '',

  // HEROKU
  // base_api_url: '//api-manga-arp.herokuapp.com/',
  // base_api_version: 'api/v1',
  // base_api_key: '',

  // API UMBRELLA
  // base_api_url: 'https://api-1.arproject.web.id/',
  // base_api_version: 'marp',
  // base_api_key: 'yTlZXy6QDHHz1cCQdEYCXfuhmIGvQGV7W3p2sIVv',


  base_oauth: 'api/oauth',
  REQUEST_CREDENTIALS: true,
  COOKIES_SECURED: true,

  RECAPTCHA_SITE_KEY: '6LeC06sUAAAAALKO32xlH6zg5deJRJHRwke6r8ym',

  nameWeb: 'PROJECT MANGA',
  setIntervalOnLoad: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
