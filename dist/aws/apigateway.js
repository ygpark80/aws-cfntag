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
const client_api_gateway_1 = require("@aws-sdk/client-api-gateway");
class ApiGateway {
    tagResource(resource, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = utils_1.default.region(resource);
            const apig = new client_api_gateway_1.APIGatewayClient();
            switch (resource.ResourceType) {
                case "AWS::ApiGateway::RestApi":
                    const resourceArn = `arn:aws:apigateway:${region}::/restapis/${resource.PhysicalResourceId}`;
                    try {
                        yield apig.send(new client_api_gateway_1.TagResourceCommand({ resourceArn, tags }));
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
exports.default = ApiGateway;
