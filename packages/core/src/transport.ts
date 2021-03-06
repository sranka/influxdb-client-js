import Cancellable from './util/Cancellable'

export type Headers = {[header: string]: string | string[] | undefined}

/**
 * Observes communication with the server.
 */
export interface CommunicationObserver<T> {
  /**
   * Data chunk received, can be called mupliple times.
   * @param data - data
   */
  next(data: T): void
  /**
   * Communication ended with an error.
   */
  error(error: Error): void
  /**
   * Communication was successful.
   */
  complete(): void
  /**
   * Informs about a start of response processing.
   * @param headers - response HTTP headers
   */
  responseStarted?: (headers: Headers) => void
  /**
   * Setups cancelllable for this communication.
   */
  useCancellable?: (cancellable: Cancellable) => void
}

/**
 * Options for sending a request message.
 */
export interface SendOptions {
  method: string
  headers?: {[key: string]: string}
}

/**
 * Simpified platform-neutral data chunk manipulation, it might differ between
 * target platform (node vs browser).
 */
export interface ChunkCombiner {
  /**
   * Concatenates first and second chunk.
   * @param first - first chunk
   * @param second - second chunk
   * @returns first + second
   */
  concat(first: Uint8Array, second: Uint8Array): Uint8Array

  /**
   * Converts chunk into a string.
   * @param chunk - chunk
   * @param start - start index
   * @param end - end index
   * @returns string representation of chunk slice
   */
  toUtf8String(chunk: Uint8Array, start: number, end: number): string

  /**
   * Creates a new chunk from the supplied chunk.
   * @param chunk - chunk to copy
   * @param start - start index
   * @param end - end index
   * @returns a copy of a chunk slice
   */
  copy(chunk: Uint8Array, start: number, end: number): Uint8Array
}

/**
 * Simpified platform-neutral transport layer for communication with influx DB.
 */
export interface Transport {
  /**
   * Send data to the server and receive communication events via callbacks.
   *
   * @param path - HTTP request path
   * @param requestBody - HTTP request body
   * @param options  - send options
   * @param callbacks - communication callbacks to received data in Uint8Array
   */
  send(
    path: string,
    requestBody: string,
    options: SendOptions,
    callbacks?: Partial<CommunicationObserver<Uint8Array>>
  ): void

  /**
   * Sends data to the server and receives decoded result. The type of the result depends on
   * response's content-type (deserialized json, text).
  
   * @param path - HTTP request path
   * @param requestBody - request body
   * @param options - send options
   */
  request(path: string, body: any, options: SendOptions): Promise<any>

  /**
   * Returns operations for chunks emitted to the {@link send} method communication observer.
   */
  readonly chunkCombiner: ChunkCombiner
}
