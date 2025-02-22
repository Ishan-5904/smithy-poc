
# Smithy to OpenAPI Integration with API Gateway - POC

  

This proof of concept (POC) demonstrates the successful integration path from Smithy models to Amazon API Gateway using OpenAPI  specs as an intermediate format.

  

## Goal

  

To validate that Smithy models can be effectively:

1. Converted to OpenAPI specifications

2. Imported into API Gateway

3. Used as a source of truth for API definitions

  

## Implementation Steps

  

### 1. Install smithy CLI
[Installation - Smithy 2.0](https://smithy.io/2.0/guides/smithy-cli/cli_installation.html) follow this installation guide to install it 
 
use  ```smithy init -t smithy-to-openapi ``` for the test smithy model. It basically imports example smithy model from [example github repo](https://github.com/smithy-lang/smithy-examples/blob/main/conversion-examples/integ/expected-spec.openapi.json) using smithy cli

### 2. Smithy Model Development
added ``` aws.apigateway#integration ``` trait for  api  gateway integration in ```weather.smithy```
and added corresponding dependancy ```software.amazon.smithy:smithy-aws-apigateway-openapi:1.50.0``` in smithy-build.json

Use ```smithy build``` command to generate ```smithy-to-openapi/build``` containing open api specs

### 3. API Gateway Integration

- Created API Gateway using cdk

- Imported generated OpenAPI specification using ```specRestapi```

-  Changed dummy which was inserted in model test with actual lambda arn.

- Deployed to poc stage

  

## Key Findings

  

1.  **Successful Conversion**: Smithy models successfully converted to valid OpenAPI 3.0.2 specifications

2.  **API Gateway Compatibility**: Generated specs were compatible with API Gateway import

3.  **Maintainability**: Single source of truth in Smithy models

4.  **Automation Potential**: Process can be automated using github actions example [setup-smithy](https://github.com/marketplace/actions/setup-smithy) and [format-smithy](https://github.com/marketplace/actions/setup-smithy) for installing smithy cli.   

## Next Steps

  

- [ ] Automate the deployment process and building

- [ ]  Test out packaging of smithy models and automate building.

## Resources

  

- [Smithy Documentation](https://awslabs.github.io/smithy/)
- [Amazon API Gateway traits - Smithy 2.0](https://smithy.io/2.0/aws/amazon-apigateway.html)
- [smithy-build.json - Smithy 2.0](https://smithy.io/2.0/guides/smithy-build-json.html)
- [Converting Smithy to OpenAPI - Smithy 2.0](https://smithy.io/2.0/guides/model-translations/converting-to-openapi.html?utm_source=chatgpt.com)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

  
