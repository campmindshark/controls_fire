/** @param {Object} req = {
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
export default function xhr(req) {
  console.log(req);
  return new Promise(resolve => {
    const x = new XMLHttpRequest();
    const final_url =
      req.url +
      "/" +
      ("controller" in req ? req.controller + "/" : "") +
      ("params" in req
        ? ("path" in req.params ? req.params.path + "/" : "") +
          ("action" in req ? req.action + "/" : "") +
          ("query" in req.params ? build_query_string(req.params.query) : "")
        : "action" in req ? req.action + "/" : "");
    // Set the request timeout in MS
    x.timeout = req.timeout ? req.timeout : 4000;
    x.open(req.verb, final_url, true);
    add_headers(x);
    x.onabort = function() {
      throw new Error("[AJAX]: Request Aborted", req, "ECONNABORTED", x);
    };
    x.onerror = function() {
      throw new Error("[AJAX]: Network Error", req, null, x);
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
    const body =
      "params" in req ? ("body" in req.params ? req.params.body : null) : null;
    const postBody = body != null ? JSON.stringify(body) : null;
    console.log(postBody);
    x.send(postBody);

    function build_query_string(query_params) {
      if (!query_params) return;
      const kvps = query_params.map(param => {
        const with_pluses = param.toString().replace(/,/i, "+");
        return keyFor(param).toString() + "=" + with_pluses;
      });
      if (kvps.length > 0) {
        let query_string = "?";
        for (let i = 0; i < kvps.length; i++) {
          query_string += kvps[i] + (i != kvps.length - 1 ? "&" : "");
        }
        return query_string;
      } else {
        return "";
      }
    }
    function add_headers(xhr) {
      if (req.headers) {
        const header_keys = Object.keys(req.headers);
        header_keys.forEach(header_key => {
          xhr.setRequestHeader(header_key, req.headers[header_key]);
        });
      }
    }
  });
}
