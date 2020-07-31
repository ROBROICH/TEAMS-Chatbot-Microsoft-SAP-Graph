/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { WebResource, HttpOperationResponse, HttpClient } from '@azure/ms-rest-js';
import { IStreamingTransportServer } from 'botframework-streaming';
export declare class StreamingHttpClient implements HttpClient {
    private readonly server;
    /**
     * Creates a new streaming Http client.
     *
     * @param server Transport server implementation to be used.
     */
    constructor(server: IStreamingTransportServer);
    /**
     * This function hides the default sendRequest of the HttpClient, replacing it
     * with a version that takes the WebResource created by the BotFrameworkAdapter
     * and converting it to a form that can be sent over a streaming transport.
     *
     * @param httpRequest The outgoing request created by the BotframeworkAdapter.
     * @return The streaming transport compatible response to send back to the client.
     */
    sendRequest(httpRequest: WebResource): Promise<HttpOperationResponse>;
    private mapHttpRequestToProtocolRequest;
}
