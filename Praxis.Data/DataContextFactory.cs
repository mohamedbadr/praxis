using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Praxis.Data
{
    public class DataContextFactory : IDataContextFactory
    {
        private readonly DbContextOptions _options;

        public Claim Identity { get; set; }


        public DataContextFactory(string connectionString)
        {
            _options = new DbContextOptionsBuilder<DataContext>()
                .UseSqlServer(connectionString)
                .Options;
        }

        public IDataContext GetContext()
        {
            return new DataContext(_options, Identity);
        }
    }
}
