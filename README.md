# @addiscorp/ava-addon

The SDK for building [ava](https://heyava.ca) add-ons:
- types for `window.ava`, the client Ava serves to every add-on at `/ava.js`;
- types for the add-on manifest.

```sh
npm install --save-dev @addiscorp/ava-addon
```

```ts
import { ava, type Manifest } from '@addiscorp/ava-addon'

const client = ava()
const [folder] = await client.grants()
if (!folder) await client.pickFolder()
```

## What an add-on is
- An add-on is an MCP server that runs in its own sandboxed webview inside Ava.
- Ava and the person call into it freely. Anything that leaves it (files outside its grants, the network, other add-ons) goes through Ava, which checks it, logs it, and lets the person revoke it.
- Add-ons are published through the signed catalogue at [addiscorp/ava-catalogue](https://github.com/addiscorp/ava-catalogue).
- [addiscorp/ava-notebook](https://github.com/addiscorp/ava-notebook) is a complete example.

## Releasing
Bump `version` in `package.json` and merge to `main`. `publish-sdk.yml` then publishes to npm through trusted publishing, in the `release` environment, with no npm token. It publishes only versions that aren't on npm yet.

## License
MIT © 2026 Sami Fouad
