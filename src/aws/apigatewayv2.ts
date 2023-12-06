import { StackResource } from "@aws-sdk/client-cloudformation"
import { ApiGatewayV2Client, TagResourceCommand } from "@aws-sdk/client-apigatewayv2"
import { ResourceTagger, TagResourceResult } from "../utils"
import utils from "../utils"

export default class ApiGatewayV2 implements ResourceTagger {

    async tagResource(resource: StackResource, Tags: Record<string, string>) {
        const region = utils.region(resource)
        const apig = new ApiGatewayV2Client()

        switch (resource.ResourceType) {
            case "AWS::ApiGatewayV2::Api":
                try {
                    const ResourceArn = `arn:aws:apigateway:${region}::/apis/${resource.PhysicalResourceId!}`
                    await apig.send(new TagResourceCommand({ ResourceArn, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    throw error
                }
            default:
                return TagResourceResult.Unknown
        }
    }

}
