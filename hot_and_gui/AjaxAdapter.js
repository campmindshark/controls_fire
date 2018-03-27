export default function ajax_adapter(ajax_props) {
  /*
  ajax_props = {
    url,
    verb = "",
    controller = "",
    action = "",
    params = {
      path = "",
      query = {
        param0:val0,
        ...
      },
      body = {
        param0:val0,
        ...
      }
    }
  }
  */
  console.log(ajax_props);
  return new Promise(resolve => {
    var x = new XMLHttpRequest();
    var final_url =
      ajax_props.url +
      "/" +
      ("controller" in ajax_props ? ajax_props.controller + "/" : "") +
      ("params" in ajax_props
        ? ("path" in ajax_props.params ? ajax_props.params.path + "/" : "") +
          ("action" in ajax_props ? ajax_props.action + "/" : "") +
          ("query" in ajax_props.params
            ? build_query_string(ajax_props.params.query)
            : "")
        : "action" in ajax_props ? ajax_props.action + "/" : "");
    console.log(final_url);
    x.open(ajax_props.verb, final_url, true);
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    x.onreadystatechange = function() {
      //Call a function when the state changes.
      if (x.readyState == 4) {
        if (x.status == 200) {
          resolve(x.responseText);
        } else {
          throw new Error(x.responseText);
        }
      }
    };
    x.send(
      "params" in ajax_props
        ? "body" in ajax_props.params ? ajax_props.params.body : null
        : null
    );

    function build_query_string(query_params = []) {
      var kvps = query_params.map(param => {
        var with_pluses = param.toString().replace(/,/i, "+");
        return keyFor(param).toString() + "=" + with_pluses;
      });
      if (kvps.length > 0) {
        var query_string = "?";
        for (var i = 0; i < kvps.length; i++) {
          query_string += kvps[i] + (i != kvps.length - 1 ? "&" : "");
        }
        return query_string;
      } else {
        return "";
      }
    }
  });
}
