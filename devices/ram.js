const pages = 1
export const memory = new WebAssembly.Memory({ initial: pages, maximum: pages })
export const dataView = new DataView(memory.buffer)
