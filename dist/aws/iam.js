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
const client_iam_1 = require("@aws-sdk/client-iam");
class IAM {
    tagResource(resource, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const iam = new client_iam_1.IAMClient();
            switch (resource.ResourceType) {
                case "AWS::IAM::Role":
                    try {
                        const RoleName = resource.PhysicalResourceId;
                        const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
                        yield iam.send(new client_iam_1.TagRoleCommand({ RoleName, Tags }));
                        return _1.TagResourceResult.Success;
                    }
                    catch (error) {
                        throw error;
                    }
                case "AWS::IAM::User":
                    try {
                        const UserName = resource.PhysicalResourceId;
                        const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
                        yield iam.send(new client_iam_1.TagUserCommand({ UserName, Tags }));
                        utils_1.default.handleSuccess(resource);
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
exports.default = IAM;
