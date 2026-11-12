// Ava's add-on client is served by Ava herself, at /ava.js in every
// add-on's origin, so the version always matches the Ava it runs in. This
// package only types it: load /ava.js in your page, then use ava().

/** Ava's client, as /ava.js set it up. Throws outside Ava. */
export function ava() {
  const client = globalThis.ava
  if (!client || typeof client.request !== 'function') {
    throw new Error('Not running inside Ava: load /ava.js first (<script src="/ava.js"></script>).')
  }
  return client
}
