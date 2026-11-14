# @avacanada/ava-addon

The SDK for building [ava](https://heyava.ca) add-ons:
- types for `window.ava`, the client Ava serves to every add-on at `/ava.js`;
- types for the add-on manifest.

```sh
npm install --save-dev @avacanada/ava-addon
```

```ts
import { ava, type Manifest } from '@avacanada/ava-addon'

const client = ava()
const [folder] = await client.grants()
if (!folder) await client.pickFolder()
```

Up to 0.1.0 the package was `@addiscorp/ava-addon`. It's the same SDK under Ava's own npm scope from 0.2.0: change the dependency and the imports to `@avacanada/ava-addon`.

## Start here: avacanada/ava-addon-hello
[avacanada/ava-addon-hello](https://github.com/avacanada/ava-addon-hello) is the smallest real add-on, written as a tutorial: a manifest, a panel, one tool for Ava with an honest effect class, its own storage, self-hosted assets under the add-on's CSP, and a listing. Its README walks through each file, runs it as a dev add-on in Ava, explains the security model and publishes it to the catalogue. It's MIT: copy it and make it yours.

## What an add-on is
- An add-on is an MCP server that runs in its own sandboxed webview inside Ava.
- Ava and the person call into it freely. Anything that leaves it (files outside its grants, the network, other add-ons) goes through Ava, which checks it, logs it, and lets the person revoke it.
- Add-ons are published through the signed catalogue at [avacanada/ava-catalogue](https://github.com/avacanada/ava-catalogue).
- [avacanada/ava-addon-hello](https://github.com/avacanada/ava-addon-hello) is the example to copy.

## Releasing
Bump `version` in `package.json` and merge to `main`. `publish-sdk.yml` then publishes to npm through trusted publishing, in the `release` environment, with no npm token. It publishes only versions that aren't on npm yet.

## License
MIT © 2026 Sami Fouad
