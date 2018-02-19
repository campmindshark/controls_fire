export default class ScriptBuilder {
  constructor() {}

  static get_scripts(tables) {
    var scripts = [];
    for (var i = 0; i < tables.length; i++) {
      scripts.push({
        "drop_script": drop_table_script(tables[i]),
        "create_script": create_table_script(tables[i])
      });
    }

    return scripts;

    function create_table_script(table_map) {
      var script = `CREATE TABLE tbl` + table_map.name + ` ( `;
      table_map.columns.forEach((elm, i, col_array) => {
        script += elm.name + ` ` + elm.type +
          (i == col_array.length - 1 ? ` ` : `,`);
      });
      script += `);`;
      return script;
    }

    function drop_table_script(table_map) {
      return `DROP TABLE IF EXISTS tbl` + table_map.name + ';';
    }
  }

  static delete_script(table_map, where) {
    var script = 'DELETE FROM tbl' + table_map.name + ' WHERE ' + where + ';';
    return script;
  }


}
