// Compiled by `npm run check`: the types say what an add-on writes.
import { ava, type Manifest } from '../index.js'

export async function example() {
  const client = ava()
  const [folder] = await client.grants()
  if (!folder) return client.pickFolder()
  const notes = await client.files.list(folder.token)
  const text = await client.files.read(folder.token, notes[0]?.path ?? 'README.md')
  await client.storage.set('last', { at: Date.now(), length: text.length })
  return client.files.url(folder.token, notes[0]?.path)
}

export const manifest: Manifest = {
  id: 'moodboard',
  name: 'Moodboard',
  version: '1.0.0',
  permissions: ['files', 'tools'],
  tools: [{ name: 'add', description: 'Add an image.', effect: 'inside', input_schema: { type: 'object' } }],
}

// Files only for import and export: its tools reach Ava without a picked folder.
export const whiteboard: Manifest = {
  id: 'whiteboard',
  name: 'Whiteboard',
  version: '1.0.0',
  permissions: ['files', 'tools'],
  files: 'optional',
  tools: [{ name: 'draw', description: 'Draw a shape.', effect: 'inside', input_schema: { type: 'object' } }],
}

// @ts-expect-error: 'needed' or 'optional', nothing else.
export const sometimes: Manifest = { id: 'sometimes', name: 'Sometimes', version: '1.0.0', permissions: ['files'], files: 'sometimes' }
