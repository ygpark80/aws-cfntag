import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { ECSClient, TagResourceCommand } from "@aws-sdk/client-ecs"

export default class ECS implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const accountId = utils.accountId(resource)
        const ecs = new ECSClient()

        switch (resource.ResourceType) {
            case "AWS::ECS::Cluster":
                try {
                    const resourceArn = `arn:aws:ecs:${region}:${accountId}:cluster/${resource.PhysicalResourceId!}`
                    const _tags = Object.entries(tags).map(([key, value]) => ({ key, value }))
                    await ecs.send(new TagResourceCommand({ resourceArn, tags: _tags }))
                    utils.handleSuccess(resource)
                } catch (error) {
                    utils.handleError(resource, error)
                }
                break
            case "AWS::ECS::TaskDefinition":
            case "AWS::ECS::Service":
                try {
                    const resourceArn = resource.PhysicalResourceId
                    const _tags = Object.entries(tags).map(([key, value]) => ({ key, value }))
                    await ecs.send(new TagResourceCommand({ resourceArn, tags: _tags }))
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