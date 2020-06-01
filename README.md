# twitter-content-notes-webextension

[![Mozilla Addon](https://img.shields.io/amo/v/twitter-content-warning-button?color=%23)](https://addons.mozilla.org/de/firefox/addon/twitter-content-warning-button/)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/odmdlhkakdkidfcpaalkpgbmkaoclmkh?color=%23)](https://chrome.google.com/webstore/detail/twitter-content-warning-b/odmdlhkakdkidfcpaalkpgbmkaoclmkh)

This webextension hides tweets with a content note/warning behind a button. Supported patterns are:

- TW
- CN
- CW

Each of the patterns can be followed by a colon.

## Development

There are several tools needed for development:

- NodeJS
- yarn

### Install dependencies

    yarn install

### Watch mode for development

    yarn run watch

### Production

When compiling for production, run:

    yarn run build

This will generate a ZIP file in `zip/extension-<VERSION>.zip`.

## License

The code is licensed under the GNU GPLv3.
