import { ResourceTagger } from "."
import utils from "./utils"
import { StackResource } from "@aws-sdk/client-cloudformation"
import { ApiGatewayV2Client, TagResourceCommand } from "@aws-sdk/client-apigatewayv2"

export default class ApiGatewayV2 implements ResourceTagger {

    async tagResource(resource: StackResource, Tags: Record<string, string>): Promise<void> {
        const region = utils.region(resource)
        const apig = new ApiGatewayV2Client()

        switch (resource.ResourceType) {
            case "AWS::ApiGatewayV2::Api":
                try {
                    const ResourceArn = `arn:aws:apigateway:${region}::/apis/${resource.PhysicalResourceId!}`
                    await apig.send(new TagResourceCommand({ ResourceArn, Tags }))
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
