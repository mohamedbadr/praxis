using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Praxis.Web.Configuration
{
    public class TokenSettings
    {
        public string Key { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int AccessTokenDuration { get; set; }
    }
}
