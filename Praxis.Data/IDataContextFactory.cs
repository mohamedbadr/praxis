using System.Security.Claims;

namespace Praxis.Data
{
    public interface IDataContextFactory
    {
        Claim Identity { get; set; }

        IDataContext GetContext();
    }
}
