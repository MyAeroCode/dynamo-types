// import '../index';

// import * as chai from 'chai';
// import * as util from 'util';

// class TableMetadataStore {
//   attributes: AttributeDefinition[] = [];
//   defaultIndex: DefaultIndexDefinition;
//   globalSecondaryIndexes: GlobalSecondaryIndexDefinition[] = [];
// }
// const store: { [tableName: string]: TableMetadataStore } = {};

// function getTableMetadataStore(tableName: string) {
//   if (!store[tableName]) {
//     store[tableName] = new TableMetadataStore();
//   }

//   return store[tableName];
// }

// export function Table(options?: any) {
//   return (target: Function) => {
//     const metadata = getTableMetadataStore(target.name);

//     // Attributes
//     // Set up getter / setter for serialzation for DynamoDB

//     // defaultIndex
//     // define value for for given PropertyKey
//     Object.defineProperty(
//       target, metadata.defaultIndex.propertyKey,
//       {
//         value: new DefaultIndex(),
//       }
//     )

//     // GlobalSecondaryIndexes
//     // define value for for given PropertyKey
//     metadata.globalSecondaryIndexes.forEach((gsi) => {
//       Object.defineProperty(
//         target, gsi.propertyKey,
//         {
//           value: new Index(),
//         }
//       )
//     });

//     console.log(util.inspect(metadata, true));
//     console.log(util.inspect(target, true));
//   };
// }

// type PrimitiveAttributeType = (
//   Buffer// B
//   | Boolean // BOOL
//   | String // S
//   | null // NULL
//   | Number // N
// );
// type ComplexAttributeType = (
//   Boolean[] // BS
//   | PrimitiveAttributeType[] // L
//   | { [key: string]: AttributeType } // M
//   | Number[] // NS
//   | String[] // SS
// );
// type AttributeType = PrimitiveAttributeType | ComplexAttributeType;
// interface AttributeDefinition {
//   name: string;
//   type: AttributeType;
// }
// interface AttributeOptions {
//   name?: string;
//   type?: AttributeType;
// }
// export function Attribute(options: AttributeOptions = {}) {
//   return (object: object, propertyKey: string) => {
//     getTableMetadataStore(object.constructor.name)
//       .attributes.push({
//         name: options.name || propertyKey,
//         type: options.type || Reflect.getMetadata('design:type', object, propertyKey),
//       });
//   }
// }

// interface DefaultIndexOptions {
//   hashKey: string;
//   rangeKey?: string;
// }
// interface DefaultIndexDefinition {
//   hashKey: string;
//   rangeKey?: string;
//   propertyKey: string;
// }
// export function DefaultIndex(options: DefaultIndexOptions) {
//   return (table: Function, propertyKey: string) => {
//     getTableMetadataStore(table.name)
//       .defaultIndex = {
//         hashKey: options.hashKey,
//         rangeKey: options.rangeKey,
//         propertyKey: propertyKey,
//       };
//   }
// }

// interface GlobalSecondaryIndexOptions {
//   hashKey: string;
//   rangeKey?: string;
// }
// interface GlobalSecondaryIndexDefinition {
//   hashKey: string;
//   rangeKey?: string;
//   propertyKey: string;
// }
// export function GlobalSecondaryIndex(options: GlobalSecondaryIndexOptions) {
//   return (table: Function, propertyKey: string) => {
//     getTableMetadataStore(table.name)
//       .globalSecondaryIndexes.push({
//         hashKey: options.hashKey,
//         rangeKey: options.rangeKey,
//         propertyKey: propertyKey,
//       });
//   }
// }

// import * as AWS from 'aws-sdk';

// export class Index<Table, HashKeyType, RangeKeyType> {
//   private documentClient: AWS.DynamoDB.DocumentClient;

//   constructor(private tableName: string) {
//     this.documentClient = new AWS.DynamoDB.DocumentClient();
//   }

//   async scan(options: { Limit?: number }): Promise<Table[]> {
//     const res =
//       await this.documentClient
//         .scan({
//           TableName: this.tableName,
//           Limit: options.Limit,
//         })
//         .promise();
//     return this.fromItems(res.Items || []);
//   }

//   async batchGet(keyList: AWS.DynamoDB.KeyList): Promise<Table[]> {
//     const res = await this.documentClient
//                   .batchGet({
//                     RequestItems: {
//                       [this.tableName]: {
//                         Keys: keyList,
//                       }
//                     }
//                   })
//                   .promise();

//     return this.fromItems((res.Responses || {})[this.tableName] || []);
//   }

//   async batchPut(items: Item[]) {
//     const res = await this.documentClient
//                   .batchWrite({
//                     RequestItems: {
//                       [this.tableName]: items.map(item => {
//                         return {
//                           PutRequest: {
//                             Item: item,
//                           }
//                         };
//                       }),
//                     }
//                   })
//                   .promise();

//     return this.fromItems(items);

//   }

//   async put(item: Item) {
//     const res = await this.documentClient
//                   .put({
//                     TableName: this.tableName,
//                     Item: item,
//                   })
//                   .promise();

//     return this.fromItem(res.Attributes || []);
//   }
// }

// @Table()
// export class Word {
//   @Attribute()
//   word: string;

//   @Attribute()
//   createdAt: Date;

//   @Attribute()
//   authorId: number;

//   @DefaultIndex({ hashKey: 'word', rangeKey: 'createdAt' })
//   static defaultIndex: Index<Word, string, Date>;

//   @GlobalSecondaryIndex({ hashKey:'authorId', rangeKey: 'word' })
//   static authorIndex: Index<Word, number, string>;
// }

// describe("Complex Text", () => {
//   it("should work", () => {
//     const word = new Word();
//     word.word = "XXX";
//     word.createdAt = new Date();
//   });
// });