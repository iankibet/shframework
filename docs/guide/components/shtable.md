# Sh Table

sh-table is a component that generates a table. It's a wrapper around the bootstrap table.
Using this component makes your work easier and faster.
To generate a table, you need to pass the headers, and the end-point of the table data. This will populate the table with the data from the end-point.
Sounds cool right?
Let's see how to use it.

## importing

```javascript
import { ShTable } from "@iankibetsh/shframework";
```

## Example Usage

```html
<sh-table :headers="['id','name','description']" end-point="tasks/list" />
```

### Accessing Nested Data (Dot Notation)

You can access nested object properties using dot notation in the headers array.

```html
<sh-table :headers="['id', 'user.name', 'user.email']" end-point="users/list" />
```

### Custom Column Formatting (Named Slots)

You can provide custom formatting for any column by using a slot named after the header key. Each slot provides access to the full row data via the `row` prop and the column `index`.

```html
<sh-table :headers="['id', 'name', 'age']" end-point="users/list">
  <template #age="{ row }">
    <span class="badge bg-info">{{ row.age }} Years Old</span>
  </template>
</sh-table>
```

## Attributes

### `headers`

- Type: `array`
- Default: `none`
- Required: `true`
- Details

  These are table headers for the table that will be generated

      Example: `['id','name','description']`

      You can also use dot notation for nested keys: `['id', 'user.name', 'profile.email']`.

      #### Automatic Label Generation
      If a simple string is provided in the headers, `sh-table` will automatically generate a human-readable label from it.
      For example, `user_name` becomes **User Name** and `user.first_name` becomes **First Name**.

### `end-point`

- Type: `string`
- Default: `none`
- Required: `true`
- Details

  It's the endpoint of table data, usually it's the backend api url

      Example: `tasks/list`

### multi-actions

- Type: `array`
- Default: `[]`
- Required: `false`
- Details:
  An array of action objects to be performed on selected items. Each object contains: - `label`: Button text. - `icon`: Bootstrap icon class. - `class`: CSS class for the button.
  - `callback`: Function called with an array of selected record objects.
  - `permission`: (Optional) Permission slug required to see/perform this action.
  - `class`: (Optional) CSS class for the button.
- `path` / `url`: URL to navigate to (supports `{id}` placeholders). - `emits` / `callback` / `callBack`: Event name string or a callback function. - `type`: `confirmAction`, `silentAction`, or `dropdown`.

### links

- Type: `object`
- Required: `false`,
- Default: `none`
- Details

  In case you want to add links to table data you can use this attribute.
  It's an object with the following properties

Example Usage

```
:links="{
  id: {
    url: '/tasks/{id}/details',
     target: '_blank'
  }
}"
```

The above will add a link to the id column with the url `/tasks/{id}/details` and the open in a new tab

### actions

- Type: `object`
- Required: `false`,
- Default: `none`
- Details

  This will be the buttons attached to the end colum of the table containing header label, actions and action callbacks,
  When a emits value is string, it emits an event, and you have to listen to that event. The easy way is to use a function callback

- Example With Emitter

```
:actions="{
label: 'Action',
        actions: [
  {
    label: 'EDIT',
    class: 'btn btn-info btn-sm',
    type: 'emitter',
    emits: 'editDocument'
  }
]
}"
```

- Example With Action Callback

```
:actions="{
label: 'Action',
        actions: [
  {
    label: 'EDIT',
    class: 'btn btn-info btn-sm',
    type: 'emitter',
    emits: editDocument
  }
]
}"
```

- Example With Offcanvas

```
:actions="{
      label: 'Action',
      actions: [
        {
          label: 'Permissions',
          canvasPosition: 'start',
          canvasTitle: 'View Department',
          canvasId: 'departmentsCanvas',
          canvasSize: 'lg',
          canvasComponent: ViewDepartment,
          class: 'btn btn-info btn-sm',
          icon: 'bi-plus',
        }
      ]
    }"
```

### `cache`

- Type: `boolean | null`
- Default: `null`
- Details:
  Explicitly enables or disables caching for this table. If set to `null` (default), it respects the global `enableTableCache` setting in the `ShFrontend` plugin configuration.

### `row-link`

- Type: `string`
- Default: `none`
- Details:
  Defines a clickable link for the entire row. Supports dynamic placeholders using curly braces.

  Example:

  ```html
  <sh-table
    :headers="['id', 'name']"
    end-point="tasks/list"
    row-link="/tasks/task/{id}"
  />
  ```

  In the above example, `{id}` will be replaced with the actual `id` from the row data.

### `cache-key`

- Type: `string`
- Default: `none` (auto-generated)
- Details:
  A unique key used to store the table data in IndexedDB. If not provided, it is automatically generated based on the `end-point` or `query`.

---

## Caching & Background Loading

`sh-table` uses a modern caching mechanism powered by **IndexedDB**.

1. **Global Configuration**: Enable it for all tables in your `main.js`:
   ```javascript
   app.use(ShFrontend, {
     enableTableCache: true,
     // ...
   });
   ```
2. **Instant Display**: When a table is loaded, it immediately checks for cached data. If found, it displays the data instantly, hiding the initial loading spinner.
3. **Background Update**: While the cached data is displayed, the component fetches fresh data from the backend in the background and updates the table/cache automatically.
4. **Search Behavior**: When a search is initiated, the component ignores cached data, clears the table, and shows a loading spinner to ensure the user receives fresh, accurate search results.
