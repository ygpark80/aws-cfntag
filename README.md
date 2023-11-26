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
