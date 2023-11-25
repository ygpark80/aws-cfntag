import { ACM } from "@aws-sdk/client-acm"
import { CloudFormation } from "@aws-sdk/client-cloudformation"
import { CloudWatchLogs } from "@aws-sdk/client-cloudwatch-logs"
import { EC2 } from "@aws-sdk/client-ec2"
import { ECS } from "@aws-sdk/client-ecs"
import { ElasticLoadBalancingV2 } from "@aws-sdk/client-elastic-load-balancing-v2"
import { IAM } from "@aws-sdk/client-iam"
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts"
import { APIGateway } from "@aws-sdk/client-api-gateway"
import { ApiGatewayV2 } from "@aws-sdk/client-apigatewayv2"
import { Lambda } from "@aws-sdk/client-lambda"
import { S3 } from "@aws-sdk/client-s3"

export async function tagStack(StackName: string, Tags: { Key: string, Value: string }[]) {
	const sts = new STSClient()
	const { Account: accountId } = await sts.send(new GetCallerIdentityCommand({}))

	const cfn = new CloudFormation()
	const { StackResources } = await cfn.describeStackResources({ StackName })

	for (const resource of StackResources!) {
		try {
			const region = resource.StackId!.split(':')[3]
			const resourceTypePrefix = resource.ResourceType!.split('::')[1]
			switch (resourceTypePrefix) {
				case "ApiGateway":
					switch (resource.ResourceType) {
						case "AWS::ApiGateway::RestApi":
							const resourceArn = `arn:aws:apigateway:${region}::/restapis/${resource.PhysicalResourceId!}`
							const apig = new APIGateway({ region })
							await apig.tagResource({ resourceArn, tags: Tags.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {}) })
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					break
				case "ApiGatewayV2":
					switch (resource.ResourceType) {
						case "AWS::ApiGatewayV2::Api":
							const ResourceArn = `arn:aws:apigateway:${region}::/apis/${resource.PhysicalResourceId!}`
							const apig = new ApiGatewayV2({ region })
							await apig.tagResource({ ResourceArn, Tags: Tags.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {}) })
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					break
				case "ElasticLoadBalancingV2":
					const elbv2 = new ElasticLoadBalancingV2({ region })
					await elbv2.addTags({ ResourceArns: [resource.PhysicalResourceId!], Tags })
					break
				case "ECS":
					const ecs = new ECS()
					let resourceArn
					switch (resource.ResourceType) {
						case "AWS::ECS::Cluster":
							resourceArn = `arn:aws:ecs:${region}:${accountId}:cluster/${resource.PhysicalResourceId!}`
							break
						case "AWS::ECS::TaskDefinition":
						case "AWS::ECS::Service":
							resourceArn = resource.PhysicalResourceId
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					await ecs.tagResource({
						resourceArn, tags: Tags.map(({ Key, Value }) => ({ key: Key, value: Value }))
					})
					break
				case "IAM":
					const iam = new IAM()
					switch (resource.ResourceType) {
						case "AWS::IAM::Role":
							await iam.tagRole({ RoleName: resource.PhysicalResourceId!, Tags })
							break
						case "AWS::IAM::User":
							await iam.tagUser({ UserName: resource.PhysicalResourceId!, Tags })
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					break
				case "Lambda":
					const lambda = new Lambda()
					switch (resource.ResourceType) {
						case "AWS::Lambda::Function":
							const Resource = `arn:aws:lambda:${region}:${accountId}:function:${resource.PhysicalResourceId!}`
							await lambda.tagResource({
								Resource,
								Tags: Tags.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {})
							})
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					break
				case "Logs":
					const logs = new CloudWatchLogs()
					await logs.tagLogGroup({
						logGroupName: resource.PhysicalResourceId!,
						tags: Tags.reduce((acc, { Key, Value }) => ({ ...acc, [Key]: Value }), {})
					})
					break
				case "EC2":
					const ec2 = new EC2();
					await ec2.createTags({ Resources: [resource.PhysicalResourceId!], Tags })
					break
				case "S3":
					const s3 = new S3()
					switch (resource.ResourceType) {
						case "AWS::S3::Bucket":
							const Bucket = resource.PhysicalResourceId!
							const { TagSet: existingTags } = await s3.getBucketTagging({ Bucket })
							const TagSet = Array.from([...existingTags!, ...Tags].reduce((map, tag) => map.set(tag.Key, tag), new Map()).values())
							await s3.putBucketTagging({ Bucket, Tagging: { TagSet } })
							break
						default:
							console.log(`No tagging logic implemented for resource type: ${resource.ResourceType}`)
							break
					}
					break
				default:
					console.log(`No tagging logic implemented for resource type prefix: ${resourceTypePrefix}`)
					console.log(resource)
			}
		} catch (e) {
			console.error(e)
			console.error(resource)
			return
		}
	}
}