# Metadata-Picklists-PCF
These are 2 PCF controls using Fluent v9 - one for tables and one for attributes.  You can install one without the other (although the Attributes picklist requires a table logical name as an input parameter)

### Table Control
#### Parameters:
- Bound to SingleLine.Text field
- Show Tables (Enum)
  - **All Tables**: Shows all tables in the environment
  - **App Only**: Only shows tables included in the current Model-Driven App

#### OutPut:
- String: *DisplayName|LogicalName*

### Attribute Control
#### Parameters:
- Bound to SingleLine.Text field
- TableName
  - Bound to SingleLine.Text field
  - Value can be Table Logical Name or *DisplayName|LogicalName*
 
#### Output:
- String: *DisplayName|LogicalName*


![MetadataPicklists](https://github.com/pvogtner/Metadata-Picklists-PCF/blob/0c74491a6cd854a440d2399d2966a38df0b52e90/pics/MetadataPicklists.gif)
