import { ResourceTagger, TagResourceResult } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { ECSClient, TagResourceCommand, UpdateServiceCommand, ListTasksCommand } from "@aws-sdk/client-ecs"

export default class ECS implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const region = utils.region(resource)
        const accountId = utils.accountId(resource)
        const ecs = new ECSClient()
        const _tags = Object.entries(tags).map(([key, value]) => ({ key, value }))

        switch (resource.ResourceType) {
            case "AWS::ECS::Cluster":
                try {
                    const resourceArn = `arn:aws:ecs:${region}:${accountId}:cluster/${resource.PhysicalResourceId!}`
                    await ecs.send(new TagResourceCommand({ resourceArn, tags: _tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            case "AWS::ECS::TaskDefinition":
                try {
                    const resourceArn = resource.PhysicalResourceId
                    await ecs.send(new TagResourceCommand({ resourceArn, tags: _tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            case "AWS::ECS::Service":
                try {
                    const promises: Promise<unknown>[] = []
                    const resourceArn = resource.PhysicalResourceId
                    promises.push(ecs.send(new TagResourceCommand({ resourceArn, tags: _tags })))
                    promises.push(ecs.send(new UpdateServiceCommand({
                        service: resource.PhysicalResourceId,
                        propagateTags: "SERVICE"
                    })))

                    const { taskArns } = await ecs.send(new ListTasksCommand({ serviceName: resource.PhysicalResourceId, }))
                    if (taskArns) {
                        promises.push(...taskArns.map((resourceArn) => {
                            return ecs.send(new TagResourceCommand({ resourceArn, tags: _tags }))
                        }))
                    }
                    await Promise.all(promises)

                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}