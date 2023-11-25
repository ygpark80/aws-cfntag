import { ResourceTagger, TagResourceResult } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { CloudWatchLogsClient, TagResourceCommand } from "@aws-sdk/client-cloudwatch-logs"

export default class Logs implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const accountId = utils.accountId(resource)
        const region = utils.region(resource)
        const logs = new CloudWatchLogsClient()

        switch (resource.ResourceType) {
            case "AWS::Logs::LogGroup":
                try {
                    const resourceArn = `arn:aws:logs:${region}:${accountId}:log-group:${resource.PhysicalResourceId!}`
                    await logs.send(new TagResourceCommand({ resourceArn, tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
