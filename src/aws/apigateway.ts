import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { APIGatewayClient, TagResourceCommand } from "@aws-sdk/client-api-gateway"

export default class ApiGateway implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const apig = new APIGatewayClient()

        switch (resource.ResourceType) {
            case "AWS::ApiGateway::RestApi":
                const resourceArn = `arn:aws:apigateway:${region}::/restapis/${resource.PhysicalResourceId!}`
                try {
                    await apig.send(new TagResourceCommand({ resourceArn, tags }))
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
