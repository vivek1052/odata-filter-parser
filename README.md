# Odata-filter-parser
One of the main shortcomings of REST is inability to support filter queries. If the queries involve nested logical operators( AND, OR), it need specific custom implementation and your own **Query language**. 

 Odata has this shortcoming covered since they support *$filter* query parameter. Although, projects which are already built on REST might feel difficult to move to OData. 
 
 This library is created to solve this issue, where we can have simplicity of REST along with filtering capability of Odata. This is a database agnostic library which can be used to parse Odata $filter to a database specific query.
 
# Example
```
  import { QueryFilterParser, MongoStrategy } from "@sede-x/odata-filter-parser";
  
  const odataQuery = "( bookPrice gte 100 and ( authorName contains 'King' or releaseYear eq 2023 ))";
  
  const mongoQuery = new QueryFilterParser(new MongoStrategy()).parse(odataQuery);
```

You will get a Mongo Db filter which can be directly injected into queries like find.

```
{
  $and: [{
          $or: [
                  { releaseYear: 2023 },
                  { authorName : { $regex: 'King' }}
               ]
         },
         {
          bookPrice: { $gte: 100 } 
         }]
}
```
As an example, two database strategies are created in this repo (Mongodb, sqlite) but one can very easily create/update their specific database strategies by implementing *DBStrategy<FilterType>*. 
  This interface requires two method implementation *mapConditional* which maps 'eq', 'gte' etc to database specific conditional operators and *mapLogic* which maps and, or to database specifc logical operator. 
