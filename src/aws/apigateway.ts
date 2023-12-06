import { StackResource } from "@aws-sdk/client-cloudformation"
import { APIGatewayClient, TagResourceCommand } from "@aws-sdk/client-api-gateway"
import { ResourceTagger, TagResourceResult } from "../utils"
import utils from "../utils"

export default class ApiGateway implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const region = utils.region(resource)
        const apig = new APIGatewayClient()

        switch (resource.ResourceType) {
            case "AWS::ApiGateway::RestApi":
                const resourceArn = `arn:aws:apigateway:${region}::/restapis/${resource.PhysicalResourceId!}`
                try {
                    await apig.send(new TagResourceCommand({ resourceArn, tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
