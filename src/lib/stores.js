import { writable } from 'svelte/store'

// Index of the timeline event currently in view. -1 means the reader is still
// in the intro. Scrollama (in Timeline.svelte) is the single writer; the map,
// scrubber, and character all react to it — one-way data flow.
export const activeEventIndex = writable(-1)
