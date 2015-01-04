using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Configuration;
using System.IO;
using System.Text;

namespace MisteryForest.Api
{
    public class MapController : ApiController
    {
        public HttpResponseMessage Post([FromBody]string value)
        {
            var path = ConfigurationManager.AppSettings["resourcesFolder"] + @"\maps\level1-tilemap.json";

            var sr = new StreamReader(path);
            var jsonString = sr.ReadToEnd();
            sr.Close();

            var response = Request.CreateResponse(HttpStatusCode.OK);

            response.Content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            return response;
        }
    }
}
