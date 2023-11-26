"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const utils_1 = __importDefault(require("./utils"));
const client_cloudwatch_logs_1 = require("@aws-sdk/client-cloudwatch-logs");
class Logs {
    tagResource(resource, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountId = utils_1.default.accountId(resource);
            const region = utils_1.default.region(resource);
            const logs = new client_cloudwatch_logs_1.CloudWatchLogsClient();
            switch (resource.ResourceType) {
                case "AWS::Logs::LogGroup":
                    try {
                        const resourceArn = `arn:aws:logs:${region}:${accountId}:log-group:${resource.PhysicalResourceId}`;
                        yield logs.send(new client_cloudwatch_logs_1.TagResourceCommand({ resourceArn, tags }));
                        return _1.TagResourceResult.Success;
                    }
                    catch (error) {
                        throw error;
                    }
                default:
                    return _1.TagResourceResult.Unknown;
            }
        });
    }
}
exports.default = Logs;
