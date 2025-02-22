$version: "2.0"

namespace smithy.example

use aws.protocols#restJson1
use aws.apigateway#integration

/// Provides weather forecasts
@paginated(inputToken: "nextToken", outputToken: "nextToken", pageSize: "pageSize")
@restJson1
@title("Weather Service")
@integration(
    type: "aws_proxy",
    uri: "${lambdaArn}",
    httpMethod: "POST",
    passthroughBehavior: "when_no_match"
)
service Weather {
    version: "2006-03-01"
    resources: [City]
    operations: [GetCurrentTime]
    errors: [ServiceError, ThrottlingError]
}

@readonly
@http(method: "GET", uri: "/current-time")
operation GetCurrentTime {
    output := {
        @required
        time: Timestamp
    }
}
