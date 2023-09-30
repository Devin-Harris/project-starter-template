# Backend guide

This guideline highlights the folder structure and general pattern for the backend application.

## Folder Structure

The backend folder structures worth noting follows the following pattern:

- **app**
  - **core**
    _Contains the core level api stack files to help rapid development of new features. Essentially generic classes responsible for defining the common controller/provider/business logic/data access definitions that individual features can extend._
  - **database-connection**
    _Contains the module and ormconfig for the database connection. The `ormconfig.ts` file is used for static database connection attributes (things like where migrations/entities are stored, whether ssl is required, etc...) and should most likely not change from branch-to-branch/developer-to-developer. The less static fields are provided through the environment variables located in the envs folder._
  - **features**
    _Contains the individual features our app provides. Generally anything that can has a database table could be defined as a feature and would most likely extend the entity base classes located in the core folder. Other features may include services for image uploading, websocket hub connections, etc..._
  - **migrations**
    _Contains the migrations used for manipulating our database schema. With the synchronize: true flag turned off, any entity changes/additions/removals must be mimicked trough a migrations. Things like creating a table, dropping a table, renaming a table, adding a column, changing the type/name of a column, etc... are all examples of when a migrations will be needed. Use the `npm run db:create-migration --name=SomeName` to auto generate a base migration file with the current timestamp. Use the `npm run db:sync-schema` to auto generate the migration and entity indices into .js files so nest can correctly trigger/load newly created or updated migrations/entities._
- **envs**
  _Stores the environment variables. These are sensitive variables that should not be put in the git repository. They provide passwords, connection strings, etc... for various different services across our app. They can also change depending on the environment they are deployed in. For example, a production environment may point to a different database than a dev or qa environment. Devs may manipulate these to point to their own database to run development on._

## Rapid Api Stack Pattern

Utilizing the base files located in the core folder allow for very quick development of new api stacks and a consistent flow for any given request to our api.

The base files perform different functions highlighted here:

- **Repository**
  _The Repository is the data access layer. It is responsible for interacting with the actual data and defines what table is it is manipulating/querying based on the entity provided to it generically_
- **Business Logic**
  _The Business Logic is the layer above the data access. It provides the ability to define specific rules for various different parts of the request life cycle. Namely there are preGet, postGet, preSave, postSave, preDelete, and postDelete methods you can override in the specific api stacks implementation. These are helpful when you want to apply a rule to all requests to the entity you are providing (say you have a users table, and you want to make sure only certain authorized requests can create users. You could add this check in the preSave business logic and throw an exception if the request is not coming from an authorized source)_
- **Provider**
  _The Provider level is where most of the request logic is done. It consumes both the repository and the business logic as dependencies. It also defines a variety of methods the controller will have access to. This methods include getMany, getOne, saveMany, saveOne, deleteMany, and deleteOne. This methods execute the business logic rules before and after the actual data is queried from the repository and also handles mapping the entity objects to the respective dtos, which are passed in from the controller._
- **Controller**
  _The Controller level is above the provider level. It consumes a provider as a dependency and outlines the routes available for the api. The base controller allows for a Get, Post, Delete route for both getting, updating/creating, and deleting many entities and single entities (if a primary key id is passed in as a secondary portion of the endpoint route). It is also where the reponse, create, and update dtos are defined and sent to the provider level._

Of course these base classes are extensible so if you want to define a special route/method/etc on any given controller/provider/businesslogic/repository class you can, but the base classes allow a ton of functionality out of the box and should cover most api stack necessities.

When making a new api stack you should also first:

- Create the migration for the new table you are representing
- Create an entity file in the shared library representing new table
- Rerun the backend or run the Sync Schema task/npm script

Then continue building out the api stack starting with the repository and ending with the controller as highlighted by the order above.

## Serving/Deploying

As mentioned above the backend is using nestjs. To serve the backend you can use the nx cli (if you have it installed globally):
`nx serve backend`
or you can use the vscode task created:
`CTRL+SHIFT+P` &rarr; `Tasks: Run Task` &rarr; `Server`
_The server is also served alongside the client when you run the `Dev` task as well_
_Using the task also automatically runs the `Sync Schema` task to recompile the entities/migrations before the backend is initialized. This allows any migrations that havent already ran to run on app start_

## Enums

Typescript enums have a few problems.

Firstly you can attach many different kinds of values to the unique keys you provide:

```
enum HousingTypes {
   House,
   Apartment = 'Apartment',
   Dorm = 1
}
```

This of course is problematic when we try to use this enum on a column for a given entity. For example, say you have a Post Entity with a HousingType column. That column could not be represented by the value for the above enum because the values are both numbers and strings in that example.

You may say just use the key name (so string column where "House" | "Apartment" | "Dorm" is the value), but what if the key name ever changes. Any post created with "Apartment" would have no way of knowing that the enum now calls that type "ApartmentComplex" and thus filtering/displaying logic from the UI could be broken.

Because of this we are using a class based approach to enums:

```
@Enum('HousingTypes')
export class HousingTypes extends EnumClass {
    static House: EnumValue = 0
    static Dorm: EnumValue = 1
    static Apartment: EnumValue = { id: 3, displayName: 'Apartment Complex' }
}
```

First the Enum decorator is a custom decorator that takes a string as a parameter. This is the name of the table that will be created for this enum. All enum tables will be created with a id (int), value (varchar), and displayname(varchar) column. This is also inforced by the EnumValue typing you see on each field within the class. The decorator also handles mapping the fields of the class in such a way that our enum-sync service can easily distinguish what updates need to be made to sync our current implementation of an enum with the version stored in a database.

The enum-sync service on module init first loops over all enums exported from the shared enum folder. It queries each enums root table name for all the fields that currently exist in the table for the enum. If the current implementation has an field name change, display name change, removal of a field, or addition of a new field it will collect all that information and send a warning message in the console. The enum-sync controller also utilizes this service to automatically generate a migration to get the current implementation in sync. You can do this by making a POST request to the **/api/enum-sync** endpoint and it should automatically create the migration file and run the task for syncing the schema to the db (allows the app to auto run the migration as it rebuilds).

Also note the static keyword on the enum fields. This is necessary for intellisense as we use the enum. Without it we would have to instantiate the class before trying to pull a fields value. So if we have some post `let p: Post = {...some post information, housingType: 1}` we could for instance compare the housingType on the post to do some logic like this: `if (p.housingType === HousingTypes.House) {...}` insetad of `if (p.housingType === new HousingTypes().House) {...}`

With this approach we can also dynamically set a display name. This is useful because the field name on the class follows the javascript variable naming conventions/rules. If we want to display a user friendly version of the field name we we have to use a condition check on the frontend something like:

```
function getDisplayName(housingType: HousingTypes): string {
   if (housingType === HousingTypes.Apartment) {
      return 'Apartment Complex'
   } else {
      return Object.keys(HousingTypes).find(h => HousingTypes[h] === housingType)
   }
}
```

which is a bit verbose. Instead with this pattern we can simply utilize the displayname directly off the housingType value:

```
function getDisplayName(housingTypeValue: EnumValue): string {
   const housingType: EnumLookup = HousingTypes.get(housingTypeValue);
   return housingType.displayName
}
getDisplayName(3); // 'Apartment Complex'
getDisplayName(HousingTypes.Apartment); // 'Apartment Complex'
getDisplayName(HousingTypes.House); // 'House'
```

So in short when creating enums DO NOT use the built in **enum** operator. Instead follow the class pattern with the enum decorator, static fields and EnumClass extension to provide functionality to sync enums to database schema which ensures data integrity as enums evolve.
