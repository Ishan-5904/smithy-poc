import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as fs from 'fs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Define Lambda function
    const myLambda = new lambda.Function(this, 'MyLambdaHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
    });

    // 2. Load OpenAPI specification and replace Lambda ARN
    const lambdaArn = `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${myLambda.functionArn}/invocations`;
    const openApiSpec = JSON.parse(fs.readFileSync('../smithy-to-openapi/build/smithy/openapi-conversion/openapi/Weather.openapi.json', 'utf8'));

    // Replace the Lambda ARN in all integration URIs
    Object.values(openApiSpec.paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (method['x-amazon-apigateway-integration']) {
          method['x-amazon-apigateway-integration'].uri = lambdaArn;
        }
      });
    });

    // 3. Create API Gateway
    const api = new apigateway.SpecRestApi(this, 'MyApiGateway', {
      restApiName: 'SmithyAPI',
      apiDefinition: apigateway.ApiDefinition.fromInline(openApiSpec),
      deployOptions: {
        stageName: 'poc',
      },
    });

    // 4. Grant API Gateway permission to invoke Lambda
    myLambda.addPermission('APIGatewayInvoke', {
      principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: cdk.Stack.of(this).formatArn({
        service: 'execute-api',
        resource: api.restApiId,
        resourceName: '*/*/*'
      }),
      action: 'lambda:InvokeFunction',
    });

    // 5. Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
  }
}
