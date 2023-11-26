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
const client_elastic_load_balancing_v2_1 = require("@aws-sdk/client-elastic-load-balancing-v2");
class ElasticLoadBalancingV2 {
    tagResource(resource, tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const elbv2 = new client_elastic_load_balancing_v2_1.ElasticLoadBalancingV2Client();
            switch (resource.ResourceType) {
                case "AWS::ElasticLoadBalancingV2::LoadBalancer":
                    try {
                        const ResourceArns = [resource.PhysicalResourceId];
                        const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));
                        elbv2.send(new client_elastic_load_balancing_v2_1.AddTagsCommand({ ResourceArns, Tags }));
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
exports.default = ElasticLoadBalancingV2;
