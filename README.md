# cfntag

`cfntag` is a command-line tool for tagging AWS resources within a given CloudFormation Stack. Currently, it supports a limited number of AWS services. You can find the list of supported services in the [`src/aws`](./src/aws) folder. The current codebase serves my personal needs; if you need more resources to be implemented, please mention it in the [Issues](./issues) section.

## Usage

To use `cfntag`, you need to pass the stack name and tags as command-line arguments. You can run `cfntag` either by installing it globally or using `npx`:

```bash
# Run with global installation
npm install -g aws-cfntag
cfntag --stack-name my-stack --tags Key1=Value1,Key2=Value2

# Or run with npx
npx -p aws-cfntag cfntag --stack-name my-stack --tags Key1=Value1,Key2=Value2
```

In this command, replace `my-stack` with the name of your stack, and `Key1=Value1,Key2=Value2` with your tags.

## GitHub Actions

See [action.yml](action.yml)

```yaml
- uses: ygpark80/aws-cfntag@v1.0.9
  with:
    # The name or unique stack ID of the stack to update.
    stack-name: ''
    # The name of the AWS profile to use. (optional)
    profile: ''
    # Specifies a list of tags that you want to add to the specified resources.
    tags: |
      {
        "Key1": "Value1",
        "Key2": "Value2"
      }
    # or
    tags: 'Key1=Value1,Key2=Value2'
```
