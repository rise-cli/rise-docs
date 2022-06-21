module.exports = (props) => {
    return {
        Resources: {
            HttpApi: {
                Type: 'AWS::ApiGatewayV2::Api',
                Properties: {
                    Name: props.endpointName,
                    ProtocolType: 'HTTP'
                },
                DependsOn: props.lambdaName
            },
            HttpApiStage: {
                Type: 'AWS::ApiGatewayV2::Stage',
                Properties: {
                    ApiId: {
                        Ref: 'HttpApi'
                    },
                    StageName: '$default',
                    AutoDeploy: true,
                    DefaultRouteSettings: {
                        DetailedMetricsEnabled: false
                    }
                }
            },
            HelloLambdaPermissionHttpApi: {
                Type: 'AWS::Lambda::Permission',
                Properties: {
                    FunctionName: {
                        'Fn::GetAtt': [props.lambdaName, 'Arn']
                    },
                    Action: 'lambda:InvokeFunction',
                    Principal: 'apigateway.amazonaws.com',
                    SourceArn: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition'
                                },
                                ':execute-api:',
                                {
                                    Ref: 'AWS::Region'
                                },
                                ':',
                                {
                                    Ref: 'AWS::AccountId'
                                },
                                ':',
                                {
                                    Ref: 'HttpApi'
                                },
                                '/*'
                            ]
                        ]
                    }
                }
            },
            HttpApiIntegrationHello: {
                Type: 'AWS::ApiGatewayV2::Integration',
                Properties: {
                    ApiId: {
                        Ref: 'HttpApi'
                    },
                    IntegrationType: 'AWS_PROXY',
                    IntegrationUri: {
                        'Fn::GetAtt': [props.lambdaName, 'Arn']
                    },
                    PayloadFormatVersion: '2.0',
                    TimeoutInMillis: 6500
                }
            },
            HttpApiRouteDefault: {
                Type: 'AWS::ApiGatewayV2::Route',
                Properties: {
                    ApiId: {
                        Ref: 'HttpApi'
                    },
                    RouteKey: '$default',
                    Target: {
                        'Fn::Join': [
                            '/',
                            [
                                'integrations',
                                {
                                    Ref: 'HttpApiIntegrationHello'
                                }
                            ]
                        ]
                    }
                },
                DependsOn: 'HttpApiIntegrationHello'
            }
        },
        Outputs: {
            Endpoint: {
                Description: 'URL of the HTTP API',
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            {
                                Ref: 'HttpApi'
                            },
                            '.execute-api.',
                            {
                                Ref: 'AWS::Region'
                            },
                            '.',
                            {
                                Ref: 'AWS::URLSuffix'
                            }
                        ]
                    ]
                }
            }
        }
    }
}
