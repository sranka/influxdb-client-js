import {InfluxDB} from '@influxdata/influxdb-client'
import {APIBase, RequestOptions} from '../APIBase'
import {Flags} from './types'

export interface GetFlagsRequest {}
/**
 * See
 * * https://v2.docs.influxdata.com/v2.0/api/#operation/GetFlags
 */
export class FlagsAPI extends APIBase {
  /**
   * Creates FlagsAPI
   * @param influxDB - an instance that knows how to communicate with InfluxDB server
   */
  constructor(influxDB: InfluxDB) {
    super(influxDB)
  }
  /**
   * Return the feature flags for the currently authenticated user.
   * See https://v2.docs.influxdata.com/v2.0/api/#operation/GetFlags
   * @param request - request parameters and body (if supported)
   * @returns promise of response
   */
  getFlags(
    request?: GetFlagsRequest,
    requestOptions?: RequestOptions
  ): Promise<Flags> {
    return this.request('GET', `/api/v2/flags`, request, requestOptions)
  }
}
