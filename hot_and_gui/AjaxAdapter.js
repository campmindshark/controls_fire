/**
 * @param {Object} ajax_props = {
 *      url,
 *      verb: "",
 *      header: {
 *        "content-type": "application/json",
 *        ...
 *      }
 *      controller: "",
 *      action: "",
 *      timeout: 30000 <-- in ms
 *      params: {
 *        path: "",
 *        query: {
 *          param0:val0,
 *          ...
 *        },
 *        body: {
 *          param0:val0,
 *          ...
 *        }
 *      }
 *    }
 **/
export default function ajax_adapter(ajax_props) {
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
    // Set the request timeout in MS
    x.timeout = ajax_props.timeout ? ajax_props.timeout : 4000;
    x.open(ajax_props.verb, final_url, true);
    add_headers(x);
    x.onabort = function() {
      throw new Error("[AJAX]: Request Aborted", ajax_props, "ECONNABORTED", x);
    };
    x.onerror = function() {
      throw new Error("[AJAX]: Network Error", ajax_props, null, x);
    };
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
    var body =
      "params" in ajax_props
        ? "body" in ajax_props.params ? ajax_props.params.body : null
        : null;
    x.send(body != null ? JSON.stringify(body) : null);

    function build_query_string(query_params) {
      if (!query_params) return;
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
    function add_headers(xhr) {
      if (ajax_props.headers) {
        var header_keys = Object.keys(ajax_props.headers);
        header_keys.forEach(header_key => {
          xhr.setRequestHeader(header_key, ajax_props.headers[header_key]);
        });
      }
    }
  });
}
