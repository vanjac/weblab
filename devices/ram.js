const pages = 1

export const memory = new WebAssembly.Memory({ initial: pages, maximum: pages })
export const dataView = new DataView(memory.buffer)
export const u8Array = new Uint8Array(memory.buffer)

export const imports = {memory}
