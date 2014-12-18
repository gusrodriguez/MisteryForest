using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MisteryForest.Api
{
    using System.IO;
    using System.Net.Http.Headers;
    using System.Text;

    public class MapController : ApiController
    {
        // GET api/map
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/map/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/map
        public HttpResponseMessage Post([FromBody]string value)
        {
            var path = @"C:\Projects\MisteryForest\MisteryForest\MisteryForest\maps\level1-tilemap.json";

            var sr = new StreamReader(path);

            var jsonString = sr.ReadToEnd();

            var response = Request.CreateResponse(HttpStatusCode.OK, jsonString);

            response.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            sr.Close();
 
            return response;
        }

        // PUT api/map/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/map/5
        public void Delete(int id)
        {
        }
    }
}
