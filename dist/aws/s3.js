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
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const client_s3_1 = require("@aws-sdk/client-s3");
class S3 {
    tagResource(resource, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3 = new client_s3_1.S3Client();
            switch (resource.ResourceType) {
                case "AWS::S3::Bucket":
                    try {
                        const Bucket = resource.PhysicalResourceId;
                        const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
                        const { TagSet: existingTags } = yield s3.send(new client_s3_1.GetBucketTaggingCommand({ Bucket }));
                        const TagSet = Array.from([...existingTags, ...Tags].reduce((map, tag) => map.set(tag.Key, tag), new Map()).values());
                        yield s3.send(new client_s3_1.PutBucketTaggingCommand({ Bucket, Tagging: { TagSet } }));
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
exports.default = S3;
