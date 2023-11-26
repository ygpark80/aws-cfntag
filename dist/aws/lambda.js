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
const client_lambda_1 = require("@aws-sdk/client-lambda");
class Lambda {
    tagResource(resource, Tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = utils_1.default.region(resource);
            const accountId = utils_1.default.accountId(resource);
            const lambda = new client_lambda_1.LambdaClient();
            switch (resource.ResourceType) {
                case "AWS::Lambda::Function":
                    try {
                        const Resource = `arn:aws:lambda:${region}:${accountId}:function:${resource.PhysicalResourceId}`;
                        yield lambda.send(new client_lambda_1.TagResourceCommand({ Resource, Tags }));
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
exports.default = Lambda;