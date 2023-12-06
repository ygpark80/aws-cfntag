import { StackResource } from "@aws-sdk/client-cloudformation"
import { EC2Client, CreateTagsCommand, DescribeAddressesCommand } from "@aws-sdk/client-ec2"
import { ResourceTagger, TagResourceResult } from "../utils"

export default class EC2 implements ResourceTagger {

    async tagResource(resource: StackResource, tags: Record<string, string>) {
        const ec2 = new EC2Client()

        switch (resource.ResourceType) {
            case "AWS::EC2::Instance":
            case "AWS::EC2::InternetGateway":
            case "AWS::EC2::VPC":
            case "AWS::EC2::RouteTable":
            case "AWS::EC2::Subnet":
            case "AWS::EC2::NatGateway":
                try {
                    const Resources = [resource.PhysicalResourceId!]
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await ec2.send(new CreateTagsCommand({ Resources, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    console.error(error)
                    throw error
                }
            case "AWS::EC2::EIP":
                try {
                    const eipId = resource.PhysicalResourceId!
                    const { Addresses } = await ec2.send(new DescribeAddressesCommand({ PublicIps: [eipId] }))
                    if (!Addresses) return TagResourceResult.Skip

                    const Resources = [Addresses[0]?.AllocationId!]
                    const Tags = Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
                    await ec2.send(new CreateTagsCommand({ Resources, Tags }))
                    return TagResourceResult.Success
                } catch (error) {
                    console.error(error)
                    throw error
                }
            case "AWS::EC2::SubnetRouteTableAssociation":
            case "AWS::EC2::Route":
            case "AWS::EC2::VPCGatewayAttachment":
                return TagResourceResult.Skip
            default:
                return TagResourceResult.Unknown
        }
    }

}
