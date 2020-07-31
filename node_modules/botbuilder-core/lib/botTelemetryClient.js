"use strict";
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines the level of severity for the event.
 */
var Severity;
(function (Severity) {
    Severity[Severity["Verbose"] = 0] = "Verbose";
    Severity[Severity["Information"] = 1] = "Information";
    Severity[Severity["Warning"] = 2] = "Warning";
    Severity[Severity["Error"] = 3] = "Error";
    Severity[Severity["Critical"] = 4] = "Critical";
})(Severity = exports.Severity || (exports.Severity = {}));
class NullTelemetryClient {
    constructor(settings) {
        // noop
    }
    trackDependency(telemetry) {
        // noop
    }
    trackEvent(telemetry) {
        // noop
    }
    trackException(telemetry) {
        // noop
    }
    trackTrace(telemetry) {
        // noop
    }
    flush() {
        // noop
    }
}
exports.NullTelemetryClient = NullTelemetryClient;
//# sourceMappingURL=botTelemetryClient.js.map