import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { ElasticLoadBalancingV2Client, AddTagsCommand } from "@aws-sdk/client-elastic-load-balancing-v2"

export default class ElasticLoadBalancingV2 implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const elbv2 = new ElasticLoadBalancingV2Client()

        switch (resource.ResourceType) {
            case "AWS::ElasticLoadBalancingV2::LoadBalancer":
                try {
                    const ResourceArns = [resource.PhysicalResourceId!]
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    elbv2.send(new AddTagsCommand({ ResourceArns, Tags  }))
                    utils.handleSuccess(resource)
                } catch (error) {
                    utils.handleError(resource, error)
                }
                break
            default:
                utils.handleUnknown(resource)
                break
        }
    }

}
