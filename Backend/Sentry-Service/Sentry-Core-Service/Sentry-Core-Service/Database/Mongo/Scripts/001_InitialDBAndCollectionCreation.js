use Sentry

db.createCollection("UserCredential", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id"],
            additionalProperties: false,
            properties: {
                _id: {
                    bsonType: "binData",
                    description: "Guid identifier is required"
                },
                Credentials: {
                    bsonType: "array",
                    description: "List of credentials",
                    items: {
                        bsonType: "object",
                        required: [
                            "UserName",
                            "Email",
                            "DomainName",
                            "Password"
                        ],
                        additionalProperties: false,
                        properties: {
                            UserName: {
                                bsonType: "string"
                            },
                            Email: {
                                bsonType: "string"
                            },
                            PhoneNumber: {
                                bsonType: "string"
                            },
                            DomainName: {
                                bsonType: "string"
                            },
                            Password: {
                                bsonType: "string"
                            },
                            Pin: {
                                bsonType: ["string", "null"]
                            },
                            SecurityKeys: {
                                bsonType: ["string", "null"]
                            },
                            AdditionalInfo: {
                                bsonType: ["object", "null"],
                                additionalProperties: {
                                    bsonType: "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
});