# twitter-content-notes-webextension

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