using System.Threading.Tasks;

namespace Praxis.Api.Hub
{
    public interface ITypedHubClient
    {
        Task CompanyMessage();

        Task CustomerMessage();
    }
}
