import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { CloudWatchLogsClient, TagResourceCommand } from "@aws-sdk/client-cloudwatch-logs"

export default class Logs implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const accountId = utils.accountId(resource)
        const region = utils.region(resource)
        const logs = new CloudWatchLogsClient()

        switch (resource.ResourceType) {
            case "AWS::Logs::LogGroup":
                try {
                    const resourceArn = `arn:aws:logs:${region}:${accountId}:log-group:${resource.PhysicalResourceId!}`
                    await logs.send(new TagResourceCommand({ resourceArn, tags }))
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
