export async function compressStringToGzip(inputString: string) {
    const encoder = new TextEncoder()
    const inputArray = encoder.encode(inputString)

    const compressionStream = new CompressionStream('gzip')
    const compressedStream = new ReadableStream({
        start(controller) {
            controller.enqueue(inputArray)
            controller.close()
        },
    }).pipeThrough(compressionStream)

    const reader = compressedStream.getReader()
    const chunks = []
    let result
    while (!(result = await reader.read()).done) {
        chunks.push(result.value)
    }

    const size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const compressedData = new Uint8Array(size)

    let offset = 0
    for (const chunk of chunks) {
        compressedData.set(chunk, offset)
        offset += chunk.length
    }

    return compressedData
}

export async function decompressGzipToString(
    compressedData: Uint8Array<ArrayBuffer>
) {
    const decompressionStream = new DecompressionStream('gzip')
    const compressedStream = new ReadableStream({
        start(controller) {
            controller.enqueue(compressedData)
            controller.close()
        },
    }).pipeThrough(decompressionStream)

    const reader = compressedStream.getReader()
    const chunks = []
    let result
    while (!(result = await reader.read()).done) {
        chunks.push(result.value)
    }

    const size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const decompressedData = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) {
        decompressedData.set(chunk, offset)
        offset += chunk.length
    }

    const decoder = new TextDecoder()
    return decoder.decode(decompressedData)
}
