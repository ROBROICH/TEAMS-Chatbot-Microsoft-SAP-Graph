/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Defines the level of severity for the event.
 */
export declare enum Severity {
    Verbose = 0,
    Information = 1,
    Warning = 2,
    Error = 3,
    Critical = 4
}
export interface BotTelemetryClient {
    trackDependency(telemetry: TelemetryDependency): any;
    trackEvent(telemetry: TelemetryEvent): any;
    trackException(telemetry: TelemetryException): any;
    trackTrace(telemetry: TelemetryTrace): any;
    flush(): any;
}
export interface TelemetryDependency {
    dependencyTypeName: string;
    target: string;
    name: string;
    data: string;
    duration: number;
    success: boolean;
    resultCode: number;
}
export interface TelemetryEvent {
    name: string;
    properties?: {
        [key: string]: any;
    };
    metrics?: {
        [key: string]: number;
    };
}
export interface TelemetryException {
    exception: Error;
    handledAt?: string;
    properties?: {
        [key: string]: string;
    };
    measurements?: {
        [key: string]: number;
    };
    severityLevel?: Severity;
}
export interface TelemetryTrace {
    message: string;
    properties?: {
        [key: string]: string;
    };
    severityLevel?: Severity;
}
export declare class NullTelemetryClient implements BotTelemetryClient {
    constructor(settings?: any);
    trackDependency(telemetry: TelemetryDependency): void;
    trackEvent(telemetry: TelemetryEvent): void;
    trackException(telemetry: TelemetryException): void;
    trackTrace(telemetry: TelemetryTrace): void;
    flush(): void;
}
