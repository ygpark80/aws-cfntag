import { ResourceTagger, TagResourceResult } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { LambdaClient, TagResourceCommand } from "@aws-sdk/client-lambda"

export default class Lambda implements ResourceTagger {

    async tagResource(resource: StackResource, Tags: Record<string, string>) {
        const region = utils.region(resource)
        const accountId = utils.accountId(resource)
        const lambda = new LambdaClient()

        switch (resource.ResourceType) {
            case "AWS::Lambda::Function":
                try {
                    const Resource = `arn:aws:lambda:${region}:${accountId}:function:${resource.PhysicalResourceId!}`
                    await lambda.send(new TagResourceCommand({ Resource, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
